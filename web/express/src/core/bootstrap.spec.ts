import { describe, it, expect } from 'bun:test';

import * as cheerio from 'cheerio';
import supertest from 'supertest';

import app from '../bin/www';

const request = supertest(app);

/**
 * 测试启动模块
 */
describe('test `bootstrap` module', () => {
  /**
   * 测试获取主页 HTML
   */
  it('should `GET /` returned index page', async () => {
    const resp = await request.get('/');
    expect(resp.status).toEqual(200);

    const html = resp.text;
    expect(html).not.toBeEmpty();

    const $ = cheerio.load(html);
    expect($('body div.container>h1').text()).toEqual('Hello');
  });
});
