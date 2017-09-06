#!/usr/bin/env node

'use strict';

let assert = require('assert');
let fs = require('fs');
let _ = require('lodash');
let cheerio = require('cheerio');
let jade = require('jade');

/**
 * 测试jade基本API
 */
(function () {
    let func, html;

    // 定义一个jade格式的字符串
    let jadeString = `html
        head
            title #{name}
        body
            p#age #{age}`;

    // 定义渲染页码时所需的参数
    let jadeParams = {
        'name': 'Alvin',
        'age': 34
    };

    // 方式1. 编译jade字符串, 得到代理函数
    func = jade.compile(jadeString);
    // 执行代理函数, 传入参数对象
    html = func(jadeParams);
    // 确认由jade字符串产生了html字符串结果
    assert.equal(html, '<html><head><title>Alvin</title></head><body><p id="age">34</p></body></html>');

    // 方式2. 编译jade文件, 得到代理函数
    func = jade.compileFile('jade-views/render.jade');
    // 执行代理函数, 传入参数对象
    html = func(jadeParams);
    // 确认由jade字符串产生了html字符串结果
    assert.equal(html, '<!DOCTYPE html><html lang="en"><head><title>Alvin</title></head><body><div id="age">34</div></body></html>');

    // 方式3. 编译jade字符串, 得到代理函数源代码, 可以由浏览器执行
    func = jade.compileClient(jadeString);
    // 确认由jade字符串产生了代理函数源代码
    assert.equal(func, fs.readFileSync('jade-views/client.txt').toString('utf8').split('\n\n')[0]);

    // 方式4. 编译jade文件, 得到代理函数源代码, 可以由浏览器执行
    func = jade.compileFileClient('jade-views/render.jade');
    // 确认由jade字符串产生了代理函数源代码
    assert.equal(func, fs.readFileSync('jade-views/client.txt').toString('utf8').split('\n\n')[1]);

    // 方式5.1. 将jade字符串渲染为html字符串（同步方式）
    assert.equal(jade.render(jadeString, jadeParams), '<html><head><title>Alvin</title></head><body><p id="age">34</p></body></html>');

    // 方式5.2. 将jade字符串渲染为html字符串（异步方式）
    jade.render(jadeString, jadeParams, (err, html) => {
        assert.ifError(err);
        // 确认由jade字符串产生了html字符串
        assert.equal(html, '<html><head><title>Alvin</title></head><body><p id="age">34</p></body></html>');
    });

    // 方式6.1. 将jade文件渲染为html字符串（同步方式）
    assert.equal(jade.renderFile('jade-views/render.jade', jadeParams), '<!DOCTYPE html><html lang="en"><head><title>Alvin</title></head><body><div id="age">34</div></body></html>');

    // 方式6.2. 将jade文件渲染为html字符串（异步方式）
    jade.renderFile('jade-views/render.jade', jadeParams, (err, html) => {
        assert.ifError(err);
        // 确认由jade字符串产生了html字符串
        assert.equal(html, '<!DOCTYPE html><html lang="en"><head><title>Alvin</title></head><body><div id="age">34</div></body></html>');
    });

})();


/**
 * 测试jade语法
 */
(function () {

    /**
     * 测试attributes
     */
    jade.renderFile('jade-views/attribs.jade', {'pretty': true, 'ok': true}, (err, html) => {
        assert.ifError(err);

        let $ = cheerio.load(html);
        let node, root = $('html');     // 获取<html>节点
        assert.equal(root.length, 1);
        assert.equal(root.attr('lang'), 'cn');

        node = root.find('head>title'); // 获取<title>节点
        assert.equal(node.length, 1);
        assert.equal(node.text(), 'Test Attributes');

        node = root.find('head>script'); // 获取<script>节点
        assert.equal(node.length, 2);
        assert.equal($(node[0]).attr('src'), '/asset/js/attribute.js');
        assert.equal($(node[1]).attr('type'), 'text/javascript');
        assert.equal($(node[1]).text().trim(), '$(\'.button\').on(\'click\', function () {\n          alter(\'Hello\');\n      });');

        node = root.find('#wrapper');
        assert.equal(node.length, 1);
        assert.equal(node.attr('class'), 'wrapper');

        node = root.find('#header');
        assert.equal(node.length, 1);
        assert.equal(node.data('title'), 'x > y');
        assert.equal(node.data('value'), 'x < z');
        assert.equal(node.find('span').text(), 'Sub Title');

        node = root.find('#content a.button');
        assert.equal(node.length, 1);
        assert.equal(node.attr('class'), 'button');
        assert.equal(node.attr('href'), 'http://www.baidu.com');

        node = root.find('#content p.success');
        assert.equal(node.length, 1);
        assert.equal(node.text(), 'success');

        node = root.find('#submit-form .row').eq(0).find('input[type=text]');
        assert.equal(node.length, 1);
        assert.equal(node.attr('name'), 'name');
        assert.equal(node.val(), 'Alvin');

        node = root.find('#submit-form .row').eq(1).find('input[type=radio]');
        assert.equal(node.length, 2);
        assert.equal($(node[0]).attr('name'), 'gender');
        assert.equal($(node[1]).attr('name'), 'gender');
        assert.equal($(node[0]).val(), 'M');
        assert.equal($(node[1]).val(), 'F');
        assert.equal($(node[0]).is(':checked'), true);
        assert.equal($(node[1]).is(':checked'), false);

        node = root.find('#submit-form .row').eq(1).contents().filter((n, _this) => {
            return _this.data && _this.data.trim() && _this.nodeType === 3;
        });
        assert.equal(node.length, 2);
        assert.equal(node[0].data.trim(), 'Male');
        assert.equal(node[1].data.trim(), 'Female');

        node = root.find('#submit-form .row').eq(2).find('button[type=submit]');
        assert.equal(node.length, 1);
        assert.deepEqual(node.css(), {'color': 'red', 'background': '#ccc'});

        node = root.find('#wrapper .pagination>ul').children();
        assert.equal(node.length, 5);

        node.each((n, val) => {
            assert.equal(val.name, 'li');
            assert.deepEqual($(val).attr(), {'class': 'page', 'style': 'float:left;list-style:none'});
            assert.equal($(val).text(), n + 1);
        });
    });
})();

