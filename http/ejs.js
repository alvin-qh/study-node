const assert = require('assert');
const cheerio = require('cheerio');
const ejs = require('ejs');

/**
 * 测试EJS模板渲染
 */
(function () {

    // 编译html template字符串, 返回渲染函数
    let func = ejs.compile('<h1><%= title%></h1>');
    // 调用渲染函数, 传入参数, 得到html结果字符串
    assert.equal(func({'title': 'Hello'}), '<h1>Hello</h1>');

    // 渲染html template字符串, 传入参数, 得到html结果字符串
    let html = ejs.render('<h1><%= title%></h1>', {'title': 'Hello'});
    assert.equal(html, '<h1>Hello</h1>');

    // 通过一个存储html template的文件渲染html, 传入参数, 得到html字符串
    ejs.renderFile('ejs-views/render.ejs', {
        'names': ['Alvin', 'Lucy', 'Lily', 'Tom']
    }, (err, html) => {
        assert.ifError(err);

        let $ = cheerio.load(html), node;

        node = $('html head title');
        assert.equal(node.length, 1);
        assert.equal(node.text(), 'Hello EJS');

        node = $('#wrapper').find('div.names ul li');
        assert.equal(node.length, 4);
        assert.equal(node.eq(0).text(), 'Alvin');
        assert.equal(node.eq(1).text(), 'Lucy');
        assert.equal(node.eq(2).text(), 'Lily');
        assert.equal(node.eq(3).text(), 'Tom');
    });
})();
