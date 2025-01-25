/**
 * CommonJS 代码 - object.cjs
 *
 * ```js
 * const addon = require('bindings')('object');
 *
 * const { Value } = addon;
 * module.exports = { Value };
 * ```
 */

// 从 `bindings` 模块导入插件对象
import addon from 'bindings';

// 从名为 `object.node` 的 C 动态库中导入名为 `Value` 的类
// 其中的 `object.node` 为 `binding.gyp` 文件中定义的编译目标文件名
export const { Value } = addon('object');
