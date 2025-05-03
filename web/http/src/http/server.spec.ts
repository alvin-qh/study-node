import * as cheerio from 'cheerio';

import http from 'http';

import { close, start } from './server';

/**
 * 测试 `http.server` 模块
 */
describe("test 'http.server' module", () => {
  /**
   * 在测试前启动服务器
   */
  beforeAll(async () => {
    await start(9090);
  });

  /**
   * 测试结束后关闭服务器
   */
  afterAll(async () => {
    await close();
  });

  /**
   * 定义响应对象类型
   */
  interface Response {
    statusCode: number
    headers: http.IncomingHttpHeaders
    body: string
  }

  /**
   * 测试服务器是否启动成功
   */
  it("should 'start' server", async () => {
    // 发送 GET 请求并传递请求参数
    const resp = await new Promise<Response>((resolve, reject) => {
      const req = http.request(
        // 发送请求参数
        {
          hostname: 'localhost',
          port: 9090,
          path: '/?name=Alvin',
          method: 'GET',
          headers: {
            Accept: 'application/json; charset=utf-8',
          },
        },

        // 通过回调获取服务端响应
        (res) => {
          // 设置响应内容字符编码
          res.setEncoding('utf-8');

          // 保存相应内容数据
          const chunks: string[] = [];

          // 处理响应数据到达事件, 分段处理响应数据
          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          // 处理响应数据接收完毕事件
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode ?? 200,
              headers: res.headers,
              body: chunks.join(''),
            });
          });

          // 处理响应错误事件
          res.on('error', reject);
        }
      );

      // 请求发送完毕
      req.end();
    });

    expect(resp.statusCode).toEqual(200);

    // 确认响应头符合预期
    expect(resp.headers['auth']).toEqual('alvin');

    // 确认响应数据正确
    const data = JSON.parse(resp.body as string) as { status: string, message: string };
    expect(data.status).toEqual('success');
    expect(data.message).toEqual('Hello node.js, have fun Alvin');
  });

  /**
   * 测试服务端渲染 HTML 并返回
   */
  it("should 'get' HTML response", async () => {
    const resp = await new Promise<Response>((resolve, reject) => {
      const req = http.request(
        // 发送请求参数
        {
          hostname: 'localhost',
          port: 9090,
          path: '/login',
          method: 'GET',
          headers: {
            Accept: 'text/html; charset=utf-8',
          },
        },

        // 通过回调获取服务端响应
        (res) => {
          // 设置响应内容字符编码
          res.setEncoding('utf-8');

          // 保存相应内容数据
          const chunks: string[] = [];
          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          // 处理响应数据接收完毕事件
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode ?? 200,
              headers: res.headers,
              body: chunks.join(''),
            });
          });
          res.on('error', reject);
        }
      );

      // 请求发送完毕
      req.end();
    });

    expect(resp.statusCode).toEqual(200);

    // 解析返回 HTML 数据并确认内容正确
    const $ = cheerio.load(resp.body as string);

    // 确认获取的 HTML 内容符合预期
    expect($('#submit-form')).toHaveLength(1);
    expect($("#submit-form input[type='text'][name='name']")).toHaveLength(1);
    expect($("#submit-form input[type='password'][name='password']")).toHaveLength(1);
  });

  /**
   * 测试发送 POST 请求, 传递 URL 编码参数并返回结果
   */
  it("should 'post' form data", async () => {
    const resp = await new Promise<Response>((resolve, reject) => {
      const req = http.request(
        // 发送请求参数
        {
          hostname: 'localhost',
          port: 9090,
          path: '/login',
          method: 'POST',
          headers: {
            accept: 'text/html; charset=utf-8',
            'content-type': 'application/x-www-form-urlencoded',
          },
        },

        // 通过回调获取服务端响应
        (res) => {
          // 获取响应内容字符编码
          res.setEncoding('utf-8');

          // 保存相应内容数据
          const chunks: string[] = [];

          // 处理响应数据到达事件, 分段处理响应数据
          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          // 处理响应数据接收完毕事件
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode ?? 200,
              headers: res.headers,
              body: chunks.join(''),
            });
          });

          // 处理响应错误事件
          res.on('error', reject);
        }
      );

      // 发送请求数据
      const data = `name=${encodeURIComponent('Alvin')}&password=${encodeURIComponent('123456')}`;
      req.write(data, (err) => {
        if (err) {
          reject(err);
        }

        // 请求发送完毕
        req.end();
      });
    });

    // 确认服务端返回重定向指令
    expect(resp.statusCode).toEqual(302);

    // 确认重定向目标地址
    expect(resp.headers['location']).toEqual('/?name=Alvin');
  });

  /**
   * 测试发送 POST 请求, 传递 JSON 编码参数并返回结果
   */
  it("should 'post' json data", async () => {
    const resp = await new Promise<Response>((resolve, reject) => {
      const req = http.request(
        // 发送请求参数
        {
          hostname: 'localhost',
          port: 9090,
          path: '/login',
          method: 'POST',
          headers: {
            accept: 'text/html; charset=utf-8',
            'content-type': 'application/json; charset=utf-8',
          },
        },

        // 通过回调获取服务端响应
        (res) => {
          // 获取响应内容字符编码
          res.setEncoding('utf-8');

          // 保存相应内容数据
          const chunks: string[] = [];

          // 处理响应数据到达事件, 分段处理响应数据
          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          // 处理响应数据接收完毕事件
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode ?? 200,
              headers: res.headers,
              body: chunks.join(''),
            });
          });

          // 处理响应错误事件
          res.on('error', reject);
        }
      );

      // 发送请求数据
      const data = JSON.stringify({
        name: 'Alvin',
        password: '123456',
      });
      req.write(data, (err) => {
        if (err) {
          reject(err);
        }

        // 请求发送完毕
        req.end();
      });
    });

    // 确认服务端返回重定向指令
    expect(resp.statusCode).toEqual(302);

    // 确认重定向目标地址
    expect(resp.headers['location']).toEqual('/?name=Alvin');
  });
});
