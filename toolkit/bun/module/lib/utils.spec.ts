import { describe, expect, it } from 'bun:test';

import { version } from './utils';

/**
 * 测试模块导入
 */
describe("test 'utils' module", () => {
  /**
   * 测试导入模块的函数
   */
  it("should 'version' function worked", async () => {
    const ver = await version();
    expect(ver).toEqual('bun-lib@1.0.0');
  });
});
