import * as cheerio from 'cheerio';
import qs from 'querystring';
import supertest from 'supertest';

import { app } from '../index';

const request = supertest(app.callback());

/**
 * 测试路由模块
 */
describe("test 'routing' module", () => {
  /**
   * 测试 `/routing/question` 返回结果
   */
  it("should 'GET' '/routing' html result", async () => {
    const resp = await request.get('/routing');
    expect(resp.status).toEqual(200);

    const html = resp.text;
    expect(html).not.toBeEmpty();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const $ = cheerio.load(html);
  });

  /**
   * 测试 `/routing/question` 返回结果
   */
  it("should 'GET' '/routing/question' returned question answer", async () => {
    const args = qs.stringify({ question: 'Hello Express' });

    const resp = await request.get(`/routing/question?${args}`);
    expect(resp.body.answer).toMatch(/Hello Express is a (good|bad) question/);
  });
});
