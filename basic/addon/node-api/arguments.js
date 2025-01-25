/**
 * CommonJS 代码 - arguments.cjs
 *
 * ```js
 * const addon = require('bindings')('arguments');
 *
 * const { argumentsFunc } = addon;
 * module.exports = { argumentsFunc };
 * ```
 */

// 从 `bindings` 模块导入插件对象
import addon from 'bindings';

// 从名为 `arguments.node` 的 C++ 动态库中导入名为 `argumentsFunc` 函数
// 其中的 `arguments.node` 为 `binding.gyp` 文件中定义的编译目标文件名
export const { argumentsFunc } = addon('arguments');
