import { expect } from 'chai';

import { add } from './misc.js';

/**
 * 测试 module 下面的 misc 模块
 */
describe("test 'lib.misc' in module", () => {
  /**
   * 测试 misc 模块下的 add 函数
   */
  it("should 'add' function worked", () => {
    expect(add(10, 20)).to.eq(30);
  });
});
