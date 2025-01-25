/**
 * ```variable.cjs
 * const addon = require('bindings')('callback');
 *
 * const { callbackFunc } = addon;
 * module.exports = { callbackFunc };
 * ```
 */

// 从 `bindings` 模块导入插件对象
import addon from 'bindings';

// 从插件对象中导入名为 `callback` 的模块内
// 导出模块的定义位于 `binding.gyp` 文件中 `target_name` 为 `callback` 的项目, 指向 `callback.cc` 文件
// 从 `callback.cc` 文件中导出名为 `callbackFunc` 的函数
export const { callbackFunc } = addon('callback');
