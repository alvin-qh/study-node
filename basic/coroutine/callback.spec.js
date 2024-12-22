import { expect } from 'chai';

import { wait } from './waiting.js';

/**
 * 测试通过回调函数进行异步调用
 */
describe("test 'callback' function", () => {
  /**
   * 定义异步调用函数
   *
   * @param {(...any) => void} callback 回调函数
   * @param {any | [...any]} args 回调函数参数
   * @param {number} timeout 超时时间
   */
  function after(callback, args, timeout = 50) {
    args = Array.isArray(args) ? args : [args];
    setTimeout(() => callback(...args), timeout);
  }

  /**
   * 回调方式进行异步调用
   */
  it("should call 'callback' function", done => {
    // 记录异步回调函数是否被调用
    let visited = false;

    // 异步回调
    after(state => {
      expect(state).to.eq('OK');
      visited = true;
    }, 'OK');

    // 等待调用结束
    wait(() => visited, () => done());
  });
});
