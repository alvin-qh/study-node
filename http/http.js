#!/usr/bin/env node

'use strict';

let assert = require('assert');
let util = require('util');
let http = require('http');
let url = require('url');
let querystring = require('querystring');
let _ = require('lodash');
let jade = require('jade');

let httpService;

/**
 * 产生处理http请求的方法
 */
(function () {

  /**
   * 路由对象
   */
  let routers = {

    // 处理'/'路径GET方法请求
    'GET /': function (context) {

      // 产生一个JSON类型的结果
      let result = {
        'json': true,
        'headers': {    // 设置额外的http头参数
          'auth': 'alvin'
        }
      };

      let message = 'Hello node.js';
      // 判断请求参数对象中是否有name属性
      if (context.parameters.name) {
        message += ', have fun ' + context.parameters.name;
      }
      // 为结果对象设置content属性
      result.content = {
        'status': 'success',
        'message': message
      };
      return result;
    },

    // 处理'html'类型的请求
    'GET /new': function () {
      return {
        'html': true,
        'parameters': {
          'name': 'Alvin'
        }
      };
    },

    // 处理'/new'路径POST方法请求
    'POST /': function (context) {
      let name = context.parameters.name;
      let password = context.parameters.password;

      if (!name || !password) {
        let errors = {};
        if (!name) {
          errors['name'] = '帐号不能为空';
        }
        if (!password) {
          errors['password'] = '密码不能为空';
        }
        return {
          'html': true,
          'view': 'GET_new',
          'parameters': {
            'errors': errors,
            'name': name,
            'password': password
          }
        };
      }
      return {
        'redirect': true,
        'url': '/'
      }
    },

    // 处理'/redirect'路径GET方法请求
    'GET /redirect': function (context) {
      let url = '/';
      if (context.parameters.url) {
        url = context.parameters.url;
      }
      return {
        'redirect': true,
        'url': url
      };
    },

    // 处理404错误
    '404': function () {
      return {
        'json': true,
        'content': {
          'status': 'error',
          'message': 'Resource not found.'
        }
      };
    }
  };

  /**
   * 处理http请求的方法
   * @param request 请求对象
   * @param response 响应对象
   */
  httpService = function (request, response) {
    // 获取http协议版本号
    assert.equal(request.httpVersion, '1.1');

    // 获取请求的头信息
    assert.ok(request.headers.host.startsWith('localhost'));

    //console.log(request.headers);

    let parsedUrl = url.parse(request.url, true, false);
    //console.log(parsedUrl);

    // 上下文对象, 保存HTTP头参数和请求参数列表
    let context = { 'headers': request.headers, 'parameters': {} };

    // 将URL参数写入上下文对象请求参数列表
    _.extend(context.parameters, parsedUrl.query);

    let body = [];

    // 接收数据
    request.on('data', chunk => body.push(chunk));

    // 接收数据结束
    request.on('end', () => {
      if (body.length > 0) {
        _.extend(context.parameters, querystring.parse(body.join('')));
      }

      /**
       * 执行一个router方法, 处理
       * @param code
       * @param router
       */
      function execute(code, router) {
        if (router) {
          let result;

          // 根据router的类型
          if (util.isFunction(router)) {
            result = router(context);
          } else {
            result = router.controller(context)
          }

          // 根据结果类型进行响应处理
          if (result.redirect) {      // 处理重定向响应
            response.writeHeader(302, { 'Location': result.url });
            response.end();

          } else if (result.json) {   // 处理json类型响应
            let headers = {};

            // 合并结果中的header属性以及Content-Type属性
            _.extend(headers, result.headers, { 'Content-Type': 'text/json' });

            // 写响应头并返回json结果
            response.writeHeader(code, headers);
            response.end(JSON.stringify(result.content));

          } else if (result.html) {   // 处理html类型响应
            let headers = {};

            // 合并结果中的header属性以及Content-Type属性
            _.extend(headers, result.headers, { 'Content-Type': 'text/html' });
            response.writeHeader(code, headers);

            // 产生要跳转的URL
            let url = 'view/'
              + (result.view || (request.method + '_' + parsedUrl.pathname.substr(1)))
              + '.jade';

            // 渲染指定的页面
            jade.renderFile(url, _.extend({ 'errors': {} }, result.parameters), (err, html) => {
              if (err) {
                throw err;
              }
              // 输出html
              response.end(html);
            });
          } else {
            // 返回500错误
            response.writeHeader(500, { 'Content-Type': 'text/html' });
            response.end();
          }
        } else {
          // 返回404错误
          response.writeHeader(code, { 'Content-Type': 'text/html' });
          response.end();
        }
      }


      // 根据请求路径获取对应的router对象
      let router = routers[request.method + ' ' + (parsedUrl.pathname || '/')];
      try {
        if (router) {
          // 找到指定的router对象, 进行处理
          execute(200, router);
        } else {
          // 未找到指定的router对象, 尝试
          execute(404, routers['404']);
        }
      } catch (e) {
        console.log(e);
        execute(500, routers['500']);
      }
    });
  };
})();


