import { expect } from "chai";
import qs from "querystring";
import supertest from "supertest";
import app from "../bin/www";

const request = supertest(app);

/**
 * 测试路由模块
 */
describe("Test `routing` module", () => {
  /**
   * 测试 `/routing/question` 返回结果
   */
  it("`GET /routing/question` should returned question answer", async () => {
    const args = qs.stringify({
      "question": "Hello Express"
    });
    const resp = await request.get(`/routing/question?${args}`);
    expect(resp.body.answer).is.matches(/Hello Express is a (good|bad) question/);
  });
});
