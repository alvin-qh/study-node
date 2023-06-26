const { describe, it } = require("mocha");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const { expect } = require("chai");

/**
 * 测试 Cheerio 模块, 用于在服务端以类似 jQuery 的方式解析 HTML
 */
describe("test 'cheerio' module", () => {
  it("should select DOM from HTML by cheerio", async () => {
    // 从文件中读取 HTML 内容
    const html = await fs.promises.readFile(path.join(__dirname, "cheerio/example.html"), "utf-8");
    expect(html).be.ok;

    // 加载 HTML 字符串
    const $ = cheerio.load(html);

    expect($("html>head>title")[0].tagName).to.eq("title");
    expect($("html>head>title").text()).to.eq("Cheero Example");

    expect($("#main>.block")).has.length(4);
    $("#main>.block").each((n, elem) => {
      expect($(elem)[0].tagName).to.eq("section");
      expect($(elem).attr("class")).to.eq("block");
      expect($(elem).text()).to.eq(`Section${n + 1}`);
    });
  });
});
