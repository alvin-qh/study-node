import { describe, expect, it } from 'bun:test';

import * as cheerio from 'cheerio';
import supertest from 'supertest';

import { app } from '../index';

const request = supertest(app.callback());

/**
 * 测试主页模块
 */
describe("test 'home' module", () => {
  /**
   * 测试获取主页 HTML
   */
  it("should 'GET /' returned index page", async () => {
    const resp = await request.get('/');
    expect(resp.status).toEqual(200);

    const html = resp.text;
    expect(html).not.toBeEmpty();

    const $ = cheerio.load(html);
    expect($('body div.container>h1').text()).toEqual('Hello Koa');
  });
});
