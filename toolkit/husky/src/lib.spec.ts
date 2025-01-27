import { hello } from './lib';

/**
 * 测试 `lib` 模块
 */
describe("test 'lib' module", () => {
  /**
   * 测试 `hello` 函数是否返回字符串结果
   */
  it("should 'hello' function return string", () => {
    expect(hello()).toEqual('Hello Husky!');
  });
});