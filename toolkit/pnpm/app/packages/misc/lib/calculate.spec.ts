import { expect } from 'chai';

import { sub } from './calculate';

/**
 * 测试工作空间的模块
 */
describe('test `pnpm-app-misc` workspace module', () => {
  /**
   * 测试导出函数是否正常工作
   */
  it('should `sub` function worked', () => {
    const r = sub(1, 2);
    expect(r).to.eq(-1);
  });
});
