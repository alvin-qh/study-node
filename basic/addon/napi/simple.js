/**
 * CommonJS 代码 - simple.cjs
 *
 * ```js
 * const addon = require('bindings')('simple');
 *
 * const { simpleFunc } = addon;
 * module.exports = { simpleFunc };
 * ```
 */

// 从 `bindings` 模块导入插件对象
import addon from 'bindings';

// 从名为 `simple.node` 的 C++ 动态库中导入名为 `simpleFunc` 的函数
// 其中的 `simple.node` 为 `binding.gyp` 文件中定义的编译目标文件名
export const { simpleFunc } = addon('simple');
