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
    let logContent: string = '';

    const srcConsoleLog = console.log;

    console.log = (s) => {
      logContent = s;
    };

    try {
      main();
    }
    finally {
      console.log = srcConsoleLog;
    }

    expect(logContent).toEqual('Hello ESLint!!');
  });
});
