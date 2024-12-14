import { describe, expect, it } from 'bun:test';
import { main } from '.';

/**
 * 测试 `./index` 模块
 */
describe("test 'index' module", () => {
  /**
   * 测试导出的 `main` 函数
   */
  it("test 'main' function", async () => {
    const srcLog = console.log;

    try {
      let content = '';
      console.log = (c: string) => { content = c; };

      await main();
      expect(content).toEqual('Hell Bun: repo lib version is: bun-lib@1.0.0, workspace lib version is: bun-app-lib@1.0.0');
    } finally {
      console.log = srcLog;
    }
  });
});
