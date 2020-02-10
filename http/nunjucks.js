let assert = require('assert');
let path = require('path');
let cheerio = require('cheerio');
let _ = require('lodash');
let nunjucks = require('nunjucks');

/**
 * 测试nunjucks基本API
 */
(function () {

    // 渲染一个html模板字符串, 得到html字符串
    nunjucks.renderString(`<b>{{name}}</b>`, {'name': 'Alvin'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>Alvin</b>');
    });

    // 配置nunjucks模板, 配置项包括:
    //      autoescape (默认值: true) 控制输出是否被转义，查看 Autoescaping
    //      throwOnUndefined (default: false) 当输出为 null 或 undefined 会抛出异常
    //      trimBlocks (default: false) 自动去除 block/tag 后面的换行符
    //      lstripBlocks (default: false) 自动去除 block/tag 签名的空格
    //      watch (默认值: false) 当模板变化时重新加载
    //      noCache (default: false) 不使用缓存，每次都重新编译
    //      web 浏览器模块的配置项
    //          useCache (default: false) 是否使用缓存，否则会重新请求下载模板
    //          async (default: false) 是否使用 ajax 异步下载模板
    //      express 传入 express 实例初始化模板设置
    //      tags: (默认值: see nunjucks syntax) 定义模板语法，例如:
    //              var env = nunjucks.configure('/path/to/templates', {
    //                  tags: {
    //                      blockStart: '<%',
    //                      blockEnd: '%>',
    //                      variableStart: '<$',
    //                      variableEnd: '$>',
    //                      commentStart: '<#',
    //                      commentEnd: '#>'
    //                  }
    //              });
    nunjucks.configure('nunjucks-views', {
        'autoescape': true,
        'trimBlocks': true
    });

    // 配置nunjucks和python的jinja2兼容
    nunjucks.installJinjaCompat();

    // 渲染一个模板文件, 得到结果html
    nunjucks.render('render.html', {
        'title': 'Welcome Uunjucks',
        'names': ['Alvin', 'Lily', 'Lucy', 'Tom']
    }, (err, html) => {
        assert.ifError(err);

        let $ = cheerio.load(html), node;

        node = $('html head title');
        assert.equal(node.length, 1);
        assert.equal(node.text(), 'Welcome Uunjucks');

        node = $('#wrapper').find('ul.names li');
        assert.equal(node.length, 4);
        assert.equal(node.eq(0).text(), 'Alvin');
        assert.equal(node.eq(1).text(), 'Lily');
        assert.equal(node.eq(2).text(), 'Lucy');
        assert.equal(node.eq(3).text(), 'Tom');
    });

})();


/**
 * 测试nunjucks的loader和Environment
 */
(function () {

    // 产生一个基于文件系统的读取器, 基于路径./nunjucks-view
    let loader = new nunjucks.FileSystemLoader('nunjucks-views', {
        'watch': false,     // 是否监控文件变化
        'noCache': false    // 是否缓存读取的文件
    });

    // 获取指定名称文件内容
    let src = loader.getSource('loader.html');
    assert.equal(src.noCache, false);
    assert.equal(src.path, path.resolve('nunjucks-views', 'loader.html'));
    assert.equal(src.src, '<h1>{{name}}</h1>');    // 确认读取内容正确

    // NOTE: 如果在Web浏览器前端尚使用nunjucks.js, 则可以使用'WebLoader'来加载远程的html模板


    // 'Template'对象表示一个html模板, 通过该对象可以得到渲染后的html字符串
    let template = new nunjucks.Template(`<h1>{{title}}</h1>`);
    assert.equal(template.render({'title': 'Hello'}), '<h1>Hello</h1>');


    // 定义一个'Environment'对象, 关联一个'Loader'对象, 用于加载html模板并设置渲染参数
    let env = new nunjucks.Environment(loader, {
        'autoescape': true,
        'trimBlocks': true
    });

    // 获取指定文件名表示的模板对象
    env.getTemplate('loader.html', true, (err, template) => {
        assert.ifError(err);
        assert.equal(template.tmplStr, '<h1>{{name}}</h1>');

        template.render({'name': 'Alvin'}, (err, html) => {
            assert.ifError(err);
            assert.equal(html, '<h1>Alvin</h1>');
        });
    });


    // 通过指定的'Environment'对象渲染指定的html模板
    env.render('loader.html', {'name': 'Alvin'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<h1>Alvin</h1>');
    });
})();


