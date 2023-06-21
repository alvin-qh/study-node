const { describe, it } = require("mocha");
const { startServer, get, post } = require("./http");
const { expect } = require("chai");
const { JSDOM } = require("jsdom");

/**
 * 测试 HTTP 服务和客户端
 */
describe("test 'http' module", () => {
  /**
   * 是否可以启动服务并从客户端进行访问
   */
  it("should create http server and can be visited by client", async () => {
    // 实例化 HTTP 服务端
    const server = await startServer(3000);

    try {
      // 通过 GET 请求访问服务端 / 地址, 确认返回响应正确
      let resp = await get("http://localhost:3000");
      expect(resp.code).to.eq(200);
      expect(resp.headers).to.have.property("content-type", "text/html; charset=utf-8");
      expect(resp.headers).to.have.property("content-length", "613");

      // 对返回的 HTML 内容进行解析, 确认内容正确
      const doc = new JSDOM(resp.data).window.document;
      const content = doc.querySelector(".main main section h2").textContent;
      expect(content).to.eq("Hello World");

      // 通过 POST 请求访问服务端 /d/version 地址
      resp = await post("http://localhost:3000/d/version");
      expect(resp.code).to.eq(200);
      expect(resp.headers).to.have.property("content-type", "application/json; charset=utf-8");
      expect(resp.headers).to.have.property("content-length", "31");

      // 对返回的 JSON 内容进行解析, 确认内容正确
      const json = JSON.parse(resp.data);
      expect(json).to.have.property("version", "1.0.0");
      expect(json).to.have.property("build", 101);
    } finally {
      server.shutdown();
    }
  });
});
