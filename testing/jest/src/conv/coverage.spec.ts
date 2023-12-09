import { tryCoverage } from '@/conv';

/**
 * 演示生成测试覆盖率
 */
describe('Test coverage report generating', () => {
  /**
   * 通过对 `app.tryCoverage` 函数的测试, 对测试覆盖率进行计算
   */
  it('should `tryCoverage` report can generate success', () => {
    expect(tryCoverage(1, 2)).toBe(3);
  });
});
