import * as path from 'node:path';

import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

/**
 * 测试 `loader` 模块
 */
describe("test 'dotenv' module", () => {
  /**
   * 每次测试前执行, 删除内存中已加载的环境变量
   */
  beforeEach(() => {
    delete process.env.APP_USER;
    delete process.env.APP_VARIABLE;
  });

  /**
   * 测试从 `.env` 文件中读取环境变量
   */
  it("should load '.env' file", () => {
    dotenv.config();

    expect(process.env['APP_USER']).toEqual('dev-user');
    expect(process.env['APP_VARIABLE']).toEqual('Develop dotenv by ${APP_USER}');
  });

  /**
   * 测试解析环境变量
   */
  it("should 'expand' environment variables", () => {
    const output = expand(dotenv.config());

    expect(output.parsed).toEqual({
      APP_USER: 'dev-user',
      APP_VARIABLE: 'Develop dotenv by dev-user',
    });

    expect(output.error).toBeUndefined();

    expect(process.env['APP_USER']).toEqual('dev-user');
    expect(process.env['APP_VARIABLE']).toEqual('Develop dotenv by dev-user');
  });

  /**
   * 测试从 `.env.vault` 文件中读取环境变量
   */
  it("should load '.env.enc' file", () => {
    dotenv.config({
      path: path.resolve(process.cwd(), '.env.enc'),
      DOTENV_KEY: '163c56d7e3fc33bb62c56c2bef0d3206c5293ba6b23214d53ce7c7931f7ec783',
    });

    expect(process.env['APP_USER']).toEqual('dev-user');
    expect(process.env['APP_VARIABLE']).toEqual('Develop dotenv by ${APP_USER}');
  });
});
