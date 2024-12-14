import { expect } from '@jest/globals';

import { main } from './index';

/**
 * 测试 `index` 模块
 */
describe("test 'index' module", () => {
  /**
   * 测试 `main` 函数
   */
  it("test 'main' function worked", () => {
    const srcLog = console.log;

    try {
      let log = '';
      console.log = (c) => { log = c; };

      main();
      expect(log).toEqual('Hello typescript, the add(1, 2) is: 3');
    } finally {
      console.log = srcLog;
    }
  });
});
