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

    loadEnvVariables();
  });

  /**
   * 测试从 `.env` 文件中读取环境变量
   */
  it("should load variables from '.env' file", () => {
    // 确认所需环境变量已经存入 `process.env` 对象
    expect(process.env['APP_USER']).toEqual('dev-user');
    expect(process.env['APP_VARIABLE']).toEqual('Develop dotenv by dev-user');
  });
});
