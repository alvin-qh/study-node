const http = require("http");
const url = require("url");
const qs = require("querystring");

/**
 * 定义请求处理返回结果类
 */
class Result {
  /**
   * 构造器
   */
  constructor(code) {
    // 返回 HTTP 状态码
    this._code = code;
    // 返回内容字符编码
    this._encoding = "utf-8";
    // 返回内容类型
    this._contentType = "text/html";
    // 返回内容 JSON 对象
    this._json = null;
    // 返回内容 HTML 字符串
    this._html = "";
  }

  /**
   * 获取返回内容的 HTTP 状态码
   */
  get code() {
    return this._code;
  }

  /**
   * 获取返回内容的字符编码
   */
  get encoding() {
    return this._encoding;
  }

  /**
   * 获取返回内容的类型
   */
  get contentType() {
    return this._contentType;
  }

  /**
   * 获取返回的 JSON 对象
   */
  get json() {
    return this._json;
  }

  /**
   * 获取返回的 HTML 字符串
   */
  get html() {
    return this._html;
  }

  /**
   * 产生一个状态码为 200 的结果对象
   */
  static ok() {
    return new Result(200);
  }

  /**
   * 产生一个状态码为 400 的结果对象
   */
  static badRequest() {
    return new Result(400);
  }

  /**
   * 设置结果对象的字符编码
   */
  withEncoding(encoding) {
    this._encoding = encoding;
    return this;
  }

  /**
   * 设置结果对象的 JSON 内容
   */
  withJson(json) {
    this._contentType = "application/json";
    this._json = json;
    return this;
  }

  /**
   * 设置结果对象的 HTML 内容
   */
  withHtml(html) {
    this._contentType = "text/html";
    this._html = html;
    return this;
  }
}

/**
 * HTTP 服务端类
 */
class Server {
  /**
   * 构造器
   */
  constructor(router, encoding = "UTF-8") {
    this._server = this._create(router, encoding);
  }

  /**
   * 设置服务器监听端口和绑定地址并启动服务器监听
   */
  async listen(port, bindAddr = "0.0.0.0") {
    // 将服务器监听异步调用转为 Promise 对象返回
    return new Promise(resolve => {
      this._server.listen(port, bindAddr, () => {
        console.log(`Server listened on ${bindAddr}:${port}`);
        resolve();
      });
    });
  }

  /**
   * 关闭服务器
   * 注意, 此方法
   */
  shutdown() {
    this._server.close();
  }

  /**
   * 创建 HTTP 服务器对象
   */
  _create(router, encoding) {
    router = router || {};

    // 创建服务器对象, 设置请求处理回调函数
    return http.createServer((req, resp) => {
      // 获取请求的 URL
      const href = url.parse(req.url);
      console.log(`Incoming request from ${req.socket.remoteAddress}`);

      // 从路由表中获取对应的控制器函数
      const controller = router[href.pathname];
      if (controller) {
        // 通过控制器函数处理请求
        this._request(req, resp, href, encoding, controller);
      } else {
        // 返回 404 错误
        this._sendError(resp, 404, encoding);
      }
    });
  }

  /**
   * 向客户端发送错误
   */
  _sendError(resp, code, encoding) {
    resp.writeHead(code, {
      "Content-Type": `text/html; charset=${encoding}`,
      "Content-Length": 0,
    });
    resp.end();
  }

  /**
   * 处理客户端请求
   */
  _request(req, resp, href, encoding, controller) {
    // 处理响应发送完毕事件
    resp.on("finish", () => { 
      console.log(`\tSend response to: ${req.socket.remoteAddress}`);
    });

    // 请求字符编码
    req.setEncoding(encoding);

    let chunks = [];

    // 处理请求事件, 接收请求数据
    req.on("data", chunk => {
      console.log(`\tReceived data: ${chunk.length}`);

      // 拼接请求数据
      chunks += chunk;
      if (chunks.length > 1e6) {
        req.connection.destroy();
      }
    });

    req.on("end", () => {
      const data = {
        pathname: href.pathname,
        parameters: {},
        querystring: qs.parse(href.query),
        body: "",
      }

      if (href.query) {
        Object.assign(data.parameters, qs.parse(href.query));
      } else {
        data.body = chunks.join("");
      }

      const result = controller(data, resp);
      encoding = result.encoding || encoding;

      let body = "";
      switch (result.contentType) {
        case "text/html":
          body = result.html;
          break;
        case "application/json":
          body = JSON.stringify(result.body || null);
          break;
      }

      const headers = Object.assign({
        "Content-Type": `${result.contentType}; charset=${encoding}`,
        "Content-Length": Buffer.byteLength(body, encoding)
      }, result.headers || {});

      resp.writeHead(200, headers);
      resp.write(body, encoding);
      resp.end("");
    });
  }
}

// 定义请求路由表
const router = {
  /**
   * 
   */
  "/": () => Result.ok().withHtml(`
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Hello</title>
  <style type="text/css">
    div.main {
      width: 1000px;
      margin: 0 auto;
    }
    nav>div {
      text-align: right;
    }
    nav a {
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="main">
    <header>
      <nav>
        <div><a href="/d/version">Version</a></div>
      </nav>
    </header>
    <main>
      <section>
        <h2 align="center">Hello World</h2>
      </section>
    </main>
  </div>
</body>
</html>`),
  /**
   * 
   */
  "/d/version": () => Result.ok().json().withBody({
    version: "1.0.0",
    build: 101,
  }),
}

async function startServer(port, bindAddr = "0.0.0.0") {
  const server = new Server(router, "UTF-8");
  await server.listen(port, bindAddr);
  return server;
}

module.exports = startServer
