import { fail } from 'assert';
import axios, { AxiosError } from 'axios';
import { expect } from 'chai';
import * as cheerio from 'cheerio';

import { close, start } from './server';

// 创建用于发送测试请求的 Axios 对象
const http = axios.create({
  baseURL: 'http://127.0.0.1:9090/',
  headers: {
    common: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
  timeout: 3600,
});

describe('Test http server', () => {
  /**
   * 在测试前启动服务器
   */
  before(async () => {
    await start(9090);
  });

  /**
   * 测试结束后关闭服务器
   */
  after(async () => {
    await close();
  });

  /**
   * 测试服务器是否启动成功
   */
  it('should server started', async () => {
    // 发送 GET 请求并传递请求参数
    const resp = await http.get('/?name=Alvin');
    expect(resp.status).is.eq(200);

    // 确认响应数据正确
    const { data } = resp;
    expect(data.status).is.eq('success');
    expect(data.message).is.eq('Hello node.js, have fun Alvin');

    // 确认响应头符合预期
    const { headers } = resp;
    expect(headers.auth).is.eq('alvin');
  });

  /**
   * 测试服务端渲染 HTML 并返回
   */
  it('should server render html and got response', async () => {
    // 发起请求, 返回一个 HTML 页面
    const resp = await http.get('/login');
    expect(resp.status).is.eq(200);

    // 解析返回 HTML 数据并确认内容正确
    const $ = cheerio.load(resp.data);
    expect($('#submit-form')).has.length(1);
    expect($('#submit-form input[type=\'text\'][name=\'name\']')).has.length(1);
    expect($('#submit-form input[type=\'password\'][name=\'password\']')).has.length(1);
  });

  /**
   * 测试发送 POST 请求, 传递 URL 编码参数并返回结果
   */
  it('should post data to server and got response by url encoded', async () => {
    try {
      await http.post('/login',
        'name=Alvin&password=123456',
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          maxRedirects: 0,
        }
      );

      fail();
    } catch (err) {
      if (!(err instanceof AxiosError)) {
        fail();
      }
      expect(err.response?.status).is.eq(302);
      expect(err.response?.headers.location).is.eq('/?name=Alvin');
    }
  });

  /**
   * 测试发送 POST 请求, 传递 JSON 编码参数并返回结果
   */
  it('should post data to server and got response by json encoded', async () => {
    try {
      await http.post('/login',
        {
          name: 'Alvin',
          password: '123456',
        },
        {
          headers: {'Content-Type': 'application/json'},
          maxRedirects: 0,
        }
      );

      fail();
    } catch (err) {
      if (!(err instanceof AxiosError)) {
        fail();
      }
      expect(err.response?.status).is.eq(302);
      expect(err.response?.headers.location).is.eq('/?name=Alvin');
    }
  });
});
