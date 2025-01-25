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

// 从名为 `addon_cmake_js.node` 的 C++ 动态库中导入名为 `Demo` 的类
// 其中的 `addon_cmake_js.node` 为 `CMakeLists.txt` 文件中定义的编译目标文件名
export const { Demo } = addon('addon_cmake_js');
