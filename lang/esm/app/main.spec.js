import { expect } from '@jest/globals';

import { main } from './main.js';

/**
 * 测试 `main` 模块
 */
describe("test 'main' module", () => {
  /**
   * 测试导入模块中的 `add` 函数工作正常
   */
  it("should 'main' function worked", () => {
    const srcLog = console.log;

    try {
      let log = '';
      console.log = (c) => {
        log = c;
      };

      main();
      expect(log).toEqual('Hello ESM, call add(2, 3) is: 5');
    }
    finally {
      console.log = srcLog;
    }
  });
});
