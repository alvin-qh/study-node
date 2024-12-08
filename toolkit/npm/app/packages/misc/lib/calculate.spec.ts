import { expect } from 'chai';

import { sub } from './calculate';

/**
 * 测试 Workspace 下的模块
 */
describe('test `npm-app-misc` package in workspace', () => {
  /**
   * 测试模块函数是否正常工作
   */
  it('should `sub` function work', () => {
    const r = sub(2, 1);
    expect(r).to.eq(1);
  });
});
