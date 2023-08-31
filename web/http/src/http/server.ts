import { createServer } from "http";
import { parse } from "querystring";
import { URL } from "url";
import pug from "pug";
import path from "path";

declare type Context = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

declare type Response = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

declare type Controller = (context: Context) => Response;

// 请求路由表对象
const routes: { [key: string]: Controller } = {
  // GET http://localhost:8081/, index page, return json object
  ["GET /"](context: Context): Response {
    let message = "Hello node.js";

    // check if name argument exist
    if (context.parameters.name) {
      message = `${message}, have fun ${context.parameters.name}`;
    }

    return {
      type: "json",
      headers: {
        auth: "alvin"
      },
      content: {
        status: "success",
        message: message
      }
    };
  },

  // GET http://localhost:8081/login, return html view
  ["GET /login"](): Response {
    return {
      type: "html",
      view: "login",
      parameters: {
        name: "Alvin"
      }
    };
  },

  // POST http://localhost:8081/login, return redirect url
  ["POST /login"](context: Context): Response {
    const name = context.parameters.name;
    const password = context.parameters.password;
    if (!name || !password) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errors: { [key: string]: any } = {};
      if (!name) {
        errors["name"] = "name cannot be empty";
      }
      if (!password) {
        errors["password"] = "password cannot be empty";
      }
      return {
        type: "html",
        view: "login",
        parameters: {
          errors: errors,
          name: name,
          password: password
        }
      };
    }

    return {
      type: "redirect",
      url: `/?name=${name}`
    };
  },

  // GET http://localhost:8081/redirect, return redirect url
  ["GET /redirect"](context: Context): Response {
    let url = "/";
    if (context.parameters.url) {
      url = context.parameters.url;
    }
    return {
      type: "redirect",
      url: url
    };
  },

  // 404 error
  ["404"](): Response {
    return {
      type: "json",
      content: {
        status: "error",
        message: "Resource not found."
      }
    };
  }
};

// 创建 HTTP 服务器对象
const server = createServer((request, response) => {
  // 解析请求 URL
  const url = new URL(request.url!, `http://${request.headers.host}`);

  // 处理请求参数
  const parameters: { [key: string]: string } = {};
  url.searchParams.forEach((val, name) => {
    parameters[name] = val;
  });

  // 生成请求上下文
  const context = {
    headers: request.headers,
    parameters,
  };

  // 接收请求数据
  const chunks: Array<Buffer> = [];
  request.on("data", chunk => chunks.push(Buffer.from(chunk)));

  // 完成请求接收, 处理请求
  request.on("end", () => {
    if (chunks.length > 0) {
      const body = Buffer.concat(chunks).toString("utf-8");

      // 获取请求类型
      let contentType = request.headers["content-type"] ?? "";
      if (Array.isArray(contentType)) {
        contentType = contentType[0];
      }

      // 将请求数据转换为参数存入上下文对象
      if (contentType.startsWith("application/json")) {
        Object.assign(context.parameters, JSON.parse(body));
      } else {
        Object.assign(context.parameters, parse(body));
      }
    }

    let statusCode = 200;
    let route = routes[`${request.method} ${url.pathname || "/"}`];
    if (!route) {
      route = routes["404"];
      statusCode = 404;
    }

    try {
      const result = route(context);

      switch (result.type) {
      case "redirect":
        response.writeHead(302, { "Location": result.url });
        response.end();
        break;
      case "json":
        response.writeHead(statusCode, {
          "Content-Type": "application/json",
          ...result.headers
        });
        response.end(JSON.stringify(result.content));
        break;
      case "html":
        response.writeHead(result.status ?? 200, {
          "Content-Type": "text/html",
          ...result.headers
        });

        pug.renderFile(
          path.join(__dirname, `/views/${result.view ?? "index"}.pug`),
          {
            errors: {},
            ...result.parameters
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
function start(port: number, host: string = "0.0.0.0"): Promise<void> {
  server.maxHeadersCount = 1000;
  server.timeout = 120000;

  return new Promise((resolve, reject) => {
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
function close(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!server) {
      reject();
    }

    server.removeAllListeners();
    server.close(err => {
      if (err) {
        reject(err);
      } {
        resolve();
      }
    });
  });
}


export { close, start };
