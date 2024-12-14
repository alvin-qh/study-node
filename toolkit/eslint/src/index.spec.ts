import { expect } from '@jest/globals';

import { main } from './index';

/**
 * 测试 `index` 模块
 */
describe("test 'index' module", () => {
  /**
   * 测试 `main` 函数
   */
  it("should 'main' function worked", () => {
    const srcLog = console.log;

    try {
      let log: string = '';
      console.log = (s) => {
        log = s;
      };

      main();
      expect(log).toEqual('Hello ESLint!!');
    }
    finally {
      console.log = srcLog;
    }
  });
});
