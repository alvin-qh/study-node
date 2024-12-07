import { expect } from 'chai';

import { add } from 'esm-lib';

/**
 * 测试导入 `esm-lib` 模块
 */
describe('test `es-module-lib`', () => {
  /**
   * 测试导入模块中的 `add` 函数工作正常
   */
  it('should `add` function imported', () => {
    expect(add(1, 2)).to.equal(3);
  });
});