/**
 * 测试'http.server', 启动一个http服务, 回调函数方式
 */
(function () {

  // 创建一个server对象, 并对指定端口进行监听, 在发生http请求后回调回调函数
  // 回调函数的两个参数为'http.ClientRequest'对象和'http.ServerResponse'对象
  let server = http.createServer(httpService)
    .on('close', () => server.close());     // 处理服务关闭消息

  // 最大请求头数目限制, 默认 1000 个. 如果设置为0, 则代表不做任何限制
  server.maxHeadersCount = 1000;

  // 为套接字设定超时值。如果一个超时发生，那么Server对象上会分发一个'timeout'事件，同时将套接字作为参数传递
  // 设置为0将阻止之后建立的连接的一切自动超时行为
  server.setTimeout(1000, socket => console.log(''));

  // 一个套接字被判断为超时之前的闲置毫秒数。 默认 120000 (2 分钟)
  server.timeout = 120000;

  // 启动服务监听, 绑定8081端口, 接收所有IP地址请求
  server.listen(8081, '0.0.0.0', () => {
    console.log('Listen 8081 successful');
  });

})();


/**
 * 测试'http.server', 启动一个http服务
 */
(function () {

  // 创建一个server对象
  let server = http.createServer()
    .on("request", httpService)         // 处理请求消息
    .on('close', () => server.close()); // 处理服务关闭消息

  server.listen(8082, () => console.log('Listen 8082 successful'));
})();


/**
 * 测试发送请求
 */
(function () {

  /**
   * 测试请求方法
   * @param port 端口号
   */
  function doTest(port) {

    /**
     * 测试get方法
     */
    http.get('http://localhost:' + port + '/', response => {
      response.setEncoding('utf8');

      assert.equal(response.statusCode, 200);
      assert.equal(response.headers['auth'], 'alvin');

      let body = [];

      // 接收响应数据
      response.on('data', chunk => body.push(chunk));

      // 接收响应数据完毕, 处理结果
      response.on('end', () => {
        console.log('http://localhost:' + port + ' request complete');
        assert.deepEqual(JSON.parse(body.join('')), { 'status': 'success', 'message': 'Hello node.js' });
      });
    }).on('error', err => {
      throw err;
    });


    /**
     * 测试get方法并传参
     */
    http.get('http://localhost:' + port + '?name=alvin', response => {
      response.setEncoding('utf8');

      assert.equal(response.statusCode, 200);
      assert.equal(response.headers['auth'], 'alvin');

      let body = [];
      response.on('data', chunk => body.push(chunk));
      response.on('end', () => {
        console.log('http://localhost:' + port + '?name=alvin request complete');
        assert.deepEqual(JSON.parse(body.join('')), {
          'status': 'success',
          'message': 'Hello node.js, have fun alvin'
        });
      });
    }).on('error', err => {
      throw err;
    });
  }


  // 测试8081端口服务
  doTest(8081);

  // 测试8082端口服务
  doTest(8082);
})();
