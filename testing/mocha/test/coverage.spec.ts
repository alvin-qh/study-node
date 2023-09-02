import should from "should";

import { tryCoverage } from "@root";

/**
 * 演示生成测试覆盖率
 */
describe("Test coverage report generating", () => {
  /**
   * 通过对 `app.tryCoverage` 函数的测试, 对测试覆盖率进行计算
   */
  it("should `app.tryCoverage` report can generate success", () => {
    should(tryCoverage(10, 20)).is.equal(30);
  });
});
