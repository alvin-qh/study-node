/// 通过 C++ 导出 Node 函数
///
/// 下面 C++ 代码描述了如下 Node 代码
///
/// ```js
/// export function callbackFunc(func) {
///   return func(‘Hello World’);
/// }
/// ```
#include <napi.h>

/**
 * @brief 定义 C++ 函数, 从上下文获取一个 Node 函数, 调用此函数, 并获取返回值
 *
 * 通过 `Napi::CallbackInfo` 对象可以获取到当前 C++ 函数调的用信息
 * - 通过 `Env` 方法可以获取 Node 环境上下文对象;
 * - 通过 `Length` 方法可以获取到参数个数;
 * - 通过 `[N]` 下标可以获取到指定位置的参数对象, 为 `Napi::Value` 类型;
 *   - 通过 `IsFunction` 方法可以判断 Node 对象的类型是否为函数对象;
 *   - 通过 Node 对象的 `As<Napi::Function>` 方法可以转换具体的 Node 函数类型对象;
 *   - 通过 `Napi::Function` 对象的 `Call` 方法可以调用 Node 函数对象, 通过 `std::initializer_list` 传入参数,
 *     并返回 `Napi::Value` 类型返回值
 *
 * @param info 回调上下文信息对象
 * @return 返回 Node 回调函数返回的值
 */
Napi::Value callback(const Napi::CallbackInfo& info) {
  // 获取 Node 环境上下文对象
  Napi::Env env = info.Env();

  // 判断函数参数个数是否为 1
  if (info.Length() < 1) {
    Napi::TypeError::New(env, "wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // 判断第一个参数类型是否为 Node 函数类型
  if (!info[0].IsFunction()) {
    Napi::TypeError::New(env, "wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // 将第一个参数转为 Node 函数对象类型
  Napi::Function fn = info[0].As<Napi::Function>();

  // 调用 Node 函数对象, 并传入字符串作为参数
  Napi::Value result = fn.Call(env.Global(), {
    Napi::String::New(env, "Hello Node Addon API")
  });

  // 当前函数返回回调函数返回结果值
  return result;
}

/**
 * @brief 初始化 C++ 下的 Node 模块
 *
 * 可以将 `arguments_func` 函数作为一个 Node 属性方式通过 `exports.Set` 函数注册后导出
 *
 * @param env Node Node 环境上下文
 * @param exports Node 模块导出对象
 * @return Node 模块导出对象
 */
Napi::Object init(Napi::Env env, Napi::Object exports) {
  // 创建一个 Node 函数对象
  exports.Set(Napi::String::New(env, "callbackFunc"), Napi::Function::New(env, callback));

  // 返回注册结果
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NODE_API_MODULE(callbackFunc, init);
