import { expect } from '@jest/globals';

import { EventEmitter } from 'node:events';

import { wait } from './waiting.js';

/**
 * 测试通过事件进行异步调用
 */
describe("test 'event' emit", () => {
  /**
   * 定义异步事件发送
   *
   * @param {EventEmitter} em 事件发射器对象
   * @param {any | [...any]} args 事件参数
   * @param {number} timeout 超时时间
   */
  function after(em, args, timeout = 50) {
    args = Array.isArray(args) ? args : [args];
    setTimeout(() => em.emit('test-event', ...args), timeout);
  }

  /**
   * 以事件作为异步函数的回调
   */
  it("should 'emit' event", (done) => {
    // 定义事件对象
    const em = new EventEmitter();

    // 记录异步事件是否被调用
    let visited = false;

    // 定义 success 事件监听函数
    em.on('test-event', (m) => {
      expect(m).toEqual('OK');
      visited = true;
    });

    // 调用异步函数, 发出 success 事件
    after(em, 'OK');

    // 等待调用结束
    wait(() => visited, () => done());
  });
});
