import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import nunjucks from 'nunjucks';
import path from 'path';

/**
 * 配置 nunjucks 模板引擎
 *
 * 该函数的返回值为 nunjucks 模板引擎的环境上下文对象, 可以通过该对象设置模板引擎 (例如增加过滤器等)
 *
 * 配置项包括:
 *
 * 模板引擎配置:
 * - `autoescape`: (default `true`) 对输出内容进行自动转义;
 * - `throwOnUndefined`: (default: `false`) 当模板变量未定义时, 是否抛出异常;
 * - `trimBlocks`: (default: `false`) 删除无用的换行符;
 * - `lstripBlocks`: (default: `false`) 清理无用的换行符;
 * - `watch`: (default: `false`) 监控模板文件, 如果其更改则自动刷新缓存;
 * - `noCache`: (default: `false`) 是否停用缓存, 停用后每次都会重新解析模板文件;
 * 浏览器配置:
 * - `useCache`: (default: `false`) 是否启用浏览器缓存;
 * - `async`: (default: `false`) 是否通过 ajax 异步加载模板;
 * 框架配置:
 * - `tags`: (default: see nunjucks syntax) 设置默认的模板标签, 例如:
 *
 *    ```
 *    nunjucks.configure({
 *      tags: {
 *        blockStart: "<%",
 *        blockEnd: "%>",
 *        variableStart: "<$",
 *        variableEnd: "$>",
 *        commentStart: "<#",
 *        commentEnd: "#>"
 *     }
 *  });
 *  ```
 */
nunjucks.configure(
  path.join(__dirname, 'nunjucks'), // 模板文件路径
  {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true
  }
);

// 安装 nunjucks 的 jinja 模块
nunjucks.installJinjaCompat();

/**
 * 测试 Nunjucks 模板引擎
 *
 * https://mozilla.github.io/nunjucks/
 */
