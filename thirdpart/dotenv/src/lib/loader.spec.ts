import { loadEnvVariables } from './loader';

/**
 * 测试 `loader` 模块
 */
describe("test 'loader' module", () => {
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
  it("should load variables from '.env' file", () => {
    // 读取 `.env` 文件中的环境变量
    const vars = loadEnvVariables();

    // 确认所需环境变量已经读取
    expect(vars['APP_USER']).toEqual('dev-user');
    expect(vars['APP_VARIABLE']).toEqual('Develop dotenv by dev-user');

    // 确认所需环境变量已经存入 `process.env` 对象
    expect(process.env['APP_USER']).toEqual('dev-user');
    expect(process.env['APP_VARIABLE']).toEqual('Develop dotenv by dev-user');
  });

  /**
   * 测试从指定文件中读取环境变量
   */
  it("should load env variables from '.env.production' file", () => {
    // 读取 `.env.production` 文件中的环境变量
    const vars = loadEnvVariables({ path: '.env.production' });

    // 确认所需环境变量已经读取
    expect(vars['APP_USER']).toEqual('prod-user');
    expect(vars['APP_VARIABLE']).toEqual('Production dotenv by prod-user');

    // 确认所需环境变量已经存入 `process.env` 对象
    expect(process.env['APP_USER']).toEqual('prod-user');
    expect(process.env['APP_VARIABLE']).toEqual('Production dotenv by prod-user');
  });
});
