import * as cheerio from 'cheerio';

import { start } from '@/server';

import { parseCookie } from '@/utils/cookie';

/**
 * 测试通过 `Fetch API` 库获取 `html` 内容
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
      closeFn = undefined;
    };
  });

  const baseUrl = new URL('http://localhost:9000');

  /**
   * 测试通过 `Fetch API` 获取 `html` 内容
   */
  it('should GET html content', async () => {
    // 请求 `/` 地址, 设置 cookie, 返回响应对象
    const resp = await fetch(new URL('/', baseUrl), {
      headers: {
        cookie: 'username=Alvin',
      },
    });

    // 确认返回正确响应
    expect(resp.status).toEqual(200);
    expect(resp.headers.get('Content-Type')).toEqual('text/html; charset=utf-8');

    // 读取返回的 HTML 内容
    const html = await resp.text();
    const $ = cheerio.load(html);
    expect($('body .container>h1').text()).toEqual('Hello Alvin!!');
  });

  /**
   * 测试发送 `POST` 登录请求, 并提交成功
   */
  it("should POST 'login' form successful", async () => {
    const formData = `username=${encodeURIComponent('Alvin')}&password=${encodeURIComponent('123456')}`;

    // 提交表单数据
    let resp = await fetch(new URL('/login', baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      redirect: 'manual',
    });

    // 确认返回正确响应, 服务端登录成功后, 返回 302 重定向到主页
    expect(resp.status).toEqual(302);
    expect(resp.headers.get('Location')).toEqual('/');

    // 从服务器返回的响应头 `Set-Cookie` 项中解析出 cookie
    const cookieValue = resp.headers.get('Set-Cookie')?.split(',');

    // 确认响应携带正确的 cookie
    const cookies = parseCookie(cookieValue)[0];
    expect(cookies.username).toEqual('Alvin');
    expect(cookies.path).toEqual('/');

    // 再次请求 `/` 地址, 设置前一次响应返回的 cookie, 返回响应对象
    resp = await fetch(new URL('/', baseUrl), {
      headers: {
        cookie: 'username=Alvin',
      },
    });

    // 确认返回正确响应
    expect(resp.status).toEqual(200);
    expect(resp.headers.get('Content-Type')).toEqual('text/html; charset=utf-8');

    // 读取返回的 HTML 内容
    const html = await resp.text();
    const $ = cheerio.load(html);
    expect($('body .container>h1').text()).toEqual('Hello Alvin!!');
  });

  /**
   * 测试发送 `POST` 登录请求, 且提交失败
   */
  it("should POST 'login' form failed", async () => {
    const formData = `username=${encodeURIComponent('Alvin')}&password=${encodeURIComponent('1111111')}`;

    // 获取 `/` 地址的 HTML 内容
    const resp = await fetch(new URL('/login', baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      redirect: 'manual',
    });

    expect(resp.status).toEqual(403);

    // 读取返回的 HTML 内容
    const html = await resp.text();
    const $ = cheerio.load(html);
    expect($('body .container>h1').text()).toEqual('Error: Invalid password!!');
  });

  /**
   * 测试发送 `POST` 登出请求, 并提交成功
   */
  it("should POST 'logout' form successful", async () => {
    // 提交表单数据
    let resp = await fetch(new URL('/logout', baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        cookie: 'username=Alvin',
      },
      redirect: 'manual',
    });

    // 确认返回正确响应, 服务端登录成功后, 返回 302 重定向到主页
    expect(resp.status).toEqual(302);
    expect(resp.headers.get('Location')).toEqual('/');

    // 从服务器返回的响应头 `Set-Cookie` 项中解析出 cookie
    const cookieValue = resp.headers.get('Set-Cookie')?.split(',');

    // 确认响应携带正确的 cookie
    const cookies = parseCookie(cookieValue)[0];
    expect(cookies.username).toBeUndefined();
    expect(cookies.path).toEqual('/');

    // 再次请求 `/` 地址, 设置前一次响应返回的 cookie, 返回响应对象
    resp = await fetch(new URL('/', baseUrl), {
      headers: {
        cookie: cookieValue?.join(',') ?? '',
      },
    });

    // 确认返回正确响应
    expect(resp.status).toEqual(401);
    expect(resp.headers.get('Content-Type')).toEqual('text/html; charset=utf-8');

    // 读取返回的 HTML 内容
    const html = await resp.text();
    const $ = cheerio.load(html);
    expect($('body .container>h1').text()).toEqual('Error: User not login!!');
  });
});
