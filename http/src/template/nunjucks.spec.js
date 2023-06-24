const { expect } = require("chai");
const { it, describe } = require("mocha");
const nunjucks = require("nunjucks");

// 配置 nunjucks 模板引擎
nunjucks.configure({
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,

});

// 安装 nunjucks 的 jinja 模块
nunjucks.installJinjaCompat();

/**
 * 测试 Nunjucks 模板引擎
 * 
 * https://mozilla.github.io/nunjucks/
 */
describe("test 'nunjucks' template engine", () => {
  /**
   * 将模板字符串渲染为 HTML
   */
  it("should render string template #1", () => {
    const template = '<b>{{ name }}</b>';

    const html = nunjucks.renderString(template, { name: "Alvin" });
    expect(html).to.eq('<b>Alvin</b>');
  });

  /**
   * 渲染 HTML 元素的属性值
   */
  it("should render string template #2", () => {
    const template = '<button class="{{ className }}">{{ title }}</button>';

    const html = nunjucks.renderString(template, { className: "warning", title: "Click me" });
    expect(html).to.eq('<button class="warning">Click me</button>');
  });

  /**
   * 渲染 HTML 元素的属性名和属性值
   */
  it("should render string template #3", () => {
    const template = '<button {{ attrName }}="{{ attrValue }}">{{ title }}</button>';

    const html = nunjucks.renderString(template, { attrName: "class", attrValue: "warning", title: "Click me" });
    expect(html).to.eq('<button class="warning">Click me</button>');
  });

  /**
   * 在模板字符串中定义变量
   * 
   * 通过 `{%` 和 `%}` 包围的为 nunjucks 控制代码, 可以增加 `-` 消除生成 HTML 中的空白行, 例如: `{%-` 和 `-%}`
   */
  it("should define variable in template string", () => {
    const template = `
{%- set gender = { M: "Male", F: "Female" } %}
<span>Gender: {{ gender[user.gender] or "Unknown" }}</span>`;

    const html = nunjucks.renderString(template, { user: { gender: "M" } });
    expect(html).to.eq('<span>Gender: Male</span>');
  });

  /**
   * 在模板中使用条件语句
   */
  it("should use condition statements in template", () => {
    const template = `
{%- if user.gender == "M" -%}
  <span>Gender: Male</span>
{%- elif user.gender == "F" -%}
  <span>Gender: Female</span>
{%- else -%}
  <span>Gender: Unknown</span>
{% endif %}`;

    const html = nunjucks.renderString(template, { user: { gender: "M" } });
    expect(html).to.eq('<span>Gender: Male</span>');
  });

  /**
   * 在模板中使用循环语句
   */
  it("should use loop statements in template", () => {
    const template = `
<ul>
{% for job in jobs %}
  <li>{{ job }}</li>
{% endfor %}
</ul>`;

    const html = nunjucks.renderString(template, { jobs: ["Teacher", "Developer", "Manager"] });
    expect(html).to.eq(`
<ul>
  <li>Teacher</li>
  <li>Developer</li>
  <li>Manager</li>
</ul>`);
  });

  /**
   * 在模板循环语句中使用 `loop` 循环对象
   * 
   * - `loop.index`, 循环索引号, 每次循环加 `1`, 从 `1` 开始;
   * - `loop.index0`, 循环索引号, 每次循环加 `1`, 从 `0` 开始;
   * - `loop.revindex`, 循环反向索引号, 每次循环减 `1`, 到 `1` 为止;
   * - `loop.revindex0`, 循环反向索引号, 每次循环减 `1`, 到 `0` 为止;
   * - `loop.first`, 布尔值, 表示是否为第一轮循环;
   * - `loop.last`, 布尔值, 表示是否为最后一轮循环;
   * - `loop.length`, 总循环次数;
   */
  it("should use loop object in loop statement of template", () => {
    const template = `
<table>
<tbody>
{% set classNames = ["single", "double"] -%}

{% for color in colors %}
  <tr class="{{ classNames[loop.index0 % 2] }}">
    <td>{{ loop.index }}. {{ color }}</td>
  </tr>
{% endfor %}
</tbody>
</table>`;

    const html = nunjucks.renderString(template, { colors: ["red", "black", "blue", "white", "green"] });
    expect(html).to.eq(`
<table>
<tbody>
  <tr class="single">
    <td>1. red</td>
  </tr>
  <tr class="double">
    <td>2. black</td>
  </tr>
  <tr class="single">
    <td>3. blue</td>
  </tr>
  <tr class="double">
    <td>4. white</td>
  </tr>
  <tr class="single">
    <td>5. green</td>
  </tr>
</tbody>
</table>`);
  });

  /**
   * 在模板循环中使用 `range` 函数
   */
  it("should loop by range in template", () => {
    const template = `
<table>
<tbody>
{% set classNames = ["single", "double"] -%}

{% for num in range(1, max) %}
  <tr class="{{ classNames[loop.index0 % 2] }}">
    <td>{{ num }}</td>
  </tr>
{% endfor %}
</tbody>
</table>`;

    const html = nunjucks.renderString(template, { max: 5 });
    expect(html).to.eq(`
<table>
<tbody>
  <tr class="single">
    <td>1</td>
  </tr>
  <tr class="double">
    <td>2</td>
  </tr>
  <tr class="single">
    <td>3</td>
  </tr>
  <tr class="double">
    <td>4</td>
  </tr>
</tbody>
</table>`);
  });

  /**
   * 在模板中使用"宏"
   * 
   * "宏"类似于模板中的函数, 通过 `{% macro 宏名称(宏参数) %} ... {% endmacro %}` 来定义;
   * 
   * "宏"的调用即通过"宏"名称直接传递参数调用即可;
   */
  it("should use macro in template", () => {
    const template = `
{%- macro select(attrs, values=[]) %}
<select {%- for name, value in attrs %} {{ name }}="{{ value }}" {%- endfor %}>
  {% for val in values %}
    <option value="{{ val.id }}">{{ val.text }}</option>
  {% endfor %}
</select>
{%- endmacro %}

<div class="wrapper">
  {{ select(attrs={ "name": "sel-name", "class": "single-sel" }, values=selectValues) }}
</div>`;

    const html = nunjucks.renderString(template, {
      selectValues: [
        { "id": 1, "text": "A" },
        { "id": 2, "text": "B" },
        { "id": 3, "text": "C" },
      ]
    });

    expect(html).to.eq(`
<div class="wrapper">
  <select name="sel-name" class="single-sel">
    <option value="1">A</option>
    <option value="2">B</option>
    <option value="3">C</option>
</select>
</div>`);
  });
});

/**
 * 测试在模板中使用过滤器
 * 
 * 过滤器是对数据进行的一系列"操作", 通过 `|` 运算符放在数据 (变量) 之后, 可以通过 `|` 符号连接多个过滤器
 */
describe("test 'filters' in 'nunjucks' template", () => {
  /**
   * 使用"默认值过滤器"
   * 
   * "默认值过滤器"即 `| d(默认值)`, 当其修饰的变量未赋值时, 使用该默认值
   */
  it("should get default value by 'default' filter", () => {
    const template = '<span>{{ name | d("Alvin") }}</span>';

    let html = nunjucks.renderString(template, { name: "Emma" });
    expect(html).to.eq('<span>Emma</span>');

    html = nunjucks.renderString(template);
    expect(html).to.eq('<span>Alvin</span>');
  });

  /**
   * 使用"绝对值过滤器"
   * 
   * "绝对值过滤器"即 `| abs`, 结果为其修饰变量的绝对值
   */
  it("should get abs value by 'abs' filter", () => {
    const template = '<span>{{ num | abs }}</span>';

    const html = nunjucks.renderString(template, { num: -10 });
    expect(html).to.eq('<span>10</span>');
  });
});