/**
 * 测试jade语法
 */
(function () {

    let parameters = {
        'name': 'Alvin',
        'gender': 'M',
        'textbox': '<input type="text">',
        'list': [1, 2, 3, 4, 5],
        'status': 'warning',
        'level': 'normal',
        'users': {
            'alvin': 32,
            'lily': 44,
            'plunk': 19
        },
        'max': 5,
        'add': {
            'first': 10,
            'second': 20
        }
    };

    jade.renderFile('jade-views/code.jade', _.extend(parameters, {'pretty': true}), (err, html) => {
        assert.ifError(err);

        let $ = cheerio.load(html), node;

        node = $('#express');
        assert.equal(node.length, 1);
        assert.equal(node.text(), 'Alvin, Welcome');

        node = $('#attribute-express').find('input[type=radio]');
        assert.equal(node.length, 2);
        assert.equal(node.filter(':checked').val(), 'M');
        assert.equal(node.not(':checked').val(), 'F');

        node = $('#unescaped');
        assert.equal(node.find('input[type=text]').length, 1);

        node = $('#tag-interpolation');
        assert.equal(node.find('a.answer').length, 1);
        assert.equal(node.find('a.answer').attr('href'), '/answer');
        assert.equal(node.find('a.answer').text(), 'Click Here');

        node = $('#condition').find('p');
        assert.equal(node.length, 1);
        assert.equal(node.attr('class'), 'warn');
        assert.equal(node.text(), 'Warning');

        node = $('#unless').find('p.title');
        assert.equal(node.length, 1);
        assert.equal(node.text(), 'Sir, Alvin');

        node = $('#case').find('div');
        assert.equal(node.length, 1);
        assert.equal(node.attr('class'), 'normal');
        assert.equal(node.text(), 'Level2');

        node = $('#foreach').find('li');
        assert.equal(node.length, 5);
        node.each((n, val) => {
            assert.equal(val.name, 'li');
            assert.equal($(val).text(), n + 1);
        });

        node = $('#each').find('li');
        assert.equal(node.length, 3);
        assert.equal(node.eq(0).attr('id'), 'alvin');
        assert.equal(node.eq(0).text(), '32');
        assert.equal(node.eq(1).attr('id'), 'lily');
        assert.equal(node.eq(1).text(), '44');
        assert.equal(node.eq(2).attr('id'), 'plunk');
        assert.equal(node.eq(2).text(), '19');

        node = $('#while').find('li');
        assert.equal(node.length, 5);
        assert.equal(node.eq(0).attr('id'), 's0');
        assert.equal(node.eq(0).text(), '0');
        assert.equal(node.eq(1).attr('id'), 's1');
        assert.equal(node.eq(1).text(), '1');
        assert.equal(node.eq(2).attr('id'), 's2');
        assert.equal(node.eq(2).text(), '2');
        assert.equal(node.eq(3).attr('id'), 's3');
        assert.equal(node.eq(3).text(), '3');
        assert.equal(node.eq(4).attr('id'), 's4');
        assert.equal(node.eq(4).text(), '4');

        node = $('#mixin').find('.add');
        assert.equal(node.length, 1);
        assert.equal(node.find('input[type=text].first').val(), 10);
        assert.equal(node.find('input[type=text].second').val(), 20);
        assert.equal(node.find('input[type=text].result').val(), 30);
    });
})();


/**
 * 演示jade模板
 */
(function () {
    let parameters = {
        'users': [
            {'name': 'Alvin', 'age': 34},
            {'name': 'Lily', 'age': 43},
            {'name': 'Pipy', 'age': 19}
        ]
    };

    jade.renderFile('jade-views/template.jade', _.extend(parameters, {'pretty': true}), (err, html) => {
        assert.ifError(err);

        let $ = cheerio.load(html), node;

        node = $('html head title');
        assert.equal(node.length, 1);
        assert.equal(node.text(), 'Template');

        node = $('html head script');
        assert.equal(node.length, 1);
        assert.equal(node.attr('src'), 'jquery.js');

        node = $('html head meta');
        assert.equal(node.length, 1);
        assert.equal(node.attr('http-equiv'), 'content-type');
        assert.equal(node.attr('content'), 'text/html; charset=utf-8');

        node = $('html body #wrapper');
        assert.equal(node.length, 1);

        node = $('html body #wrapper').find('#content');
        assert.equal(node.length, 1);
        assert.equal(node.text(), 'Hello World');

        node = $('html body #wrapper ul.users').find('li');
        assert.equal(node.length, 3);
        assert.equal(node.eq(0).data('name'), 'Alvin');
        assert.equal(node.eq(0).text(), '34');

        assert.equal(node.eq(1).data('name'), 'Lily');
        assert.equal(node.eq(1).text(), '43');

        assert.equal(node.eq(2).data('name'), 'Pipy');
        assert.equal(node.eq(2).text(), '19');

        node = $('html body').find('script[src]');
        assert.equal(node.length, 1);
        assert.equal(node.attr('src'), 'jquery-ui.js');

        node = node.next('script');
        assert.equal(node.length, 1);
        assert.equal(node.text(), `alert(\'Hello\');`);
    });
})();