/**
 * 测试filter的使用
 */
(function () {

    /**
     * 定义User类
     */
    class User {
        constructor(name, age, gender) {
            this.name = name;
            this.age = age;
            this.gender = gender;
        }

        toString() {
            return `name:${this.name},age:${this.age},gender:${this.gender}`;
        }
    }

    let env = nunjucks.configure({'autoescape': true, 'trimBlocks': true, 'lstripBlocks': true});

    // 测试'default'过滤器, 设置默认值
    nunjucks.renderString(`<span>{{name|d("Alvin")}}</span>`, {'name': 'Lily'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>Lily</span>');
    });
    nunjucks.renderString(`<span>{{name|d("Alvin")}}</span>`, {}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>Alvin</span>');
    });


    // 测试'abs'过滤器, 获取数值的绝对值
    nunjucks.renderString(`<span>{{number|abs}}</span>`, {'number': -10}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>10</span>');
    });


    // 测试'batch'过滤器, 将集合分割为指定个数的子集, 所有子集合元素个数相同, 不够则是用指定参数补充
    // 所以集合['a', 'b', 'c']将被分为: [['a', 'b', ['c', 'none]]
    nunjucks.renderString(`<span>{{letters|batch(2,"none")|join("|")}}</span>`, {'letters': ['a', 'b', 'c']}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>a,b|c,none</span>');
    });


    // 测试'capitalize'过滤器, 将字符串第一个字母设置为大写
    nunjucks.renderString(`<span>{{name|capitalize}}</span>`, {'name': 'alvin'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>Alvin</span>');
    });


    // 测试'center'过滤器, 在字符串左右增加空格
    nunjucks.renderString(`<span>{{name|center(20)}}</span>`, {'name': 'Alvin'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>       Alvin        </span>');
    });


    // 测试'dictsort'过滤器, 对字典元素(对象属性)进行排序
    let dict = {
        'dict': {
            'A': 3,
            'b': 1,
            'C': 2
        }
    };
    // 测试'dictsort'过滤器的默认参数, 排序不区分大小写, 通过key(属性名)对字典元素(对象)进行排序
    nunjucks.renderString(`<span>{{dict|dictsort|join("|")}}</span>`, dict, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>A,3|b,1|C,2</span>');
    });
    // 测试'dictsort'过滤器, 排序区分大小写, 通过key(属性名)对字典元素(对象)进行排序
    nunjucks.renderString(`<span>{{dict|dictsort(true)|join("|")}}</span>`, dict, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>A,3|C,2|b,1</span>');
    });
    // 测试'dictsort'过滤器, 排序不区分大小写, 通过value(属性值)对字典元素(对象)进行排序
    nunjucks.renderString(`<span>{{dict|dictsort(false,"value")|join("|")}}</span>`, dict, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>b,1|C,2|A,3</span>');
    });


    // 测试'safe'过滤器, 令指定的字符串内容不发生转义, 无论nunjucks的'autoescape'配置项是否为true
    nunjucks.renderString(`<span>{{str}}, {{str|safe}}</span>`, {'str': '>-_-<'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>&gt;-_-&lt;, >-_-<</span>');
    });


    // 测试'escape'过滤器, 对字符串内容进行转义, 如果nunjucks的'autoescape'配置项为true, 则会在转义的基础上继续转义
    nunjucks.renderString(`<span>{{str|e}}</span>`, {'str': '>-_-<'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>&gt;-_-&lt;</span>');
    });


    // 测试'first'过滤器, 获取集合第一项
    nunjucks.renderString(`<span>{{letters|first}}</span>`, {'letters': ['a', 'b', 'c', 'd']}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>a</span>');
    });

    // 测试'last'过滤器, 获取最后一项
    nunjucks.renderString(`<span>{{letters|last}}</span>`, {'letters': ['a', 'b', 'c', 'd']}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>d</span>');
    });


    // 测试'groupby'过滤器, 按指定属性分组
    let users = [
        new User('Alvin', 34, 'M'),
        new User('Lily', 28, 'F'),
        new User('Tom', 30, 'M')
    ];

    nunjucks.renderString(`
<ul id='group'>
    {% for grouper, list in users|groupby('gender') %}
    <li><b>{{grouper}}</b>
        <ul>
            {% for user in list %}
            <li>{{user.name}} {{user.age}}</li>
            {% endfor %}
        </ul>
    </li>
    {% endfor %}
</ul>`, {'users': users}, (err, html) => {
        assert.ifError(err);
        let $ = cheerio.load(html), node;

        node = $('#group>li');
        assert.equal(node.length, 2);

        assert.equal(node.eq(0).find('b').text(), 'M');
        assert.equal(node.eq(0).find('li').eq(0).text(), 'Alvin 34');
        assert.equal(node.eq(0).find('li').eq(1).text(), 'Tom 30');

        assert.equal(node.eq(1).find('b').text(), 'F');
        assert.equal(node.eq(1).find('li').eq(0).text(), 'Lily 28');
    });


    // 测试'indent'过滤器, 在每行的前(后)增加空格字符, 第二个参数为true时, 在每行之前增加空格
    nunjucks.renderString(`<b>{{text|indent(2, true)}}</b>`, {'text': 'Hello\nWorld'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>  Hello\n  World\n</b>');
    });
    // 第二个参数为false时, 在每行之后增加空格(第一行除外)
    nunjucks.renderString(`<b>{{text|indent(2, false)}}</b>`, {'text': 'Hello\nWorld'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>Hello\n  World\n</b>');
    });


    // 测试'join'过滤器, 将数组内容连接为字符串
    nunjucks.renderString(`<b>{{words|join(';')}}</b>`, {'words': ['aa', 'bb', 'cc']}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>aa;bb;cc</b>');
    });
    // 将集合元素的某个属性值连接为字符串
    nunjucks.renderString(`<b>{{users|join(';', 'name')}}</b>`, {'users': users}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>Alvin;Lily;Tom</b>');
    });


    // 测试'length'过滤器, 获取字符串或集合的长度
    nunjucks.renderString(`<b>{{text|length}}</b>`, {'text': 'Hello'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>5</b>');
    });
    nunjucks.renderString(`<b>{{array|length}}</b>`, {'array': ['a', 'b', 'c', 'd']}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>4</b>');
    });


    // 测试'list'过滤器, 将指定值转为集合
    nunjucks.renderString(`
<ul>
{% for item in text|list %}
    <li>{{item}}</li>
{% endfor %}
</ul>`, {'text': 'Hello'}, (err, html) => {
        assert.ifError(err);
        let $ = cheerio.load(html), node;

        node = $('ul>li');
        assert.equal(node.eq(0).text(), 'H');
        assert.equal(node.eq(1).text(), 'e');
        assert.equal(node.eq(2).text(), 'l');
        assert.equal(node.eq(3).text(), 'l');
        assert.equal(node.eq(4).text(), 'o');
    });


    // 测试'upper'过滤器, 字母转为小写
    nunjucks.renderString(`<b>{{text|upper}}</b>`, {'text': 'Hello World'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>HELLO WORLD</b>');
    });

    // 测试'lower'过滤器, 字母转为小写
    nunjucks.renderString(`<b>{{text|lower}}</b>`, {'text': 'Hello World'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>hello world</b>');
    });


    // 测试'random'过滤器, 随机获取序列中的任意项
    nunjucks.renderString(`<b>{{array|random}}</b>`, {'array': ['a', 'b', 'c', 'd']}, (err, html) => {
        assert.ifError(err);
        let $ = cheerio.load(html);
        assert.ok(['a', 'b', 'c', 'd'].indexOf($('b').text()) >= 0);
    });


    // 测试'replace'过滤器, 替换字符串中的内容
    nunjucks.renderString(`<b>{{text|replace("Hello", "Goodbye")}}</b>`, {'text': 'Hello World'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>Goodbye World</b>');
    });
    // 替换时指定最大替换的数量
    nunjucks.renderString(`<b>{{text|replace("a", "b", 3)}}</b>`, {'text': 'aaaaaaaa'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>bbbaaaaa</b>');
    });


    // 测试'reverse'过滤器, 翻转集合
    nunjucks.renderString(`<b>{{letters|reverse|join(';')}}</b>`, {'letters': ['a', 'b', 'c', 'd']}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>d;c;b;a</b>')
    });


    // 测试'round'过滤器, 对小数位进行舍去处理
    nunjucks.renderString(`<b>{{value|round}}</b>`, {'value': 12.34567}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>12</b>')
    });
    nunjucks.renderString(`<b>{{value|round(2)}}</b>`, {'value': 12.34567}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>12.35</b>')
    });
    nunjucks.renderString(`<b>{{value|round(2, 'floor')}}</b>`, {'value': 12.34567}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>12.34</b>')
    });


    // 测试'slice'过滤器, 将集合分为指定数量的子集合
    nunjucks.renderString(`<b>{{letters|slice(2)|join(';')}}</b>`, {'letters': ['a', 'b', 'c', 'd']}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>a,b;c,d</b>');
    });
    nunjucks.renderString(`<b>{{letters|slice(3)|join(';')}}</b>`, {'letters': ['a', 'b', 'c', 'd']}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>a,b;c;d</b>');
    });


    // 测试'sort'过滤器, 将指定集合排序
    nunjucks.renderString(`<b>{{letters|sort|join(',')}}</b>`, {'letters': ['b', 'c', 'a', 'd']}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>a,b,c,d</b>');
    });
    nunjucks.renderString(`<b>{{letters|sort(true)|join(',')}}</b>`, {'letters': ['b', 'c', 'a', 'd']}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>d,c,b,a</b>');
    });
    nunjucks.renderString(`<b>{{users|sort(attribute='age')|join(';', 'name')}}</b>`, {'users': users}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>Lily;Tom;Alvin</b>');
    });


    // 测试'string'过滤器, 调用指定对象的'toString'方法获取字符串
    nunjucks.renderString(`<b>{{user|string}}</b>`, {'user': new User('Alvin', 34, 'M')}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>name:Alvin,age:34,gender:M</b>');
    });


    // 测试'striptags'过滤器, 将连续的空格替换成一个空格
    nunjucks.renderString(`<b>{{text|striptags}}</b>`, {'text': 'Hello    World'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>Hello World</b>');
    });


    // 测试'title'过滤器, 将每个单词的首字母大写
    nunjucks.renderString(`<b>{{text|title}}</b>`, {'text': 'hello world'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>Hello World</b>');
    });


    // 测试'trim'过滤器, 去除两边的空格
    nunjucks.renderString(`<b>{{text|trim}}</b>`, {'text': '   Hello   '}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>Hello</b>');
    });


    // 测试'truncate'过滤器, 按要求截断字符串
    nunjucks.renderString(`<b>{{text|truncate(5)}}</b>`, {'text': 'abcdefgh'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>abcde...</b>');
    });


    // 测试'urlencode'过滤器, 获取URL编码结果
    nunjucks.renderString(`<b>{{text|urlencode}}</b>`, {'text': '大家好'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>%E5%A4%A7%E5%AE%B6%E5%A5%BD</b>');
    });


    // 测试'wordcount'过滤器, 计算单词个数
    nunjucks.renderString(`<b>{{text|wordcount}}</b>`, {'text': 'Hello  World'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>2</b>');
    });


    // 测试'int/float'过滤器, 将值转为数字
    nunjucks.renderString(`<b>{{(text|int) + 100}}</b>`, {'text': '100.2'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>200</b>');
    });
    nunjucks.renderString(`<b>{{(text|float) + 100}}</b>`, {'text': '100.2'}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<b>200.2</b>');
    });


    /**
     * 自定义filter, 获取对象指定属性
     */
    env.filters.attr = function (obj, attr) {
        if (typeof obj === 'object') {
            return obj[attr];
        }
    };

    env.filters.map = function (obj, func) {
        if (typeof func === 'string') {
            func = eval(func);
            return func(obj);
        }
    };


    // 测试'attr'过滤器, 获取指定
    nunjucks.renderString('<span>{{user|attr("name")}}</span>', {'user': new User('Alvin', 34)}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>Alvin</span>');
    });


    // 测试'map'过滤器, 获取指定方法处理的结果
    nunjucks.renderString('<span>{{user|map("user => \\"Hello \\" + user.name")}}</span>', {'user': new User('Alvin', 34)}, (err, html) => {
        assert.ifError(err);
        assert.equal(html, '<span>Hello Alvin</span>');
    });
})();


