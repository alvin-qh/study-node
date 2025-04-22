const { expect } = require('@jest/globals');

const { add } = require('./misc');

/**
 * 测试 module 下面的 misc 模块
 */
describe("test 'lib.misc' module", () => {
  /**
   * 测试 misc 模块下的 add 函数
   */
  it("should 'add' function worked", () => {
    expect(add(10, 20)).toEqual(30);
  });
});
