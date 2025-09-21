import { URL /* fileURLToPath */ } from 'node:url';
import http from 'node:http';
import path from 'node:path';
import qs from 'node:querystring';

import UrlPattern from 'url-pattern';
import pug from 'pug';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 表示请求上下文的类型
type Context = Record<string, unknown>;

/**
 * 定义客户端响应的类
 */
class Response {
  status: number = 200;
  headers: Record<string, string> = {};
  body?: string;

  /**
   * 创建一个表示重定向的 `Response` 对象
   *
   * @param path 重定向路径
   * @param headers 要返回给客户端的 HTTP 头信息
   * @returns `Response` 对象, 表示一次响应
   */
  static redirect(path: string, headers?: Record<string, unknown>): Response {
    return {
      status: 302,
      headers: {
        ...(headers ?? {}),
        location: path,
      },
    };
  }

  /**
   * 创建一个包含 JSON 数据的 `Response` 对象
   *
   * @param data JSON 对象
   * @param headers 要返回给客户端的 HTTP 头信息
   * @returns `Response` 对象, 表示一次响应
   */
  static json(data: Record<string, unknown>, headers?: Record<string, unknown>): Response {
    return {
      status: 200,
      headers: {
        ...(headers ?? {}),
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    };
  }

  /**
   * 创建一个包含 HTML 内容的 `Response` 对象
   *
   * @param view HTML 模板文件名称
   * @param data 要渲染在 HTML 模板中的数据对象
   * @param headers 要返回给客户端的 HTTP 头信息
   * @returns 包含 HTML 内容的 `Response` 对象
   */
  static html(view: string, data: Record<string, unknown>, headers?: Record<string, unknown>): Response {
    let body = '';

    // 通过 PUG 模板引擎渲染 HTML 模板
    pug.renderFile(
      path.join(process.cwd(), `template/view/${view ?? 'index'}.pug`),
      {
        errors: {},
        ...data,
      },
      (err, html) => {
        if (err) {
          throw err;
        }

        // 将生成的 HTML 内容保存到 `body` 变量中
        body = html;
      });

    // 返回 `Response` 对象, 其中包含生成的 HTML 内容
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

/**
 * 创建路由表数组
 */
const routes: Router[] = [
  // 定义 `GET /` 路由, 接受 `?name` 请求参数, 返回一个 JSON 对象作为响应
  {
    method: 'GET',
    path: new UrlPattern('/'),
    route(ctx: Context): Response {
      let message = 'Hello node.js';
      const param = ctx.parameters as Record<string, string>;

      // 如果请求参数中包含 `name` 参数, 则将 `name` 参数添加到 `message` 中
      if (param.name) {
        message = `${message}, have fun ${param.name}`;
      }

      // 返回 `Response` 对象, 其中包含生成的 JSON 数据
      return Response.json(
        {
          status: 'success',
          message,
        },
        {
          auth: 'alvin',
        }
      );
    },
  },

  // 定义 `GET /login` 路由, 返回用户登录页面
  {
    method: 'GET',
    path: new UrlPattern('/login'),
    route(ctx: Context): Response {
      return Response.html('login', {
        name: 'Alvin',
      });
    },
  },

  // 定义 `POST /login` 路由, 接受包含用户名密码的表单, 返回 HTML 重定向
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
          errors,
          name,
          password,
        });
      }

      // 返回重定向地址
      return Response.redirect(`/?name=${name}`);
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

    // 查找路由表数组, 匹配本次请求对应的路由处理函数
    const route = routes.find((r) => {
      // 比较请求方法是否匹配
      if (r.method !== request.method) {
        return false;
      }

      // 匹配 URL 路径
      const param = r.path.match(url.pathname ?? '/');
      if (!param) {
        return false;
      }

      // 合并请求参数
      context.parameters = {
        ...context.parameters,
        ...param,
      };

      return true;
    })?.route ?? exceptions[404];

    try {
      // 调用路由处理函数, 返回响应
      const result = route(context);

      // 设置响应头
      response.writeHead(result.status, result.headers ?? {});

      // 设置响应内容
      response.end(result.body ?? '');
    }
    catch (e) {
      console.error(e);
    }
  });
});

/**
 * 启动服务器
 *
 * @param port 监听端口号
 * @param host 绑定地址
 * @returns 异步结果
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
 * @returns 异步结果
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
