import { URL, fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { parse } from 'node:querystring';
import path from 'node:path';

import pug from 'pug';

if (!global.__dirname) {
  global.__dirname = path.dirname(fileURLToPath(import.meta.url));
}

type Context = Record<string, unknown>;

type Response = Record<string, unknown>;

declare type Controller = (context: Context) => Response;

// 请求路由表对象
const routes: Record<string, Controller> = {
  // GET http://localhost:8081/, index page, return json object
  'GET /'(context: Context): Response {
    let message = 'Hello node.js';

    const param = context.parameters as Record<string, string>;

    // check if name argument exist
    if (param.name) {
      message = `${message}, have fun ${param.name}`;
    }

    return {
      type: 'json',
      headers: { auth: 'alvin' },
      content: {
        status: 'success',
        message,
      },
    };
  },

  // GET http://localhost:8081/login, return html view
  'GET /login'(): Response {
    return {
      type: 'html',
      view: 'login',
      parameters: { name: 'Alvin' },
    };
  },

  // POST http://localhost:8081/login, return redirect url
  'POST /login'(context: Context): Response {
    const { name, password } = context.parameters as Record<string, string>;
    if (!name || !password) {
      const errors: Record<string, unknown> = {};
      if (!name) {
        errors.name = 'name cannot be empty';
      }
      if (!password) {
        errors.password = 'password cannot be empty';
      }
      return {
        type: 'html',
        view: 'login',
        parameters: {
          errors,
          name,
          password,
        },
      };
    }

    return {
      type: 'redirect',
      url: `/?name=${name}`,
    };
  },

  // GET http://localhost:8081/redirect, return redirect url
  'GET /redirect'(context: Context): Response {
    const param = context.parameters as Record<string, string>;

    let url = '/';
    if (param.url) {
      url = param.url;
    }
    return {
      type: 'redirect',
      url,
    };
  },

  // 404 error
  '404'(): Response {
    return {
      type: 'json',
      content: {
        status: 'error',
        message: 'Resource not found.',
      },
    };
  },
};

// 创建 HTTP 服务器对象
const server = createServer((request, response) => {
  // 解析请求 URL
  const url = new URL(request.url!, `http://${request.headers.host}`);

  // 处理请求参数
  const parameters: Record<string, string> = {};
  url.searchParams.forEach((val, name) => {
    parameters[name] = val;
  });

  // 生成请求上下文
  const context = {
    headers: request.headers,
    parameters,
  };

  // 接收请求数据
  const chunks: Buffer[] = [];
  request.on('data', chunk => chunks.push(Buffer.from(chunk)));

  // 完成请求接收, 处理请求
  request.on('end', () => {
    if (chunks.length > 0) {
      const body = Buffer.concat(chunks).toString('utf-8');

      // 获取请求类型
      const contentTypes: string | string[] = request.headers['content-type'] ?? '';
      let contentType: string;
      if (Array.isArray(contentTypes)) {
        [contentType] = contentTypes;
      } else {
        contentType = contentTypes;
      }

      // 将请求数据转换为参数存入上下文对象
      if (contentType.startsWith('application/json')) {
        Object.assign(context.parameters, JSON.parse(body));
      } else {
        Object.assign(context.parameters, parse(body));
      }
    }

    let statusCode = 200;
    let route = routes[`${request.method} ${url.pathname || '/'}`];
    if (!route) {
      route = routes['404'];
      statusCode = 404;
    }

    try {
      const result = route(context);

      switch (result.type) {
        case 'redirect':
          response.writeHead(302, { location: result.url as string });
          response.end();
          break;
        case 'json':
          response.writeHead(statusCode, {
            'Content-Type': 'application/json',
            ...result.headers as Record<string, string>,
          });
          response.end(JSON.stringify(result.content));
          break;
        case 'html':
          response.writeHead(result.status as number ?? 200, {
            'Content-Type': 'text/html',
            ...result.headers as Record<string, string>,
          });

          pug.renderFile(
            path.join(__dirname, `/views/${result.view ?? 'index'}.pug`),
            {
              errors: {},
              ...result.parameters as Record<string, string>,
            },
            (err, html) => {
              if (err) {
                throw err;
              }
              response.end(html);
            }
          );
          break;
        default:
          break;
      }
    } catch (e) {
      console.error(e);
    }
  });
});

/**
 * 启动服务器
 *
 * @param {number} port 监听端口号
 * @param {string} host 绑定地址
 * @returns {Promise<void>} 异步结果
 */
export async function start(port: number, host: string = '0.0.0.0'): Promise<void> {
  server.maxHeadersCount = 1000;
  server.timeout = 120000;

  await new Promise<void>((resolve, reject) => {
    try {
      server.listen(port, host, () => {
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * 关闭服务器
 *
 * @returns {Promise<void>} 异步结果
 */
export async function close(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    if (!server) {
      reject(new Error('Server is shutdown already'));
    }

    server.removeAllListeners();
    server.close(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
