import { main } from './index';
/**
 * 测试 `index` 模块
 */
describe("test 'index' module", () => {
  /**
   * 测试 `main` 函数
   */
  it("test 'main' function worked", async () => {
    const srcLog = console.log;

    try {
      let log = '';
      console.log = (msg: string) => {
        log = msg;
      };

      await main();

      expect(log).toEqual('Hello PNPM!, repo lib version is: @toolkit/pnpm-lib@1.0.0, workspace lib version is: @toolkit/pnpm-app-lib@1.0.0');
    } finally {
      console.log = srcLog;
    }
  });
});
