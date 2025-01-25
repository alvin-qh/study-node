/**
 * CommonJS 代码 - callback.cjs
 *
 * ```js
 * const addon = require('bindings')('callback');
 *
 * const { callbackFunc } = addon;
 * module.exports = { callbackFunc };
 * ```
 */

// 从 `bindings` 模块导入插件对象
import addon from 'bindings';

// 从名为 `callback.node` 的 C 动态库中导入名为 `callbackFunc` 的函数
// 其中的 `callback.node` 为 `binding.gyp` 文件中定义的编译目标文件名
export const { callbackFunc } = addon('callback');