/**
 * 测试模板代码
 */
(function () {

    /**
     * 定义User类
     */
    class User {
        constructor(name, age, gender) {
            this.name = name;
            this.age = age;
            this.gender = gender;
        }

        toString() {
            return `name:${this.name},age:${this.age},gender:${this.gender}`;
        }
    }

    nunjucks.configure('nunjucks-views', {
        'autoescape': true,
        'trimBlocks': true,
        'lstripBlocks': true
    });

    nunjucks.render('code.html', {
        'title': 'Study Nunjucks',
        'user': new User('Alvin', 34, 'M'),
        'jobs': ['Teacher', 'Developer', 'Manager'],
        'colors': ['red', 'black', 'blue', 'white', 'green'],
        'selectValues': [
            {'id': 1, 'text': 'A'},
            {'id': 2, 'text': 'B'},
            {'id': 3, 'text': 'C'}
        ]
    }, (err, html) => {
        assert.ifError(err);
        let $ = cheerio.load(html), node;

        node = $('html head');

        assert.equal(node.length, 1);
        assert.deepEqual(node.find('meta').attr(), {
            'http-equiv': 'content-type',
            'content': 'text/html; charset=utf-8'
        });
        assert.deepEqual(node.find('link').attr(), {'type': 'text/css', 'rel': 'stylesheet', 'href': 'global.css'});
        assert.deepEqual(node.find('script').attr(), {'src': 'jquery.js'});
        assert.equal(node.find('title').text(), 'Study Nunjucks');

        node = $('#wrapper .user-list span');
        assert.equal(node.length, 3);
        assert.equal(node.eq(0).text(), '姓名: Alvin');
        assert.equal(node.eq(1).text(), '年龄: 34');
        assert.equal(node.eq(2).text(), '性别: 男');

        node = $('#wrapper .job-list ul>li');
        assert.equal(node.length, 3);
        assert.equal(node.eq(0).text(), 'Teacher');
        assert.equal(node.eq(1).text(), 'Developer');
        assert.equal(node.eq(2).text(), 'Manager');

        node = $('#wrapper .info-list table>tr');
        assert.equal(node.length, 5);
        assert.deepEqual(node.eq(0).attr(), {'class': '.single'});
        assert.deepEqual(node.eq(0).find('td').text(), 'red');

        assert.deepEqual(node.eq(1).attr(), {'class': '.double'});
        assert.deepEqual(node.eq(1).find('td').text(), 'black');

        assert.deepEqual(node.eq(2).attr(), {'class': '.single'});
        assert.deepEqual(node.eq(2).find('td').text(), 'blue');

        assert.deepEqual(node.eq(3).attr(), {'class': '.double'});
        assert.deepEqual(node.eq(3).find('td').text(), 'white');

        assert.deepEqual(node.eq(4).attr(), {'class': '.single'});
        assert.deepEqual(node.eq(4).find('td').text(), 'green');

        node = $('#wrapper .info-sel .single-sel');
        assert.equal(node.length, 1);
        assert.equal(node.find('option').length, 3);
        assert.equal(node.find('option').eq(0).val(), 1);
        assert.equal(node.find('option').eq(0).text(), 'A');

        assert.equal(node.find('option').eq(1).val(), 2);
        assert.equal(node.find('option').eq(1).text(), 'B');

        assert.equal(node.find('option').eq(2).val(), 3);
        assert.equal(node.find('option').eq(2).text(), 'C');
    });
})();
