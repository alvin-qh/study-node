const { expect } = require('@jest/globals');

const main = require('./main');

/**
 * 测试从 `cjs-lib` 中导入模块
 */
describe("test 'main' module", () => {
  /**
   * 测试 `main` 函数
   */
  it("should 'main' function worked", () => {
    const srcLog = console.log;

    try {
      let log = '';
      console.log = (c) => {
        log = c;
      };

      main();
      expect(log).toEqual('Hello CommonJS, the add(1, 2) is: 3');
    }
    finally {
      console.log = srcLog;
    }
  });
});
