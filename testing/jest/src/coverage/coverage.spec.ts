import { tryCoverage } from '@/coverage/coverage';

/**
 * 演示生成测试覆盖率
 */
describe("test 'converge.coverage' module", () => {
  /**
   * 通过对 `tryCoverage` 函数的测试, 对测试覆盖率进行计算
   */
  it("should 'tryCoverage' function worked", () => {
    expect(tryCoverage(1, 2)).toBe(3);
  });
});
