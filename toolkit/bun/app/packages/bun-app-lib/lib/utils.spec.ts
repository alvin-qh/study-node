import { describe, expect, it } from 'bun:test';

import { version } from './utils';

/**
 * 测试从工作空间导出
 */
describe("test 'lib.utils' module", () => {
  /**
   * 测试导出的函数是否正常工作
   */
  it("should 'version' function worked", async () => {
    const ver = await version();
    expect(ver).toBe('@toolkit/bun-app-lib@1.0.0');
  });
});
