import * as http from 'node:http';
import * as qs from 'node:querystring';
import { URL, fileURLToPath } from 'node:url';
import path from 'node:path';

import UrlPattern from 'url-pattern';
import pug from 'pug';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 表示请求上下文的类型
type Context = Record<string, unknown>;

/**
 * 表示一次响应的类型
 */
class Response {
  status: number = 200;
  headers: Record<string, string> = {};
  body?: string;

  static redirect(path: string, headers?: Record<string, unknown>): Response {
    return {
      status: 302,
      headers: {
        ...(headers || {}),
        location: path,
      },
    };
  }

  static json(data: Record<string, unknown>, headers?: Record<string, unknown>): Response {
    return {
      status: 200,
      headers: {
        ...(headers || {}),
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    };
  }

  static html(view: string, data: Record<string, unknown>, headers?: Record<string, unknown>): Response {
    let body = '';
    pug.renderFile(
      path.join(__dirname, `/views/${view ?? 'index'}.pug`),
      {
        errors: {},
        ...data,
      },
      (err, html) => {
        if (err) {
          throw err;
        }
        body = html;
      });

    return {
      status: 200,
      headers: {
        ...(headers || {}),
        'content-type': 'text/html; charset=UTF-8',
      },
      body,
    };
  }
}

/**
 * 表示一个路由处理器的类型
 */
interface Router {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: UrlPattern
  route: (ctx: Context) => Response
}

// 请求路由表对象
const routes: Router[] = [
  {
    method: 'GET',
    path: new UrlPattern('/'),
    route(ctx: Context): Response {
      console.log(ctx.parameters);
      let message = 'Hello node.js';
      const param = ctx.parameters as Record<string, string>;

      // check if name argument exist
      if (param.name) {
        message = `${message}, have fun ${param.name}`;
      }
      return Response.json({ status: 'success', message }, { auth: 'alvin' });
    },
  },
  {
    method: 'GET',
    path: new UrlPattern('/login'),
    route(ctx: Context): Response {
      return Response.html('login', { name: 'Alvin' });
    },
  },
  {
    method: 'POST',
    path: new UrlPattern('/login'),
    route(ctx: Context): Response {
      const { name, password } = ctx.parameters as Record<string, string>;
      if (!name || !password) {
        const errors: Record<string, unknown> = {};
        if (!name) {
          errors.name = 'name cannot be empty';
        }
        if (!password) {
          errors.password = 'password cannot be empty';
        }
        return Response.html('login', {
          errors, name, password,
        });
      }
      return Response.redirect(`/?name=${name}`);
    },
  },
  {
    method: 'GET',
    path: new UrlPattern('/redirect'),
    route(ctx: Context): Response {
      const param = ctx.parameters as Record<string, string>;

      let url = '/';
      if (param.url) {
        url = param.url;
      }
      return Response.redirect(url);
    },
  },
];

/**
 * 表示错误处理的类型
 */
const exceptions: Record<number, (ctx: Context) => Response> = {
  404: (ctx: Context): Response => {
    const resp = Response.json({ message: 'Resource not found.' });
    resp.status = 404;
    return resp;
  },
};

// 创建 HTTP 服务器对象
const server = http.createServer((request, response) => {
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
      const contentType = ((contentTypes: string | string[]) => {
        if (Array.isArray(contentTypes)) {
          return contentTypes[0];
        }
        return contentTypes;
      })(request.headers['content-type'] ?? '');

      // 将请求数据转换为参数存入上下文对象
      if (contentType.startsWith('application/json')) {
        Object.assign(context.parameters, JSON.parse(body));
      }
      else {
        Object.assign(context.parameters, qs.parse(body));
      }
    }

    const route = routes.find((r) => {
      if (r.method !== request.method) {
        return false;
      }

      const param = r.path.match(url.pathname || '/');
      if (!param) {
        return false;
      }

      Object.assign(context.parameters, param);
      return true;
    })?.route || exceptions[404];

    try {
      const result = route(context);

      response.writeHead(result.status, result.headers || {});
      response.end(result.body || '');
    }
    catch (e) {
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
    }
    catch (e) {
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
    server.close((err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}
