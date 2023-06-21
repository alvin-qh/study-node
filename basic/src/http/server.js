const http = require("http");
const url = require("url");
const qs = require("querystring");

class Result {
  constructor(code) {
    this._code = code;
    this._encoding = "utf-8";
    this._contentType = "text/html";
    this._body = null;
    this._html = "";
  }

  get code() {
    return this._code;
  }

  get encoding() {
    return this._encoding;
  }

  get contentType() {
    return this._contentType;
  }

  get body() {
    return this._body;
  }

  get html() {
    return this._html;
  }

  static ok() {
    return new Result(200);
  }

  static badRequest() {
    return new Result(400);
  }

  json() {
    this._contentType = "application/json";
    return this;
  }

  withEncoding(encoding) {
    this._encoding = encoding;
    return this;
  }

  withBody(obj) {
    this._body = obj;
    return this;
  }

  withHtml(html) {
    this._html = html;
    return this;
  }
}

class Server {
  constructor(router, encoding = "UTF-8") {
    this._server = this._create(router, encoding);
  }

  listen(port, bindAddr = "0.0.0.0") {
    this._server.listen(port, bindAddr);
  }

  shutdown() {
    this._server.close();
  }

  _create(router, encoding) {
    router = router || {};
    return http.createServer((req, resp) => {
      const href = url.parse(req.url);
      console.log(`Incoming request from ${req.socket.remoteAddress}`);

      const controller = router[href.pathname];
      if (controller) {
        this._request(req, resp, href, encoding, controller);
      } else {
        this._sendError(resp, 404, encoding);
      }
    });
  }

  _sendError(resp, code, encoding) {
    resp.writeHead(code, {
      "Content-Type": `text/html; charset=${encoding}`,
      "Content-Length": 0,
    });
    resp.end();
  }

  _request(req, resp, href, encoding, callback) {
    resp.on("finish", () => { });

    req.setEncoding("utf-8");

    const chunks = [];
    req.on("data", chunk => {
      console.log(`\tReceived data: ${chunk.length}`);

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

      const result = callback(data, resp);
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

function startServer(port, bindAddr = "0.0.0.0") {
  const server = new Server(router, "UTF-8");
  server.listen(port, bindAddr);
  return server;
}

module.exports = startServer
