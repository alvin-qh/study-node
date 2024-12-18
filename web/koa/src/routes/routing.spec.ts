import { describe, expect, it } from 'bun:test';

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
  it("should 'GET' '/routing/question' returned question answer", async () => {
    const args = qs.stringify({ question: 'Hello Express' });

    const resp = await request.get(`/routing/question?${args}`);
    expect(resp.body.answer).toMatch(/Hello Express is a (good|bad) question/);
  });
});
