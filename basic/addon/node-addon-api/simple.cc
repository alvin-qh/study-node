/// 通过 C++ 导出 Node 函数
///
/// 下面 C++ 代码描述了如下 Node 代码
///
/// ```js
/// export function simpleFunc() {
///   return ‘Hello Node Addon API’;
/// }
/// ```
#include <napi.h>

/**
 * @brief 定义 C++ 函数, 用于返回一个 Node 类型字符串对象
 *
 * 通过 `Napi::String::New` 函数可以创建一个 Node 字符串对象, 并作为本函数返回值
 *
 * @param info 回调上下文信息对象
 * @return Node 字符串对象
 */
Napi::String simple_function(const Napi::CallbackInfo& info) {
  // 获取 Node 环境上下文对象
  Napi::Env env = info.Env();

  // 返回 Node 字符串对象值
  return Napi::String::New(env, "Hello Node Addon API");
}

/**
 * @brief 初始化 C++ 下的 Node 模块
 *
 * 可以将 `simple_function` 函数作为一个 Node 属性, 并通过 `exports.Set` 方法注册后导出
 *
 * @param env Node Node 环境上下文
 * @param exports Node 模块导出对象
 * @return Node 模块导出对象
 */
Napi::Object init(Napi::Env env, Napi::Object exports) {
  // 在导出对象中设置名为 `simpleFunc` 的属性, 属性值为函数
  exports.Set(Napi::String::New(env, "simpleFunc"), Napi::Function::New(env, simple_function));

  // 返回导出对象
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NODE_API_MODULE(NODE_GYP_MODULE_NAME, init);
