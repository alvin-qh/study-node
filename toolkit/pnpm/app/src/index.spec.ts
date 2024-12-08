import { expect } from 'chai';

import { add } from 'ts-lib';

/**
 * 测试导入 `ts-lib` 模块
 */
describe('test `ts-lib` module', () => {
  /**
   * 测试导入模块的 `add` 函数正常工作
   */
  it('test `add` function worked', () => {
    const r = add(1, 2);
    expect(r).to.eq(3);
  });
});
