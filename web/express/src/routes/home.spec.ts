import { app } from '@/bin/www';

import * as cheerio from 'cheerio';

import supertest from 'supertest';

/**
 * 测试启动模块
 */
describe("test 'bootstrap' module", () => {
  /**
   * 测试获取主页 HTML
   */
  it("should 'GET /' returned index page", (done) => {
    const request = supertest(app);

    request.get('/')
      .expect(200)
      .expect('Content-Type', /^text\/html/)
      .end((err, resp) => {
        const $ = cheerio.load(resp.text);
        expect($('body div.container>h1').text()).toEqual('Hello Express');

        done(err);
      });
  });
});
