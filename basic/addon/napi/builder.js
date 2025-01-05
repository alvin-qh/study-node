/**
 * ```cjs
 * const addon = require('bindings')('builder');
 *
 * const { createUserObject } = addon;
 * module.exports = { createUserObject };
 * ```
 */

// 从 `bindings` 模块导入插件对象
import addon from 'bindings';

// 从插件对象中导入名为 `builder` 的模块内
// 导出模块的定义位于 `binding.gyp` 文件中 `target_name` 为 `builder` 的项目, 指向 `builder.cc` 文件
// 从 `builder.cc` 文件中导出名为 `createUserObject` 的函数
export const { createUserObject } = addon('builder');
