const { describe, it } = require("mocha");
const { expect } = require("chai");
const path = require("path");
const ejs = require("ejs");
const { JSDOM } = require("jsdom");


/**
 * 测试 EJS 模板引擎
 * 
 * 参考: https://ejs.co
 */
describe("test 'ejs' template engine", () => {
  // 测试用例 1, 用于测试模板字符串渲染
  const case1 = {
    template: "<h1><%= title %></h1>",
    arguments: { "title": "Hello" },
  }

  // 测试用例 2, 用于测试模板文件渲染
  const case2 = {
    file: {
      sync: path.join(__dirname, "ejs/index.ejs"),
      async: path.join(__dirname, "ejs/index-async.ejs"),
    },
    arguments: {
      "names": ["Alvin", "Lucy", "Lily", "Tom"]
    },
  }

  /**
   * 测试渲染 HTML 字符串
   */
  it("should render HTML string", () => {
    const html = ejs.render(case1.template, case1.arguments);
    expect(html).to.eq("<h1>Hello</h1>");
  });

  /**
   * 对 HTML 字符串进行预渲染
   */
  it("should render HTML string by precompile function", () => {
    // 编译产生渲染函数
    const renderFn = ejs.compile(case1.template);

    const html = renderFn(case1.arguments);
    expect(html).to.eq("<h1>Hello</h1>");
  });

  /**
   * 对 HTML 模板文件进行渲染
   * 
   * 通过调用回调函数返回渲染后的 HTML
   */
  it("should render HTML template file", done => {
    // 渲染 HTML 模板文件
    ejs.renderFile(
      case2.file.sync,
      case2.arguments,
      { rmWhitespace: true },
      (err, html) => {
        expect(err).to.be.null;

        const doc = new JSDOM(html).window.document;

        const lis = doc.querySelectorAll("#wrapper>.names>ul>li");
        expect(lis).has.length(4);
        expect(lis[0].textContent).to.eq("Alvin");
        expect(lis[1].textContent).to.eq("Lucy");
        expect(lis[2].textContent).to.eq("Lily");
        expect(lis[3].textContent).to.eq("Tom");

        done();
      });
  });

  /**
   * 对 HTML 模板文件进行渲染
   * 
   * 异步渲染可以在模板中使用异步模板函数, 例如 `async include` 等
   */
  it("should render HTML template file async", async () => {
    const html = await ejs.renderFile(
      case2.file.async,
      case2.arguments,
      { async: true },
    );

    const doc = new JSDOM(html).window.document;

    const lis = doc.querySelectorAll("#wrapper>.names>ul>li");
    expect(lis).has.length(4);
    expect(lis[0].textContent).to.eq("Alvin");
    expect(lis[1].textContent).to.eq("Lucy");
    expect(lis[2].textContent).to.eq("Lily");
    expect(lis[3].textContent).to.eq("Tom");
  });
});

