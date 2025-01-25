/**
 * 从 `node_cmake.node` 文件中导出 `Demo` 类
 *
 * 通过 `cmake-js` 编译后, 默认情况下会编译为 `./build/Release` 路径下的 `.node` 文件,
 * 且需要通过 Node 的 `require` 函数进行导入
 *
 * 当前文件为 `.cjs` 文件, 即 `CommonJS` 模式, 方可使用 `require` 函数;
 */

// 从 `.node` 动态库导入 `Demo` 类型
const { Demo } = require('./build/Release/addon_cmake_js.node');

// 导出 `Demo` 类型
module.exports = { Demo };
