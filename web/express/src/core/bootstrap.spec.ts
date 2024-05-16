import { expect } from 'chai';
import * as cheerio from 'cheerio';
import supertest from 'supertest';

import app from '../bin/www';

const request = supertest(app);

/**
 * 测试启动模块
 */
describe('Test `bootstrap` module', () => {
  /**
   * 测试获取主页 HTML
   */
  it('`GET /` should returned index page', async () => {
    const resp = await request.get('/');
    expect(resp.status).is.eq(200);

    const html = resp.text;
    expect(html).is.not.empty;

    const $ = cheerio.load(html);
    expect($('body div.container>h1').text()).is.eq('Hello');
  });
});
