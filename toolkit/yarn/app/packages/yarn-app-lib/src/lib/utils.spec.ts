import { version } from './utils';

/**
 * 测试 Workspace 下的模块
 */
describe('test `utils` module', () => {
  /**
   * 测试模块函数是否正常工作
   */
  it('should `version` function work', async () => {
    const ver = await version();
    expect(ver).toEqual('@toolkit/yarn-app-lib@1.0.0');
  });
});
