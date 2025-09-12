import dotEnv, { type DotenvConfigOptions, type DotenvParseOutput } from 'dotenv';

import { expand } from 'dotenv-expand';

/**
 * 定义环境变量读取选项
 */
type EnvConfigOptions = DotenvConfigOptions & {
  /**
   * 增加选项， 是否对环境变量内容进行解析处理
   *
   * `dotenv-expand` 模块扩展了 `dotenv` 模块的功能，可以将环境变量内容中的变量进行解析处理, 例如:
   *
   * ```ini
   * HOST=10.1.2.3
   * DB_ADDR=${HOST}:3306
   * ```
   *
   * 对于上面的环境变量定义, `dotenv-expand` 可将 `DB_ADDR` 变量中的 `${HOST}` 部分进行解析处理
   */
  resolve?: boolean
};

/**
 * 从 `.env` 文件 (默认) 中读取环境变量
 *
 * @param options 读取选项
 * @returns 读取结果
 */
export function loadEnvVariables(options?: EnvConfigOptions): DotenvParseOutput {
  // 设置默认选项值
  const {
    path,
    override = true,
    processEnv = {},
    encoding = 'utf-8',
    debug = false,
    resolve = true,
  } = options ?? {};

  // 读取环境变量
  const result = dotEnv.config({
    path,
    override,
    processEnv,
    encoding,
    debug,
  });

  // 如果需要解析环境变量, 则调用 'dotenv-expand' 模块进行处理
  if (resolve) {
    // 对环境变量进行解析处理
    expand(result);
  }

  if (result.error) {
    throw result.error;
  }

  // 返回读取到的环境变量
  return result.parsed ?? {};
}
