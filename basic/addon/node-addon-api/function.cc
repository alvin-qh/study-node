/// 通过 C++ 导出函数, 该函数可以返回一个 C 语言描述的 Node 函数
///
/// 下面 C++ 代码描述了如下 Node 代码
///
/// ```js
/// export function createFunction() {
///   return () => 'Hello Node Addon API';
/// }
/// ```
#include <napi.h>

/**
 * @brief 定义 C++ 函数, 返回一个 Node 字符串对象
 *
 * 通过 `Napi::String::New` 函数可以创建一个 Node 字符串对象, 并作为函数返回值
 *
 * @param info 回调上下文信息对象
 * @return Node 字符串对象
 */
Napi::Value hello_function(const Napi::CallbackInfo& info) {
  // 获取 Node 环境上下文对象
  Napi::Env env = info.Env();

  return Napi::String::New(env, "Hello Node Addon API");
}

/**
 * @brief 定义 C++ 函数, 该函数返回一个 Node 函数对象
 *
 * 通过 `Napi::Function::New` 函数可以创建一个 Node 函数对象, 并返回
 *
 * @param info 回调上下文信息对象
 * @return Node 函数对象
 */
Napi::Function create_function(const Napi::CallbackInfo& info) {
  // 获取 Node 环境上下文对象
  Napi::Env env = info.Env();

  return Napi::Function::New(env, hello_function);
}

/**
 * @brief 初始化 C++ 下的 Node 模块
 *
 * 可以将 `create_function` 函数作为一个 Node 属性, 并通过 `exports.Set` 方法注册后导出
 *
 * @param env Node Node 环境上下文
 * @param exports Node 模块导出对象
 * @return Node 模块导出对象
 */
Napi::Object init(Napi::Env env, Napi::Object exports) {
  // 创建一个 Node 函数对象
  exports.Set(Napi::String::New(env, "createFunction"), Napi::Function::New(env, create_function));

  // 返回注册结果
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NODE_API_MODULE(createFunction, init);
