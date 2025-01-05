/// 通过 C++ 导出 Node 函数
///
/// 下面 C++ 代码描述了如下 Node 代码
///
/// ```js
/// export function callbackFunc(func) {
///   return func(‘Hello World’);
/// }
/// ```
#include <assert.h>

#include "common.h"

/**
 * @brief 定义 C++ 函数, 从上下文获取一个 Node 函数, 调用此函数, 并获取返回值
 *
 * 通过 `napi_get_cb_info` 函数可以获取到 Node 中调用此函数所传入的参数:
 * - 通过 `napi_typeof` 函数可以获取指定 Node 对象的类型, 如果参数是函数类型, 则应为 `napi_function` 枚举值;
 * - 通过 `napi_call_function` 函数可以调用一个 Node 函数, 并传递参数, 获取返回值 (皆为 Node 对象);
 *
 * @param env Node 环境上下文
 * @param info 用于获取回调函数
 * @return 返回 Node 回调函数返回的值
 */
napi_value callback(napi_env env, napi_callback_info info) {
  // 定义参数个数
  size_t argc = 1;

  // 定义保存参数值的数组
  napi_value args[1];

  // 从上下文中获取到指定个数的参数值
  // 通过 `argc` 变量的指针指定参数的个数, 通过 `args` 数组指针返回获取的参数值
  napi_status status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);
  assert(status == napi_ok);

  // 判断是否获取到指定数量的参数值
  if (argc < 1) {
    napi_throw_type_error(env, NULL, "wrong number of arguments");
    return NULL;
  }

  // 获取第一个参数, 即为传入的回调函数
  napi_value cb = args[0];

  // 指定变量用于获取对应参数的类型
  napi_valuetype type;

  // 获取第一个参数类型
  status = napi_typeof(env, cb, &type);
  assert(status == napi_ok);

  // 确认参数类型是否为指定类型
  if (type != napi_function) {
    napi_throw_type_error(env, NULL, "wrong arguments");
    return NULL;
  }

  // 定义要传递给回调函数的参数列表, 包含一个参数
  // 将参数 1 创建为 Node 字符串对象类型
  napi_value argv[1];
  status = napi_create_string_utf8(env, "Hello World", NAPI_AUTO_LENGTH, argv);
  assert(status == napi_ok);

  // 获取 Node 环境的 `global` 变量
  napi_value global;
  status = napi_get_global(env, &global);
  assert(status == napi_ok);

  // 调用回调函数, 传递回调函数参数列表, 返回调用结果
  napi_value result;
  status = napi_call_function(env, global, cb, 1, argv, &result);
  assert(status == napi_ok);

  // 当前函数返回回调函数返回结果值
  return result;
}

/**
 * @brief 初始化 C++ 下的 Node 模块
 *
 * 可以通过 `napi_create_function` 将一个 C++ 函数包装为 Node 函数, 并通过 `napi_set_named_property` 为其注册导出名称并导出
 *
 * 如果不使用 `napi_set_named_property` 注册函数导出名称, 则该函数将作为当前模块的默认导出函数
 *
 * @param env Node 环境上下文
 * @param exports Node 模块导出对象
 * @return Node 模块导出对象
 */
napi_value init(napi_env env, napi_value exports) {
  napi_value func;

  // 基于 `callback` C++ 函数创建一个 Node 函数, 该函数匿名
  // 返回的 `func` 参数即表示 `callback` 函数包装为 Node 函数的结果
  // 如果当前函数直接返回 `func` 值 (`return func`), 则表示当前模块默认导出了该函数 (`export default ...`)
  napi_status status = napi_create_function(env, NULL, 0, callback, NULL, &func);
  assert(status == napi_ok);

  // 将创建的 Node 函数进行注册并导出
  // 通过 `napi_set_named_property` 函数, 为 `exports` 对象设置名为 `callbackFunc` 的属性, 属性值为要导出的函数
  status = napi_set_named_property(env, exports, "callbackFunc", func);
  assert(status == napi_ok);

  return exports;
}

/**
 * @brief 初始化 C++ 下的 Node 模块
 *
 * 可以将 `callback` 函数作为一个 Node 属性方式通过 `napi_define_properties` 函数注册后导出
 *
 * @param env Node 环境上下文
 * @param exports Node 模块导出对象
 * @return Node 模块导出对象
 */
// napi_value init(napi_env env, napi_value exports) {
//   // 实例化声明用结构体实例数组, 每个注册函数为其中一项
//   napi_property_descriptor desc[] = {
//     DECLARE_NAPI_METHOD("callbackFunc", callback)
//   };
//
//   // 将声明结构体实例注册为 Node 函数, 并确认注册成功
//   napi_status status = napi_define_properties(env, exports, 1, desc);
//   assert(status == napi_ok);
//
//   // 返回注册结果
//   return exports;
// }

// 定义一个 Node 模块并声明导出的函数
NAPI_MODULE(NODE_GYP_MODULE_NAME, init);
