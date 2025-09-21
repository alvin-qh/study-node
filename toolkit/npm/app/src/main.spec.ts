import { main } from './main';
/**
 * 测试导入 `./main` 模块
 */
describe("test 'main' module", () => {
  /**
   * 测试导入模块的 `main` 函数正常工作
   */
  it("test 'main' function worked", async () => {
    const srcLog = console.log;

    try {
      let log = '';
      console.log = (msg: string) => {
        log = msg;
      };

      await main();

      expect(log).toEqual('Hello NPM!, repo lib version is: @toolkit/npm-lib@1.0.0, workspace lib version is: @toolkit/npm-app-lib@1.0.0');
    } finally {
      console.log = srcLog;
    }
  });
});
