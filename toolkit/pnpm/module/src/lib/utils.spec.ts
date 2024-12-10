import { expect } from 'chai';

import { version } from './utils';

/**
 * 测试 `utils` 模块
 */
describe('test `npm-lib` module', () => {
  /**
   * 测试导出的 `version` 函数工作正常
   */
  it('should `version` function worked', async () => {
    const ver = await version();
    expect(ver).to.eq('pnpm-lib@1.0.0');
  });
});
