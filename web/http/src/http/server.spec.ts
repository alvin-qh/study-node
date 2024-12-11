import { afterAll, beforeAll, describe, expect, it, test } from 'bun:test';

import * as cheerio from 'cheerio';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import FormData from 'form-data';

import { close, start } from './server';

// 创建用于发送测试请求的 Axios 对象
const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:9090/',
  headers: {
    common: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
  timeout: 3600,
});

describe('test `server` module', () => {
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
   * 测试服务器是否启动成功
   */
  it('should `start` server', async () => {
    // 发送 GET 请求并传递请求参数
    const resp = await axiosClient.get('/?name=Alvin');
    expect(resp.status).toEqual(200);

    // 确认响应数据正确
    const { data } = resp;
    expect(data.status).toEqual('success');
    expect(data.message).toEqual('Hello node.js, have fun Alvin');

    // 确认响应头符合预期
    const { headers } = resp;
    expect(headers.auth).toEqual('alvin');
  });

  /**
   * 测试服务端渲染 HTML 并返回
   */
  it('should `get` HTML response', async () => {
    // 发起请求, 返回一个 HTML 页面
    const resp = await axiosClient.get('/login');
    expect(resp.status).toEqual(200);

    // 解析返回 HTML 数据并确认内容正确
    const $ = cheerio.load(resp.data);
    expect($('#submit-form')).toHaveLength(1);
    expect($('#submit-form input[type=\'text\'][name=\'name\']')).toHaveLength(1);
    expect($('#submit-form input[type=\'password\'][name=\'password\']')).toHaveLength(1);
  });

  /**
   * 测试发送 POST 请求, 传递 URL 编码参数并返回结果
   */
  it('should `post` form data', async () => {
    try {
      await axiosClient.post('/login',
        'name=Alvin&password=123456',
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          maxRedirects: 0,
        }
      );
      expect().fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      expect(err.response?.status).toEqual(302);
      expect(err.response?.headers.location).toEqual('/?name=Alvin');
    }
  });

  /**
   * 测试发送 POST 请求, 传递 JSON 编码参数并返回结果
   */
  it('should `post` json data', async () => {
    try {
      await axiosClient.post('/login',
        {
          name: 'Alvin',
          password: '123456',
        },
        {
          headers: { 'Content-Type': 'application/json' },
          maxRedirects: 0,
        }
      );

      expect().fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      expect(err.response?.status).toEqual(302);
      expect(err.response?.headers.location).toEqual('/?name=Alvin');
    }
  });

  /**
   * 测试发送 `multipart/form-data` 类型表单
   */
  test.skip('should `post` multi-part form data', async () => {
    const enc = new TextEncoder();

    const form = new FormData();
    form.append('id', 100);
    form.append('name', 'Alvin');
    form.append('gender', 'M');
    form.append('content', Buffer.from(enc.encode('Hello World')), 'demo.txt');

    // 创建请求配置对象
    const conf: AxiosRequestConfig = {
      url: 'https://getman.cn/echo',
      method: 'post',
      headers: {
        ...form.getHeaders(),
        Accept: 'text/plain',
      },
      data: form,
    };

    // 发送请求并确认请求正确
    const resp = await axios(conf);
    expect(resp.status).toEqual(200);
  });
});
