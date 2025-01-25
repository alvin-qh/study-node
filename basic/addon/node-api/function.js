/**
 * CommonJS 代码 - function.cjs
 *
 * ```js
 * const addon = require('bindings')('function');
 *
 * const { createFunction } = addon;
 * module.exports = { createFunction };
 * ```
 */

// 从 `bindings` 模块导入插件对象
import addon from 'bindings';

// 从名为 `function.node` 的 C++ 动态库中导入名为 `createFunction` 的函数
// 其中的 `function.node` 为 `binding.gyp` 文件中定义的编译目标文件名
export const { createFunction } = addon('function');
