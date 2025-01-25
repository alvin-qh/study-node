/**
 * ```cjs
 * const addon = require('bindings')('function');
 *
 * const { createFunction } = addon;
 * module.exports = { createFunction };
 * ```
 */

// 从 `bindings` 模块导入插件对象
import addon from 'bindings';

// 从插件对象中导入名为 `function` 的模块内
// 导出模块的定义位于 `binding.gyp` 文件中 `target_name` 为 `function` 的项目, 指向 `function.c` 文件
// 从 `function.c` 文件中导出名为 `createFunction` 的函数
export const { createFunction } = addon('function');
