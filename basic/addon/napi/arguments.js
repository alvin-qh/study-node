/**
 * ```cjs
 * const addon = require('bindings')('arguments');
 *
 * const { argumentsFunc } = addon;
 * module.exports = { argumentsFunc };
 * ```
 */

// 从 `bindings` 模块导入插件对象
import addon from 'bindings';

// 从插件对象中导入名为 `arguments` 的模块内
// 导出模块的定义位于 `binding.gyp` 文件中 `target_name` 为 `arguments` 的项目, 指向 `arguments.c` 文件
// 从 `arguments.c` 文件中导出名为 `argumentsFunc` 的函数
export const { argumentsFunc } = addon('arguments');
