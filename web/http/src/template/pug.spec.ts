import { expect } from 'chai';

import { JSDOM } from 'jsdom';
import pug from 'pug';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (!global.__dirname) {
  global.__dirname = path.dirname(fileURLToPath(import.meta.url));
}

/**
 * 测试 Pug 模板引擎
 *
 * https://pugjs.org/api/getting-started.html
 */
describe('Test `pug` template engine', () => {
  /**
   * 测试通过 pug 模板字符串渲染 HTML
   */
  it('should render pug template', () => {
    const template = `
doctype html
html(lang="en")
head
  meta(charset="UTF-8")

  title Jade
  link(rel="stylesheet", href="/asset/css/test.css")

  script(src="/asset/js/test.js")
  script(type="text/javascript").
    $(".button").on("click", function () {
        alter("Hello");
    });
body
  #main
    button.button Click me`;

    const html = pug.render(template, { pretty: true });
    const doc = new JSDOM(html).window.document;

    let script = doc.querySelector('script[src=\'/asset/js/test.js\']');
    expect(script).to.be.not.null;

    script = doc.querySelector('script[type=\'text/javascript\']');
    expect(script).to.be.not.null;

    const button = doc.querySelector('body>#main>.button');
    expect(button?.textContent).to.eq('Click me');
  });

  /**
   * 测试渲染元素的属性和文本
   *
   * 通过 `元素.类(属性=值) 文本` 这种格式可以设置一个元素为 `<元素 class="类" 属性="值">文本</元素>`
   *
   * 通过 `元素#ID(属性=值) 文本` 这种格式可以设置一个元素为 `<元素 id="ID" 属性="值">文本</元素>`
   */
  it('should render element with attributes', () => {
    const template = 'a.button(href=href) Click me';

    const html = pug.render(template, { pretty: true, href: 'next-page.html' });
    expect(html).to.eq('<a class="button" href="next-page.html">Click me</a>');
  });

  /**
   * 测试渲染元素和其后的文本节点
   *
   * 通过 `| 文本` 可以设置一个文本节点, 紧跟着上一行设置的节点, 例如:
   *
   * ```
   * br
   * | Level3
   * ```
   *
   * 渲染为
   *
   * ```
   * <br/>Level3
   * ```
   */
  it('should render element text content #1', () => {
    const template = `
p Level1
  p Level2
  br
  | Level3`;

    // 渲染模板, 将 Level3 渲染为 <br/> 节点之后的文本节点
    const html = pug.render(template, { pretty: true });
    expect(html).to.eq(`
<p>Level1
  <p>Level2</p><br/>Level3
</p>`);
  });

  /**
   * 测试渲染元素和其后的文本节点
   *
   * 通过 `| #{变量名}` 可以将指定的变量渲染为文本节点内容
   *
   * 通过 `| !{变量名}` 可以将指定的变量渲染为文本节点内容, 且不对文本进行转义
   */
  it('should render element text content #2', () => {
    const template = `
input(type="radio", name="gender", value=val, checked=checked)
| #{val}`;

    // 渲染模板, 将 #{val} 渲染为 input 节点之后的文本节点
    const html = pug.render(template, {
      pretty: true, val: 'Male', checked: true,
    });
    expect(html).to.eq('\n<input type="radio" name="gender" value="Male" checked="checked"/>Male');
  });

  /**
   * 测试通过表达式结果对模板进行渲染
   */
  it('should render by result of expression', () => {
    const template = `
p(class=result ? "success" : "error") #{result ? "success" : "error"}`;

    // 渲染模板, 通过包含 result 变量的表达式结果渲染 HTML 模板
    const html = pug.render(template, { pretty: true, result: true });
    expect(html).to.eq('\n<p class="success">success</p>');
  });

  /**
   * 测试在模板中定义变量, 并使用这些变量渲染模板
   */
  it('should define variables in template', () => {
    // 本例中定义了 style 变量和 attrs 变量, 且在 attrs 变量中包含 style 变量
    // 通过 &attributes(attrs) 将 attrs 变量作为标签的属性进行渲染
    const template = `
- const style = { "color": "red", "background-color": "#ccc" };
- const attrs = { "id": "name", "type": "text", "name": "name", "maxlength": 100, style };

input&attributes(attrs)`;

    const html = pug.render(template, { pretty: true });
    expect(html).to.eq('\n<input id="name" ' +
      'type="text" name="name" maxlength="100" ' +
      'style="color:red;background-color:#ccc;"/>');
  });

  /**
   * 测试通过变量渲染标签文本
   *
   * `标签= 标签文本变量` (注意, `=` 左边不能有空格), 相当于 `标签 #{标签文本变量}`
   */
  it('should render text content by assignment operator', () => {
    // 相当于 p.name #{name}
    const template = 'p.name= name';

    const html = pug.render(template, { pretty: true, name: 'Alvin' });
    expect(html).to.eq('\n<p class="name">Alvin</p>');
  });

  /**
   * 测试通过表达式结果渲染 HTML 节点文本
   */
  it('should render text content by expression', () => {
    const template = `
- name = "<b>" + name + "</b>";

div.wrapper
  p= name
  p !{name}
  br
  | #{name}
  | !{name}`;

    const html = pug.render(template, { pretty: true, name: 'Alvin' });
    expect(html).to.eq(`
<div class="wrapper">
  <p>&lt;b&gt;Alvin&lt;/b&gt;</p>
  <p><b>Alvin</b></p><br/>&lt;b&gt;Alvin&lt;/b&gt;
<b>Alvin</b>
</div>`);
  });

  /**
   * 测试在模板渲染中使用条件分支语句
   */
  it('should render template by condition statements', () => {
    const template = `
.wrapper
  if status === "error"
    p.err Error
  else if status === "warning"
    p.warn Warning
  else
    p.info Info`;

    let html = pug.render(template, { pretty: true, status: 'warning' });
    expect(html).to.eq(`
<div class="wrapper">
  <p class="warn">Warning</p>
</div>`);

    html = pug.render(template, { pretty: true, status: 'error' });
    expect(html).to.eq(`
<div class="wrapper">
  <p class="err">Error</p>
</div>`);
  });

  /**
   * 测试在模板渲染中使用循环语句
   */
  it('should render template by loop statements', () => {
    const template = `
- const attrs = { "class": "page" }

ul
  for page in pages
    li&attributes(attrs)= page`;

    const html = pug.render(template, { pretty: true, pages: [1, 2, 3, 4, 5] });
    expect(html).to.eq(`
<ul>
  <li class="page">1</li>
  <li class="page">2</li>
  <li class="page">3</li>
  <li class="page">4</li>
  <li class="page">5</li>
</ul>`);
  });

  /**
   * 测试在模板渲染中使用迭代器
   */
  it('should render template by iterator', () => {
    const template = `
- const attrs = { "class": "page" }

ul
  each page, n in pages
    li&attributes(attrs)= page`;

    const html = pug.render(template, { pretty: true, pages: [1, 2, 3, 4, 5] });
    expect(html).to.eq(`
<ul>
  <li class="page">1</li>
  <li class="page">2</li>
  <li class="page">3</li>
  <li class="page">4</li>
  <li class="page">5</li>
</ul>`);
  });

  /**
   * 通过自定义的 Mixin 来渲染模板
   */
  it('should render template by user defined mixin structure', () => {
    const template = `
mixin user-list(users)
  ul.users
    each user in users
      li(data-name= user.name)= user.age

#wrapper
  +user-list(users)`;

    const html = pug.render(template, {
      pretty: true,
      users: [
        { name: 'Alvin', age: 34 },
        { name: 'Lily', age: 43 },
        { name: 'Pipy', age: 19 },
      ],
    });
    expect(html).to.eq(`
<div id="wrapper">
  <ul class="users">
    <li data-name="Alvin">34</li>
    <li data-name="Lily">43</li>
    <li data-name="Pipy">19</li>
  </ul>
</div>`);
  });

  /**
   * 测试预编译渲染函数
   */
  it('should precompile render function', () => {
    const template = `
html
  head
    title= title
  body
    p#age= age`;

    // 将模板预编译为渲染函数
    const renderFn = pug.compile(template, { pretty: true });
    expect(renderFn).to.be.a('function');

    // 通过渲染函数渲染模板
    const html = renderFn({ title: 'Demo', age: 34 });
    expect(html).to.eq(`
<html>
  <head>
    <title>Demo</title>
  </head>
  <body>
    <p id="age">34</p>
  </body>
</html>`);
  });

  /**
   * 测试异步渲染, 并通过回调函数获取渲染结果
   */
  it('should render template async and get result by callback function', done => {
    const template = `
html
  head
    title= title
  body
    p#age= age`;

    pug.render(
      template,
      {
        pretty: true,
        title: 'Demo',
        age: 34,
      },
      (err, html) => {
        if (err) {
          done(err);
          return;
        }
        expect(html).to.eq(`
<html>
  <head>
    <title>Demo</title>
  </head>
  <body>
    <p id="age">34</p>
  </body>
</html>`);
        done();
      });
  });

  // 模板文件名称
  const templateFile = path.join(__dirname, 'pug/index.pug');

  // 模板参数
  const templateArgs = {
    users: [
      { name: 'Alvin', age: 34 },
      { name: 'Lily', age: 43 },
      { name: 'Pipy', age: 19 },
    ],
  };

  /**
   * 测试通过模板文件渲染 HTML
   */
  it('should render template file', () => {
    // 渲染模板文件
    const html = pug.renderFile(templateFile, { pretty: true, ...templateArgs });

    // 解析渲染得到的 HTML
    const doc = new JSDOM(html).window.document;

    // 确认渲染正确
    let elem = doc.querySelector('title');
    expect(elem?.textContent).to.eq('Pug Demo');

    elem = doc.querySelector('script');
    expect(elem?.getAttribute('src')).to.eq('jquery.js');

    elem = doc.querySelector('#wrapper>#content');
    expect(elem?.textContent).to.eq('Hello World');

    const elems = doc.querySelectorAll('#wrapper>ul.users>li');
    expect(elems).to.has.length(3);
    expect(elems[0].getAttribute('data-name')).to.eq('Alvin');
    expect(elems[0].textContent).to.eq('34');
    expect(elems[1].getAttribute('data-name')).to.eq('Lily');
    expect(elems[1].textContent).to.eq('43');
    expect(elems[2].getAttribute('data-name')).to.eq('Pipy');
    expect(elems[2].textContent).to.eq('19');
  });

  /**
   * 测试通过预编译渲染函数对模板文件进行渲染
   */
  it('should render template file by precompile render function', () => {
    // 预编译渲染函数
    const renderFn = pug.compileFile(templateFile, { pretty: true });

    // 通过预编译函数渲染模板文件
    const html = renderFn(templateArgs);

    // 解析渲染得到的 HTML
    const doc = new JSDOM(html).window.document;

    // 确认渲染正确
    let elem = doc.querySelector('title');
    expect(elem?.textContent).to.eq('Pug Demo');

    elem = doc.querySelector('script');
    expect(elem?.getAttribute('src')).to.eq('jquery.js');

    elem = doc.querySelector('#wrapper>#content');
    expect(elem?.textContent).to.eq('Hello World');

    const elems = doc.querySelectorAll('#wrapper>ul.users>li');
    expect(elems).to.has.length(3);
    expect(elems[0].getAttribute('data-name')).to.eq('Alvin');
    expect(elems[0].textContent).to.eq('34');
    expect(elems[1].getAttribute('data-name')).to.eq('Lily');
    expect(elems[1].textContent).to.eq('43');
    expect(elems[2].getAttribute('data-name')).to.eq('Pipy');
    expect(elems[2].textContent).to.eq('19');
  });

  /**
   * 对模板文件进行异步渲染
   */
  it('should render template file async', done => {
    // 通过回调函数异步渲染模板文件
    pug.renderFile(
      templateFile,
      { pretty: true, ...templateArgs },
      (err, html) => {
        expect(err).to.be.null;

        // 解析渲染得到的 HTML
        const doc = new JSDOM(html).window.document;

        // 确认渲染正确
        let elem = doc.querySelector('title');
        expect(elem?.textContent).to.eq('Pug Demo');

        elem = doc.querySelector('script');
        expect(elem?.getAttribute('src')).to.eq('jquery.js');

        elem = doc.querySelector('#wrapper>#content');
        expect(elem?.textContent).to.eq('Hello World');

        const elems = doc.querySelectorAll('#wrapper>ul.users>li');
        expect(elems).to.has.length(3);
        expect(elems[0].getAttribute('data-name')).to.eq('Alvin');
        expect(elems[0].textContent).to.eq('34');
        expect(elems[1].getAttribute('data-name')).to.eq('Lily');
        expect(elems[1].textContent).to.eq('43');
        expect(elems[2].getAttribute('data-name')).to.eq('Pipy');
        expect(elems[2].textContent).to.eq('19');

        done();
      }
    );
  });
});
