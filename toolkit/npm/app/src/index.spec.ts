import { expect } from 'chai';

import { add } from 'npm-lib';
import { sub } from 'npm-app-misc';

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

/**
 * 测试导入 `ts-app-misc` 工作空间模块
 */
describe('test `ts-app-misc` workspace module', () => {
  /**
   * 测试导入模块的 `sub` 函数正常工作
   */
  it('test `sub` function worked', () => {
    const r = sub(2, 1);
    expect(r).to.eq(1);
  });
});
