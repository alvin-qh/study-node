/// 通过 C++ 导出带参数的 Node 函数
///
/// 下面 C++ 代码描述了如下 Node 代码
///
/// ```js
/// export function argumentsFunc(num1, num2) {
///   return num1 + num2;
/// }
/// ```
#include <napi.h>

/**
 * @brief 定义函数, 从上下文中获取两个参数值, 然后返回两个值差的 Node 类型
 *
 * 通过 `Napi::CallbackInfo` 对象可以获取到当前 C++ 函数调的用信息
 * - 通过 `Env` 方法可以获取 Node 环境上下文对象;
 * - 通过 `Length` 方法可以获取到参数个数;
 * - 通过 `[N]` 下标可以获取到指定位置的参数对象, 为 `Napi::Value` 类型;
 *   - 通过 `Is<...>` 方法可以判断 Node 对象的类型, 如 `Is<Napi::Number>`;
 *   - 通过 Node 对象的 `As<...>` 方法可以转换具体的 Node 类型对象, 如 `As<Napi::Number>`;
 *   - 通过 `Napi::Number` 对象的 `DoubleValue` 方法可以将 Node 数值对象转为 C++ `double` 值
 *
 * @param info 回调上下文信息对象
 * @return Node 对象
 */
Napi::Value arguments_func(const Napi::CallbackInfo& info) {
  // 获取环境上下文对象
  Napi::Env env = info.Env();

  // 判断参数个数是否为 2
  if (info.Length() < 2) {
    Napi::TypeError::New(env, "wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // 判断两个参数类型是否为数值类型
  if (!info[0].IsNumber() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // 从 Node 数值类型对象转换为 C++ `double` 对象
  double num1 = info[0].As<Napi::Number>().DoubleValue();
  double num2 = info[1].As<Napi::Number>().DoubleValue();

  // 创建 Node 数值对象, 结果为两个 C++ 变量之差
  Napi::Number result = Napi::Number::New(env, num1 - num2);

  // 返回结果
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
  // 在导出对象中设置名为 `argumentsFunc` 的属性, 属性值为函数
  exports.Set(Napi::String::New(env, "argumentsFunc"), Napi::Function::New(env, arguments_func));

  // 返回注册结果
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NODE_API_MODULE(argumentsFunc, init);
