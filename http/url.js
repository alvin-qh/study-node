#!/usr/bin/env node

'use strict';

let assert = require('assert');
let url = require('url');
let querystring = require('querystring');

/**
 * 测试'url'模块
 */
(function () {

    /*
     * 测试'url.parse'函数, 解析指定url
     */
    const URL = 'https://alvin@www.baidu.com:80/s?wd=%E6%B5%8B%E8%AF%95#top';

    // 解析指定URL, 得到解析结果
    // 第二个参数表示是否解析'query string', 即URL附带的参数信息, 默认为true
    // 第三个参数表示路径的解析方法, 默认为false, 如果设置为true, 表示'//foo/bar'这类URL会把'foo'解析为主机名
    let result = url.parse(URL, true, false);

    // 确定解析结果正确
    assert.equal(result.href, 'https://alvin@www.baidu.com:80/s?wd=%E6%B5%8B%E8%AF%95#top');
    assert.equal(result.protocol, 'https:');                // 协议名
    assert.equal(result.host, 'www.baidu.com:80');          // 主机和主机名
    assert.equal(result.hostname, 'www.baidu.com');
    assert.equal(result.port, '80');                        // 端口号
    assert.equal(result.path, '/s?wd=%E6%B5%8B%E8%AF%95');  // 访问路径
    assert.equal(result.pathname, '/s');
    assert.equal(result.search, '?wd=%E6%B5%8B%E8%AF%95');  // 参数字符串
    assert.deepEqual(result.query, {'wd': '测试'});          // 访问参数
    assert.deepEqual(result.auth, 'alvin');          // 用户名
    assert.deepEqual(result.hash, '#top');           // hash值


    /*
     * 测试'url.format'函数, 产生一个url
     */
    let urlObj = {
        'protocol': 'https',
        //'auth': 'alvin',
        //'hash': '#top'
        'host': 'www.baidu.com:80',
        //'hostname': 'www.baidu.com',  可以被host参数取代
        //'port': 80,                   可以被host参数取代
        'pathname': 's',
        'query': {'wd': '测试'}
        //'search': '?wd=%E6%B5%8B%E8%AF%95'    可以被query参数取代
    };

    let path = url.format(urlObj);
    assert.equal(path, 'https://www.baidu.com:80/s?wd=%E6%B5%8B%E8%AF%95');


    /*
     * 测试'url.resolve'函数, 处理URL路径
     */

    // 在URL之后加上路径
    assert.equal(url.resolve('http://www.baidu.com', '/s/a/b'), 'http://www.baidu.com/s/a/b');

    // 替换根路径
    assert.equal(url.resolve('http://www.baidu.com/s', '/a/b'), 'http://www.baidu.com/a/b');
    assert.equal(url.resolve('http://www.baidu.com/s/a', '/b'), 'http://www.baidu.com/b');

    // 替换相对路径
    assert.equal(url.resolve('http://www.baidu.com/s/a', 'b/c'), 'http://www.baidu.com/s/b/c');

})();


/**
 * 测试'querystring'模块
 */
(function () {
    const params = {'name': 'alvin', 'code': ['1001', '1002'], 'level': '三年级'};
    const url = 'name=alvin&code=1001&code=1002&level=%E4%B8%89%E5%B9%B4%E7%BA%A7';

    const options = {
        maxKey: 1000
    };

    // 将JSON对象编码为URL
    assert.equal(querystring.stringify(params, '&', '=', options), url);
    assert.equal(querystring.encode(params, '&', '=', options), url);

    // 将URL解码为JSON对象
    assert.deepEqual(querystring.parse(url, '&', '=', options), params);
    assert.deepEqual(querystring.decode(url, '&', '=', options), params);

    // 对文字进行编码
    assert.equal(querystring.escape('三年级'), '%E4%B8%89%E5%B9%B4%E7%BA%A7');

    // 将编码解码为文字
    assert.equal(querystring.unescape('%E4%B8%89%E5%B9%B4%E7%BA%A7'), '三年级');
})();
