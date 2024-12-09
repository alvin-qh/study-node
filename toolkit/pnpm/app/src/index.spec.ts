import { expect } from 'chai';

import { add } from 'pnpm-lib';
import { sub } from 'pnpm-app-misc';

/**
 * 测试导入 `pnpm-lib` 模块
 */
describe('test `npm-lib` module', () => {
  /**
   * 测试导入模块的 `add` 函数正常工作
   */
  it('test `add` function worked', () => {
    const r = add(1, 2);
    expect(r).to.eq(3);
  });
});

/**
 * 测试导入 `pnpm-app-misc` 模块
 */
describe('test `npm-lib-misc` module', () => {
  /**
   * 测试导入模块的 `sub` 函数正常工作
   */
  it('test `sub` function worked', () => {
    const r = sub(1, 2);
    expect(r).to.eq(-1);
  });
});
