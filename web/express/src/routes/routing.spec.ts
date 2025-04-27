import { app, server } from '@/bin/www';

import supertest from 'supertest';

import qs from 'querystring';

/**
 * 测试路由模块
 */
describe("test 'routing' module", () => {
  afterEach((done) => {
    server.close(done);
  });

  /**
   * 测试 `/routing/question` 返回结果
   */
  it("should 'GET' '/routing/question' returned question answer", (done) => {
    const args = qs.stringify({ question: 'Hello Express' });

    const request = supertest(app);
    request
      .get(`/routing/question?${args}`)
      .expect(200)
      .expect('Content-Type', /^application\/json/)
      .end((err, resp) => {
        expect(resp.body.answer).toMatch(/Hello Express is a (good|bad) question/);
        done(err);
      });
  });
});
