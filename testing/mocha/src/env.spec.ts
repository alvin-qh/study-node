import { expect } from 'chai';

/**
 * 测试环境变量
 */
describe('test environment variable', () => {
  /**
   * 测试从 `.env` 文件中读取的环境变量
   *
   * mocha 可以通过 `dotenv` 依赖的 `dotenv/config` 插件从指定的 `.env` 文件中读取内容作为环境变量
   * 参考 `.mocharc.json` 配置文件
   */
  it("should read env property which in '.env' file", () => {
    expect(process.env.TEST_CASE).is.eq('100101');
  });
});
