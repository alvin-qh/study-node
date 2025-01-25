/**
 * CommonJS 代码 - builder.cjs
 *
 * ```js
 * const addon = require('bindings')('builder');
 *
 * const { createUserObject } = addon;
 * module.exports = { createUserObject };
 * ```
 */

// 从 `bindings` 模块导入插件对象
import addon from 'bindings';

// 从名为 `builder.node` 的 C 动态库中导入名为 `createUserObject` 的函数
// 其中的 `builder.node` 为 `binding.gyp` 文件中定义的编译目标文件名
export const { createUserObject } = addon('builder');