describe('Test `nunjucks` template engine', () => {
  /**
   * 将模板字符串渲染为 HTML
   */
  it('should render string template #1', () => {
    const template = '<b>{{ name }}</b>';

    const html = nunjucks.renderString(template, { name: 'Alvin' });
    expect(html).is.eq('<b>Alvin</b>');
  });

  /**
   * 渲染 HTML 元素的属性值
   */
  it('should render string template #2', () => {
    const template = '<button class="{{ className }}">{{ title }}</button>';

    const html = nunjucks.renderString(template, { className: 'warning', title: 'Click me' });
    expect(html).is.eq('<button class="warning">Click me</button>');
  });

  /**
   * 渲染 HTML 元素的属性名和属性值
   */
  it('should render string template #3', () => {
    const template = '<button {{ attrName }}="{{ attrValue }}">{{ title }}</button>';

    const html = nunjucks.renderString(template, { attrName: 'class', attrValue: 'warning', title: 'Click me' });
    expect(html).is.eq('<button class="warning">Click me</button>');
  });

  /**
   * 在模板字符串中定义变量
   *
   * 通过 `{%` 和 `%}` 包围的为 nunjucks 控制代码, 可以增加 `-` 消除生成 HTML 中的空白行, 例如: `{%-` 和 `-%}`
   */
  it('should define variable in template string', () => {
    const template = `
{%- set gender = { M: "Male", F: "Female" } %}
<span>Gender: {{ gender[user.gender] or "Unknown" }}</span>`;

    const html = nunjucks.renderString(template, { user: { gender: 'M' } });
    expect(html).is.eq('<span>Gender: Male</span>');
  });

  /**
   * 在模板中使用条件语句
   */
  it('should use condition statements in template', () => {
    const template = `
{%- if user.gender == "M" -%}
  <span>Gender: Male</span>
{%- elif user.gender == "F" -%}
  <span>Gender: Female</span>
{%- else -%}
  <span>Gender: Unknown</span>
{% endif %}`;

    const html = nunjucks.renderString(template, { user: { gender: 'M' } });
    expect(html).is.eq('<span>Gender: Male</span>');
  });

  /**
   * 在模板中使用循环语句
   */
  it('should use loop statements in template', () => {
    const template = `
<ul>
{% for job in jobs %}
  <li>{{ job }}</li>
{% endfor %}
</ul>`;

    const html = nunjucks.renderString(template, { jobs: ['Teacher', 'Developer', 'Manager'] });
    expect(html).is.eq(`
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
  it('should use loop object in loop statement of template', () => {
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

    const html = nunjucks.renderString(template, { colors: ['red', 'black', 'blue', 'white', 'green'] });
    expect(html).is.eq(`
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
  it('should loop by range in template', () => {
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
    expect(html).is.eq(`
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
  it('should use macro in template', () => {
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
        { id: 1, text: 'A' },
        { id: 2, text: 'B' },
        { id: 3, text: 'C' }
      ]
    });

    expect(html).is.eq(`
<div class="wrapper">
  <select name="sel-name" class="single-sel">
    <option value="1">A</option>
    <option value="2">B</option>
    <option value="3">C</option>
</select>
</div>`);
  });

  /**
   * 对模板字符串进行预编译
   */
  it('should precompile template function', () => {
    const template = nunjucks.compile('<b>{{ name }}</b>');

    const html = template.render({ name: 'Alvin' });
    expect(html).is.eq('<b>Alvin</b>');
  });

  // 定义模板文件路径
  const templateFile = path.join(__dirname, 'nunjucks/index.njk');

  // 定义模板参数
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const templateArgs: Record<string, any> = Object.freeze(
    {
      title: 'Welcome Nunjucks',
      user: {
        name: 'Alvin',
        age: 43,
        gender: 'M'
      },
      jobs: ['DEV', 'BA', 'QA'],
      colors: ['R', 'G', 'B'],
      selectValues: [
        { id: 1, text: 'A' },
        { id: 2, text: 'B' },
        { id: 3, text: 'C' },
        { id: 4, text: 'D' }
      ]
    }
  );

  /**
   * 渲染模板文件 (同步方式)
   */
  it('should render template file sync', () => {
    const html = nunjucks.render(templateFile, templateArgs);

    const doc = new JSDOM(html).window.document;

    let elem = doc.querySelector('title')!;
    expect(elem.textContent).is.eq('Welcome Nunjucks');

    elem = doc.querySelector('.user-info')!;
    Object.keys(templateArgs.user).forEach(key => {
      expect(elem.querySelector(`.${key}`)?.textContent).is.eq(`${templateArgs.user[key]}`);
    });

    let elems = doc.querySelectorAll('.job-list li');
    elems.forEach((el, n) => {
      expect(el.textContent).is.eq(`${templateArgs.jobs[n]}`);
    });

    elems = doc.querySelectorAll('.color-list tr');
    elems.forEach((el, n) => {
      expect(el.getAttribute('class')).is.eq(n % 2 === 0 ? 'single' : 'double');
      expect(el.querySelector('td')?.textContent).is.eq(templateArgs.colors[n]);
    });

    elems = doc.querySelectorAll('.single-sel option');
    elems.forEach((el, n) => {
      expect(el.getAttribute('value')).is.eq(`${n + 1}`);
      expect(el.textContent).is.eq(templateArgs.selectValues[n].text);
    });
  });

  /**
   * 渲染模板文件 (异步方式)
   */
  it('should render template file async', done => {
    nunjucks.render(templateFile, templateArgs, (err, html) => {
      expect(err).to.be.null;

      const doc = new JSDOM(html!).window.document;

      let elem = doc.querySelector('title')!;
      expect(elem.textContent).is.eq('Welcome Nunjucks');

      elem = doc.querySelector('.user-info')!;
      Object.keys(templateArgs.user).forEach(key => {
        expect(elem.querySelector(`.${key}`)!.textContent).is.eq(`${templateArgs.user[key]}`);
      });

      let elems = doc.querySelectorAll('.job-list li');
      elems.forEach((el, n) => {
        expect(el.textContent).is.eq(`${templateArgs.jobs[n]}`);
      });

      elems = doc.querySelectorAll('.color-list tr');
      elems.forEach((el, n) => {
        expect(el.getAttribute('class')).is.eq(n % 2 === 0 ? 'single' : 'double');
        expect(el.querySelector('td')!.textContent).is.eq(templateArgs.colors[n]);
      });

      elems = doc.querySelectorAll('.single-sel option');
      elems.forEach((el, n) => {
        expect(el.getAttribute('value')).is.eq(`${n + 1}`);
        expect(el.textContent).is.eq(templateArgs.selectValues[n].text);
      });

      done();
    });
  });
});

/**
 * 测试在模板中使用过滤器
 *
 * 过滤器是对数据进行的一系列"操作", 通过 `|` 运算符放在数据 (变量) 之后, 可以通过 `|` 符号连接多个过滤器
 */
describe('Test `filters` in `nunjucks` template', () => {
  /**
   * 使用"默认值过滤器"
   *
   * "默认值过滤器"即 `| d(默认值)`, 当其修饰的变量未赋值时, 使用该默认值
   */
  it('should get default value by `default` filter', () => {
    const template = '<span>{{ name | d("Alvin") }}</span>';

    let html = nunjucks.renderString(template, { name: 'Emma' });
    expect(html).is.eq('<span>Emma</span>');

    html = nunjucks.renderString(template, {});
    expect(html).is.eq('<span>Alvin</span>');
  });

  /**
   * 使用"绝对值过滤器"
   *
   * "绝对值过滤器" 即 `| abs`, 结果为其修饰变量的绝对值
   */
  it('should get abs value by `abs` filter', () => {
    const template = '<span>{{ num | abs }}</span>';

    const html = nunjucks.renderString(template, { num: -10 });
    expect(html).is.eq('<span>10</span>');
  });

  /**
   * 使用"批量过滤器"
   *
   * "批量过滤器" 即 `| batch(n, placeholder)`, 用于将一个数组分隔为若干子数组, `n` 表示每个子数组的期望的元素个数
   *
   * 例如: 将长度为 7 的数组分割为每 2 个元素一组, 则结果为 4 个子数组, 长度各自为 `2`, `2`, `2`, `1`;
   *
   * 如果将上例分割为每 3 个元素一组, 则结果为 3 个子数组, 长度各自为 `3`, `3`, `1`;
   *
   * 同理, 如果分割为每 4 个元素一组, 则结果为 2 个子数组, 长度各自为 `4`, `3`;
   *
   * `placeholder` 参数表示默认元素, 会填充在分割结果的最后一个子数组中, 以保证所有子数组长度一致;
   */
  it('should split array by `batch` filter', () => {
    const template = '<span>{{ letters | batch(2, "?") | join("|") }}</span>';

    const html = nunjucks.renderString(template, { letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] });
    expect(html).is.eq('<span>a,b|c,d|e,f|g,?</span>');
  });

  /**
   * 将字符串首字母设置为大写字母
   *
   * 通过 `| capitalize` 过滤器可以将被修饰的字符串首字母设置为大写
   */
  it('should capitalize first letter of string by `capitalize` filter', () => {
    const template = '<span>{{ name | capitalize }}</span>';

    const html = nunjucks.renderString(template, { name: 'alvin' });
    expect(html).is.eq('<span>Alvin</span>');
  });

  /**
   * 在字符串前后增加指定数量的空格
   *
   * 通过 `| center(n)` 过滤器可以在被修饰的字符串两边加入共 `n` 个空格
   */
  it('should add whitespace around given string by `center` filter', () => {
    const template = '<span>{{ name | center(10) }}</span>';

    const html = nunjucks.renderString(template, { name: 'Alvin' });
    expect(html).is.eq('<span>  Alvin   </span>');
  });

  /**
   * 对字典进行排序
   *
   * 通过 `| dictsort(caseSensitive, keyOrValue)` 过滤器可以将被修饰的字典变量进行排序
   *
   * `caseSensitive` 参数表示排序是否对大小写敏感; `keyOrValue` 参数表示排序依照字典的 Key 或 Value
   */
  it('should sort dict object by `dictsort` filter', () => {
    const template = '<span>{{ dict | dictsort(false, "key") }}</span>';

    const html = nunjucks.renderString(template, {
      dict: { A: 3, b: 1, C: 2 }
    });
    expect(html).is.eq('<span>A,3,b,1,C,2</span>');
  });

  /**
   * 禁止对字符串进行转义
   *
   * 通过 `| safe` 过滤器, 可以禁止对其修饰的字符串进行转义
   *
   * 如果 `nunjucks.configure` 配置的 `autoescape` 配置项为 `false`, 则默认不进行字符串转义, 此时 `safe`
   * 过滤器无效
   */
  it('should disable string escape by `safe` filter', () => {
    const template = '<span>{{ str }}, {{ str | safe }}</span>';

    const html = nunjucks.renderString(template, { str: '>-_-<' });
    expect(html).is.eq('<span>&gt;-_-&lt;, >-_-<</span>');
  });

  /**
   * 强制对字符串进行转义
   *
   * 通过 `| e` 过滤器, 可以强制对其修饰的字符串进行转义
   *
   * 如果 `nunjucks.configure` 配置的 `autoescape` 配置项为 `true`, 则默认就会对字符串进行转义, 此时 `e`
   * 过滤器无效
   */
  it('should force escape string by `e` filter', () => {
    const template = '<span>{{ str }}, {{ str | e }}</span>';

    const html = nunjucks.renderString(template, { str: '>-_-<' });
    expect(html).is.eq('<span>&gt;-_-&lt;, &gt;-_-&lt;</span>');
  });

  /**
   * 获取数组的第一个或最后一个元素
   *
   * 通过 `| first` 过滤器可以获取其修饰数组的首元素; 通过 `| last` 过滤器可以获取数组的最后一个元素
   */
  it('should get first and last element of array by `first` and `last` filter', () => {
    const template = '<span>{{ letters | first }}, {{ letters | last }}</span>';
    const args = { letters: ['a', 'b', 'c', 'd'] };

    const html = nunjucks.renderString(template, args);
    expect(html).is.eq('<span>a, d</span>');
  });

  /**
   * 将对象数组按照对象的指定属性进行分组
   *
   * 通过 `| groupby(property)` 过滤器可以对其修饰的对象数组按照 `property` 表示的对象属性值进行分组
   */
  it('should aggregate objects into group by properties by `groupby` filter', () => {
    const template = `
<ul>
{% for group, members in users | groupby("gender") %}
  <li>
    <strong>{{ group }}</strong>
    <ul>
    {% for user in members %}
      <li>{{ user.name }}, {{ user.age }}</li>
    {% endfor %}
    </ul>
  </li>
{% endfor %}
</ul>`;
    const args = {
      users: [
        { name: 'Alvin', age: 34, gender: 'M' },
        { name: 'Lily', age: 28, gender: 'F' },
        { name: 'Tom', age: 30, gender: 'M' }
      ]
    };

    const html = nunjucks.renderString(template, args);
    expect(html).is.eq(`
<ul>
  <li>
    <strong>M</strong>
    <ul>
      <li>Alvin, 34</li>
      <li>Tom, 30</li>
    </ul>
  </li>
  <li>
    <strong>F</strong>
    <ul>
      <li>Lily, 28</li>
    </ul>
  </li>
</ul>`);
  });

  /**
   * 指定字符串缩进
   *
   * 通过 `| indent(count, first)` 过滤器对其修饰的字符串进行缩进, `count` 表示缩进的字符数, `first` 为 `true` 表示只对首行进行缩进
   */
  it('should keep intent before string by `intent` filter', () => {
    const template = `
<b>{{ text | indent(2, true) }}</b>
<b>{{ text | indent(2, false) }}</b>`;

    const html = nunjucks.renderString(template, { text: 'A\nB\nC' });
    expect(html).is.eq(`
<b>  A
  B
  C</b>
<b>A
  B
  C</b>`);
  });

  /**
   * 将数组元素进行连接
   *
   * 通过 `| join(splitter, property)` 可以通过 `splitter` 为分隔符, 将其修饰的数组元素进行连接;
   *
   * 如果数组元素为对象, 则可以通过 `property` 参数指定要连接的对象属性值
   */
  it('should join array elements by `join` filter', () => {
    // 测试连接数组中简单类型元素值
    {
      const template = '<b>{{ words | join(":") }}</b>';

      const html = nunjucks.renderString(template, { words: ['aa', 'bb', 'cc'] });
      expect(html).is.eq('<b>aa:bb:cc</b>');
    }

    // 测试连接数组中对象元素的属性值
    {
      const template = '<b>{{ users | join("|", "name") }}</b>';

      const html = nunjucks.renderString(template, {
        users: [
          { name: 'Alvin', age: 34, gender: 'M' },
          { name: 'Lily', age: 28, gender: 'F' },
          { name: 'Tom', age: 30, gender: 'M' }
        ]
      });
      expect(html).is.eq('<b>Alvin|Lily|Tom</b>');
    }
  });

  /**
   * 获取字符串或数组的长度
   *
   * 通过 `| length` 过滤器可以获取其修饰的字符串或数组的长度
   */
  it('should get length of string or array by `length` filter', () => {
    // 获取字符串长度
    {
      const template = '<b>{{ text | length }}</b>';

      const html = nunjucks.renderString(template, { text: 'Hello World' });
      expect(html).is.eq('<b>11</b>');
    }

    // 获取数组长度
    {
      const template = '<b>{{ array | length }}</b>';

      const html = nunjucks.renderString(template, { array: [1, 2, 3, 4, 5] });
      expect(html).is.eq('<b>5</b>');
    }
  });

  /**
   * 将集合或字符串转为数组
   *
   * 通过 `| list` 过滤器可以将其修饰的字符串或其它集合转为数组类型
   */
  it('should convert string or some collection into array by `list` filter', () => {
    const template = `
<ul>
{% for c in s | list %}
  <li><{{ c }}</li>
{% endfor %}
</ul>`;

    const html = nunjucks.renderString(template, { s: 'Hello' });
    expect(html).is.eq(`
<ul>
  <li><H</li>
  <li><e</li>
  <li><l</li>
  <li><l</li>
  <li><o</li>
</ul>`);
  });

  /**
   * 将字符串转为大写或小写
   *
   * 通过 `uppercase` 和 `lowercase` 过滤器可以将其修饰的字符串转为大写和小写
   */
  it('should convert string to uppercase or lowercase by `upper` or `lower` filter', () => {
    const template = '<b>{{ text | upper }}, {{ text | lower }}</b>';

    const html = nunjucks.renderString(template, { text: 'Hello World' });
    expect(html).is.eq('<b>HELLO WORLD, hello world</b>');
  });

  /**
   * 从数组中随机获取一个元素
   *
   * 通过 `| random` 过滤器可以从其修饰的数组中随机获取一个元素
   */
  it('should get any random element by `random` filter', () => {
    const template = '<b>{{ array | random }}</b>';

    const html = nunjucks.renderString(template, { array: [1, 2, 3, 4, 5] });
    expect(html).to.match(/<b>[1-5]<\/b>/);
  });

  /**
   * 对字符串内容进行替换
   *
   * 通过 `| replace` 过滤器可以在其修饰的字符串中进行内容替换
   */
  it('should replace string by `replace` filter', () => {
    // 将指定的部分进行 1 次替换
    {
      const template = '<b>{{ text | replace("Hello", "Goodbye") }}</b>';

      const html = nunjucks.renderString(template, { text: 'Hello World' });
      expect(html).is.eq('<b>Goodbye World</b>');
    }

    // 将指定的部分进行 n 次替换
    {
      const template = '<b>{{ text | replace("a", "b", 3) }}</b>';

      const html = nunjucks.renderString(template, { text: 'aaaaaaaa' });
      expect(html).is.eq('<b>bbbaaaaa</b>'); // cspell: disable-line
    }
  });

  /**
   * 将数组元素进行翻转
   *
   * 通过 `| reverse` 过滤器可以将其修饰的数组进行翻转
   */
  it('should reverse array by `reverse` filter', () => {
    const template = '<b>{{ array | reverse | join("-") }}</b>';

    const html = nunjucks.renderString(template, { array: [1, 2, 3, 4, 5] });
    expect(html).is.eq('<b>5-4-3-2-1</b>');
  });

  /**
   * 对数字保留指定的小数位
   *
   * 通过 `| round(n, type)` 过滤器可以对其修饰的数字保留 `n` 位小数, `type` 可为 "floor", "ceil" 和 "round"
   */
  it('should round number by `round` filter', () => {
    const template = '<b>{{ val | round(2, "floor") }}</b>';

    const html = nunjucks.renderString(template, { val: 12.34567 });
    expect(html).is.eq('<b>12.34</b>');
  });

  /**
   * 对数组进行切片
   *
   * 通过 `| slice(n)` 过滤器可以将数组切分为 `n` 个子数组
   */
  it('should slice array by `slice` filter', () => {
    const template = '<b>{{ array | slice(2) | join("|") }}</b>';

    const html = nunjucks.renderString(template, { array: [1, 2, 3, 4, 5] });
    expect(html).is.eq('<b>1,2,3|4,5</b>');
  });

  /**
   * 对数组元素进行排序
   *
   * 通过 `| sort(reverse)` 过滤器可以对其修饰的数组进行排序, `reverse` 参数指定了排序的顺序
   */
  it('should sort array elements by `sort` filter', () => {
    const template = `
<b>{{ array | sort }}</b>
<b>{{ array | sort(true) }}</b>`;

    const html = nunjucks.renderString(template, { array: [2, 3, 1, 5, 4] });
    expect(html).is.eq(`
<b>1,2,3,4,5</b>
<b>5,4,3,2,1</b>`);
  });

  /**
   * 将对象转为字符串
   *
   * 通过 `| string` 过滤器可以将修饰的对象转为字符串 (通过对象的 `toString` 方法)
   */
  it('should convert object to string by `string` filter', () => {
    // 定义具备 toString 方法的对象
    const obj = {
      num: 100.123,

      toString() {
        return `${this.num.toFixed(2)}`;
      }
    };

    const template = '<b>{{ val | string }}</b>';

    const html = nunjucks.renderString(template, { val: obj });
    expect(html).is.eq('<b>100.12</b>');
  });

  /**
   * 将多个连续的空格字符替换为 1 个
   *
   * 通过 `| striptags` 过滤器可以将其修饰的字符串中连续的多个空格字符替换为 1 个
   */
  it('should replace more white spaces into one by `striptags` filter', () => {
    const template = '<b>{{ text | striptags }}</b>';

    const html = nunjucks.renderString(template, { text: 'Hello           World' });
    expect(html).is.eq('<b>Hello World</b>');
  });

  /**
   * 将字符串中每个单词的首字母转为大写字母
   *
   * 通过 `| title` 过滤器可以将其修饰的字符串中每个单词的首字母转为大写字母
   */
  it('should replace first letter to capital letter of each word by `title` filter', () => {
    const template = '<b>{{ text | title }}</b>';

    const html = nunjucks.renderString(template, { text: 'hello world' });
    expect(html).is.eq('<b>Hello World</b>');
  });

  /**
   * 将环绕字符串的空白字符进行删除
   *
   * 通过 `| trim` 过滤器可以将其修饰的字符串两端的空白字符进行删除, 字符串中间的空格会被忽略
   */
  it('should remove the white space character around string by `trim` filter', () => {
    const template = '<b>{{ text | trim }}</b>';

    const html = nunjucks.renderString(template, { text: '   Hello  World   ' });
    expect(html).is.eq('<b>Hello  World</b>');
  });

  /**
   * 对字符串进行 URL 编码
   *
   * 通过 `| urlencode` 过滤器可以对其修饰的字符串进行 URL 编码
   */
  it('should encode string with url encoding by `urlencode` filter', () => {
    const template = '<b>{{ text | urlencode }}</b>';

    const html = nunjucks.renderString(template, { text: 'A>B' });
    expect(html).is.eq('<b>A%3EB</b>');
  });

  /**
   * 计算单词数量
   *
   * 通过 `| wordcount` 过滤器可以对其修饰的字符串中包含的单词进行计数
   */
  it('should count word by `wordcount` filter', () => {
    const template = '<b>{{ text | wordcount }}</b>';

    const html = nunjucks.renderString(template, { text: 'Hello World' });
    expect(html).is.eq('<b>2</b>');
  });

  /**
   * 将字符串转为数值
   *
   * 通过 `| int` 和 `| float` 过滤器可以将其修饰的字符串转为数值
   */
  it('should convert string to number by `int` and `float` filter', () => {
    const template = `
<b>{{ num | int }}</b>
<b>{{ num | float }}</b>`;

    const html = nunjucks.renderString(template, { num: 100.2 });
    expect(html).is.eq(`
<b>100</b>
<b>100.2</b>`);
  });

  /**
   * 自定义过滤器
   */
  it('should use custom filter', () => {
    const env = nunjucks.configure({});

    env.addFilter('attr', (value, property) => {
      if (typeof value === 'object') {
        return value[property];
      }
      return null;
    });

    env.addFilter('map', (value, fn) => {
      if (typeof fn === 'string') {
        // eslint-disable-next-line no-eval
        return (eval(fn))(value);
      }
      return null;
    });

    const template = `
<b>{{ user | attr("name") }}</b>
<b>{{ user | map("u => 'Hello ' + u.name") }}</b>`;

    const args = {
      user: {
        name: 'Alvin',
        age: 34,
        gender: 'M'
      }
    };

    const html = nunjucks.renderString(template, args);
    expect(html).is.eq(`
<b>Alvin</b>
<b>Hello Alvin</b>`);
  });
});
