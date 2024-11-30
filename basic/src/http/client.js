import { createDeflate, createGunzip } from 'node:zlib';
import { URL } from 'node:url';
import http from 'node:http';
import https from 'node:https';

/**
 * 通过 HTTP 客户端进行一次请求访问
 *
 * @param {string} url 请求的 URL
 * @param {string} method 请求方法, 例如 `'POST'`, `'GET'` 等
 * @param {string} data 请求数据
 * @param {string} contentType 请求类型
 * @param {object} headers 请求 HTTP 头
 * @param {string} encoding 请求字符编码
 * @returns {Promise<object>} `Promise` 类型对象, 表示一次异步请求结果
 */
export function request(url, method, data, contentType, headers, encoding = 'UTF-8') {
  // 返回异步调用对象
  return new Promise((resolve, reject) => {
    // 解析请求 URL, 生成请求选项对象
    const opts = new URL(url);

    // 判断要发出请求的协议类型, 通过不同请求对象进行调用
    let proto = http;
    if (opts.protocol === 'https:') {
      proto = https;

      // 对于 HTTPS 请求, 需要在请求选项中增加下面两项
      Object.assign(opts, {
        rejectUnauthorized: false,
        requestCert: true,
      });
    }

    // 如果有要发送数据, 则针对发送数据设置 HTTP header
    if (data) {
      Object.assign(headers, {
        'Accept-Encoding': 'gzip,deflate', // 允许服务端对数据进行压缩
        'Content-Length': Buffer.byteLength(data, encoding),
        'Content-Type': `${contentType}; charset=${encoding}`,
      });
    }

    // 将 'headers' 和 'method' 两个 key 放入请求选项对象中
    Object.assign(opts, { headers, method });

    // 发起请求, 并在回调函数中等待服务端返回的响应结果
    const req = proto.request(opts, resp => {
      // 针对响应结果的压缩类型, 选择不同的解压缩器对象, 如果未压缩则无需解压缩器
      let decoder = null;
      switch (resp.headers['content-encoding']) {
        case 'gzip':
          decoder = createGunzip();
          break;
        case 'deflate':
          decoder = createDeflate();
          break;
        default:
          break;
      }

      // 如果使用了解压缩器, 则将其和响应对象进行关联
      if (decoder) {
        resp.pipe(decoder);
        resp = decoder;
      }

      // 处理 'data' 事件, 接收响应信息内容, 将分段接收的响应数据存入数组
      const chunks = [];
      resp.on('data', chunk => chunks.push(Buffer.from(chunk)));

      // 处理 'end' 事件, 表示响应内容已完成接收
      resp.on('end', () => {
        // 将数组中的分段数据进行合并
        const buf = Buffer.concat(chunks);

        // 调用异步回调, 返回响应内容对象
        resolve({
          code: resp.statusCode,
          data: buf.toString(encoding),
          headers: resp.headers,
        });
      });

      // 处理响应接收失败的消息
      resp.on('error', err => reject(err));
    });

    // 处理请求发送失败的消息
    req.on('error', err => reject(err));

    // 如果有请求数据, 则发送请求数据
    if (data) {
      req.write(data, encoding);
    }

    // 所有请求数据已发送完毕, 完成一次请求
    req.end();
  });
}

/**
 * 向服务端发送一次 GET 请求并获取响应结果
 *
 * @param {string} url 请求 URL 地址
 * @param {object} headers 请求 HTTP header
 * @param {string} encoding 请求字符编码
 * @returns {Promise<object>} 服务端响应结果对象
 */
export async function get(url, headers = null, encoding = 'utf-8') {
  return request(url, 'GET', null, null, headers || {}, encoding);
}

/**
 * 向服务端发送一次 POST 请求并获取响应结果
 *
 * @param {string} url 请求 URL 地址
 * @param {string} data 要发往服务端的数据
 * @param {string} [contentType="application/x-www-form-urlencoded"] 发送到服务端数据的类型
 * @param {object} headers 请求 HTTP header
 * @param {string} encoding 请求字符编码
 * @returns {Promise<object>} 服务端响应结果对象
 */
export async function post(url, data, contentType = 'application/x-www-form-urlencoded', headers = null, encoding = 'utf-8') {
  return request(url, 'POST', data, contentType, headers || {}, encoding);
}
