import { expect } from 'chai';

import { version } from './utils';

/**
 * 测试 `utils` 模块导出
 */
describe('test `utils` module', () => {
  /**
   * 测试 `utils` 模块下的 `version` 函数
   */
  it('should `version` function worked', async () => {
    const ver = await version();
    expect(ver).to.eq('babel-lib@1.0.0');
  });
});
