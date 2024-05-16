const http = require('http');
const url = require('url');
const qs = require('querystring');

/**
 * 定义请求处理返回结果类
 */
class Result {
  /**
   * 构造器
   *
   * @param {string} code HTTP 状态码
   */
  constructor(code) {
    // 返回 HTTP 状态码
    this._code = code;

    // 返回内容字符编码
    this._encoding = 'utf-8';

    // 返回内容类型
    this._contentType = 'text/html';

    // 返回内容 JSON 对象
    this._json = null;

    // 返回内容 HTML 字符串
    this._html = '';
  }

  /**
   * 获取返回内容的 HTTP 状态码
   *
   * @returns {number} HTTP 状态码
   */
  get code() {
    return this._code;
  }

  /**
   * 获取返回内容的字符编码
   *
   * @returns {string} 返回结果的字符编码
   */
  get encoding() {
    return this._encoding;
  }

  /**
   * 获取返回内容的类型
   *
   * @returns {string} 返回结果的内容类型
   */
  get contentType() {
    return this._contentType;
  }

  /**
   * 获取返回的 JSON 对象
   *
   * @returns {object} 返回结果的 JSON 对象
   */
  get json() {
    return this._json;
  }

  /**
   * 获取返回的 HTML 字符串
   *
   * @returns {string} 返回结果的 HTML 内容
   */
  get html() {
    return this._html;
  }

  /**
   * 产生一个状态码为 200 的结果对象
   *
   * @returns {Result} `Result` 类型对象, 其 HTTP 状态码为 200
   */
  static ok() {
    return new Result(200);
  }

  /**
   * 产生一个状态码为 400 的结果对象
   *
   * @returns {Result} `Result` 类型对象, 其 HTTP 状态码为 400
   */
  static badRequest() {
    return new Result(400);
  }

  /**
   * 设置结果内容的字符编码
   *
   * @param {string} encoding 字符编码名称
   * @returns {Result} 当前对象
   */
  withEncoding(encoding) {
    this._encoding = encoding;
    return this;
  }

  /**
   * 设置结果内容的 JSON 对象
   *
   * @param {object} json JSON 对象
   * @returns {Result} 当前对象
   */
  withJson(json) {
    this._contentType = 'application/json';
    this._json = json;
    return this;
  }

  /**
   * 设置结果内容的 HTML 字符串
   *
   * @param {string} html HTML 内容字符串
   * @returns {Result} 当前对象
   */
  withHtml(html) {
    this._contentType = 'text/html';
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
   *
   * @param {object} router 路由表对象
   * @param {string} [encoding="UTF-8"] 默认的请求编码
   */
  constructor(router, encoding = 'UTF-8') {
    this._server = this._create(router, encoding);
  }

  /**
   * 设置服务器监听端口和绑定地址并启动服务器监听
   *
   * @param {number} port 服务对象监听的端口号
   * @param {string} [bindAddr="0.0.0.0"] 服务对象绑定的地址
   * @returns {Promise<void>} 返回表示异步调用的 `Promise` 对象
   */
  async listen(port, bindAddr = '0.0.0.0') {
    // 将服务器监听异步调用转为 Promise 对象返回
    return new Promise(resolve => {
      // 启动监听
      this._server.listen(port, bindAddr, () => {
        // 监听成功后的回调
        console.log(`Server listened on ${bindAddr}:${port}`);
        // 表示异步调用成功
        resolve();
      });
    });
  }

  /**
   * 关闭服务器
   *
   * 注意, 此方法必须在 `listen` 完全执行成功后才能调用
   */
  shutdown() {
    // 关闭服务端对象
    this._server.close();
  }

  /**
   * 创建 HTTP 服务器对象
   *
   * @param {object} router 路由表对象
   * @param {string} encoding 请求默认字符编码
   * @returns {http.Server} 服务端对象实例
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
   *
   * @param {http.ServerResponse} resp 服务端响应对象
   * @param {number} code HTTP 状态码
   * @param {string} encoding 响应字符编码
   */
  // eslint-disable-next-line class-methods-use-this
  _sendError(resp, code, encoding) {
    // 向响应对象中写入 HTTP header
    resp.writeHead(code, {
      'Content-Type': `text/html; charset=${encoding}`,
      'Content-Length': 0
    });

    // 完成响应输出
    resp.end();
  }

  /**
   * 处理客户端请求
   *
   * @param {http.IncomingMessage} req 请求对象
   * @param {http.ServerResponse} resp 响应对象
   * @param {string} href 访问地址
   * @param {string} encoding 默认的请求字符编码
   * @param {Function} controller 能够处理该请求的控制器函数
   */
  // eslint-disable-next-line class-methods-use-this
  _request(req, resp, href, encoding, controller) {
    // 处理响应发送完毕事件
    resp.on('finish', () => {
      console.log(`\tSend response to: ${req.socket.remoteAddress}`);
    });

    // 请求字符编码
    req.setEncoding(encoding);

    const chunks = [];

    // 处理请求事件, 接收请求数据
    req.on('data', chunk => {
      console.log(`\tReceived data: ${chunk.length}`);

      // 拼接请求数据
      chunks.push(Buffer.from(chunk));
    });

    // 处理请求完成事件, 即一个请求的数据已经完整发送
    req.on('end', () => {
      const buf = Buffer.concat(chunks);

      // 组织请求数据对象
      const data = {
        pathname: href.pathname, // 请求 URL
        parameters: {}, // 请求参数
        querystring: qs.parse(href.query), // 请求 URL 中包含的 Query String
        body: buf.toString(encoding) // 将请求过程中接收的数据作为请求内容
      };

      // 如果请求中包含 Query String, 则将其解析后作为请求参数的一部分
      if (href.query) {
        Object.assign(data.parameters, qs.parse(href.query));
      }

      // 调用控制器函数, 处理本次请求数据
      const result = controller(data, resp);

      // 获取返回结果的字符编码
      encoding = result.encoding || encoding;

      let body = '';
      // 根据返回结果的类型不同, 产生不同的返回内容
      switch (result.contentType) {
      case 'text/html':
        body = result.html;
        break;
      case 'application/json':
        body = JSON.stringify(result.json || null);
        break;
      default:
        throw new Error(`Unsupported content type: ${result.contentType}`);
      }

      // 生成返回响应的 Header
      const headers = {
        'Content-Type': `${result.contentType}; charset=${encoding}`,
        'Content-Length': Buffer.byteLength(body, encoding), ...result.headers || {}
      };

      // 发送响应 Header
      resp.writeHead(200, headers);

      // 发送响应内容
      resp.write(body, encoding);
      // 结束响应发送
      resp.end('');
    });
  }
}

// 定义请求路由表
const router = {
  /**
   * 处理到 / 的请求, 返回一段 HTML 内容
   */
  '/': () => Result.ok().withHtml(`
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
   * 处理 /d/version 请求, 返回一个 JSON 对象
   */
  '/d/version': () => Result.ok().withJson({
    version: '1.0.0',
    build: 101
  })
};

/**
 * 启动 HTTP 服务器, 指定服务监听的端口号和地址
 *
 * @param {number} port 服务监听的端口号
 * @param {string} bindAddr 服务绑定的地址
 * @returns {Server} 服务端对象
 */
async function startServer(port, bindAddr = '0.0.0.0') {
  // 创建服务对象
  const server = new Server(router, 'UTF-8');

  // 等待服务对象完成监听
  await server.listen(port, bindAddr);
  return server;
}

// 导出函数
module.exports = startServer;
