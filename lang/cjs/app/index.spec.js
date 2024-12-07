const { expect } = require('chai');

const { add } = require('cjs-lib');

/**
 * 测试从 `cjs-lib` 中导入模块
 */
describe('test `cjs-lib`', () => {
  /**
   * 测试导入模块中的 `add` 函数工作正常
   */
  it('should `add` function work', () => {
    const r = add(100, 200);
    expect(r).to.equal(300);
  });
});
