import { version } from './utils';

/**
 * 测试 `lib.utils` 模块
 */
describe("test 'lib.utils' module", () => {
  /**
   * 测试 `version` 函数
   */
  it('should `version` function worked', async () => {
    const ver = await version();
    expect(ver).toEqual('@toolkit/yarn-lib@1.0.0');
  });
});
