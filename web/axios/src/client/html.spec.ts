import axios from 'axios';

import * as cheerio from 'cheerio';

import { start } from '@/server';

import { parseCookie } from './cookie';

/**
 * 测试通过 `Axios` 库获取 `html` 内容
 */
describe("test 'home' router", () => {
  let closeFn: (() => void) | undefined;

  // 测试前执行, 启动服务器
  beforeAll(() => {
    closeFn = start();
  });

  // 测试后执行, 关闭服务器
  afterAll(() => {
    if (closeFn) {
      closeFn();
    };
  });

  // 创建一个 axios 实例
  const client = axios.create({
    baseURL: 'http://localhost:9000', // 服务器地址
    headers: { 'Content-Type': 'text/html' }, // 响应类型
    timeout: 3000, // 超时时间
    withCredentials: true,
    validateStatus: () => true,
  });

  /**
   * 测试通过 `axios` 获取 `html` 内容
   */
  it('should GET html content', async () => {
    // 请求 `/` 地址, 设置 cookie, 返回响应对象
    const resp = await client.get<string>('/', {
      headers: {
        cookie: 'username=Alvin',
      },
    });

    // 确认返回正确响应
    expect(resp.status).toEqual(200);
    expect(resp.headers['content-type']).toEqual('text/html; charset=utf-8');

    // 读取返回的 HTML 内容
    const $ = cheerio.load(resp.data);
    expect($('body .container>h1').text()).toEqual('Hello Alvin!!');
  });

  /**
   * 测试发送 `POST` 登录请求, 并提交成功
   */
  it("should POST 'login' form successful", async () => {
    const formData = `username=${encodeURIComponent('Alvin')}&password=${encodeURIComponent('123456')}`;

    // 提交表单数据
    let resp = await client.post<string>('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      maxRedirects: 0,
    });

    // 确认返回正确响应, 服务端登录成功后, 返回 302 重定向到主页
    expect(resp.status).toEqual(302);
    expect(resp.headers['location']).toEqual('/');

    const cookieValue = resp.headers['set-cookie'];

    // 确认响应携带正确的 cookie
    const cookies = parseCookie(cookieValue)[0];
    expect(cookies.username).toEqual('Alvin');
    expect(cookies.path).toEqual('/');

    // 再次请求 `/` 地址, 设置前一次响应返回的 cookie, 返回响应对象
    resp = await client.get<string>('/', {
      headers: {
        cookie: cookieValue,
      },
    });

    // 确认返回正确响应
    expect(resp.status).toEqual(200);
    expect(resp.headers['content-type']).toEqual('text/html; charset=utf-8');

    // 读取返回的 HTML 内容
    const $ = cheerio.load(resp.data);
    expect($('body .container>h1').text()).toEqual('Hello Alvin!!');
  });

  /**
   * 测试发送 `POST` 登录请求, 且提交失败
   */
  it("should POST 'login' form failed", async () => {
    const formData = `username=${encodeURIComponent('Alvin')}&password=${encodeURIComponent('1111111')}`;

    // 获取 `/` 地址的 HTML 内容
    const resp = await client.post<string>('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      maxRedirects: 0,
    });

    expect(resp.status).toEqual(403);

    // 读取返回的 HTML 内容
    const $ = cheerio.load(resp.data);
    expect($('body .container>h1').text()).toEqual('Error: Invalid password!!');
  });

  /**
   * 测试发送 `POST` 登出请求, 并提交成功
   */
  it("should POST 'logout' form successful", async () => {
    // 提交表单数据
    let resp = await client.post<string>('/logout', null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        cookie: 'username=Alvin',
      },
      maxRedirects: 0,
    });

    // 确认返回正确响应, 服务端登录成功后, 返回 302 重定向到主页
    expect(resp.status).toEqual(302);
    expect(resp.headers['location']).toEqual('/');

    const cookieValue = resp.headers['set-cookie'];

    // 确认响应携带正确的 cookie
    const cookies = parseCookie(cookieValue)[0];
    expect(cookies.username).toBeUndefined();
    expect(cookies.path).toEqual('/');

    // 再次请求 `/` 地址, 设置前一次响应返回的 cookie, 返回响应对象
    resp = await client.get<string>('/', {
      headers: {
        cookie: cookieValue,
      },
    });

    // 确认返回正确响应
    expect(resp.status).toEqual(200);
    expect(resp.headers['content-type']).toEqual('text/html; charset=utf-8');

    // 读取返回的 HTML 内容
    const $ = cheerio.load(resp.data);
    expect($('body .container>h1').text()).toEqual('Error: User not login!!');
  });
});
