/// 通过 C 导出函数, 该函数可以返回一个 C 语言描述的 Node 函数
///
/// 下面 C 代码描述了如下 Node 代码
///
/// ```js
/// export function createFunction() {
///   return () => 'Hello NAPI';
/// }
/// ```
#include <assert.h>

#include "common.h"

/**
 * @brief 定义 C 函数, 从上下文获取一个 Node 函数, 调用此函数, 并获取返回值
 *
 * 通过 `napi_get_cb_info` 函数可以获取到 Node 中调用此函数所传入的参数:
 *
 * @param env Node 环境上下文
 * @param info 用于获取回调函数
 * @return 返回 Node 回调函数返回的值
 */
napi_value hello_function(napi_env env, napi_callback_info info) {
  napi_value str;

  // 创建 Node 字符串对象
  napi_status status = napi_create_string_utf8(env, "Hello NAPI", NAPI_AUTO_LENGTH, &str);
  assert(status == napi_ok);

  // 返回 Node 字符串对象
  return str;
}

/**
 * @brief 定义 C 函数, 该函数返回一个 Node 函数对象
 *
 * 通过 `napi_create_function` 函数可以创建一个 Node 函数对象
 *
 * @param env Node 环境上下文
 * @param info 用于获取回调函数
 * @return 返回 Node 函数对象
 */
napi_value create_function(napi_env env, napi_callback_info info) {
  napi_value fn;

  // 基于 `hello_function` C 函数创建一个 Node 函数, 函数命名为 `helloFunction`
  napi_status status = napi_create_function(env, NULL, 0, hello_function, NULL, &fn);
  assert(status == napi_ok);

  // 返回函数对象
  return fn;
}

/**
 * @brief 初始化 C 下的 Node 模块
 *
 * 可以将 `create_function` 函数作为一个 Node 属性方式通过 `napi_define_properties` 函数注册后导出
 *
 * @param env Node 环境上下文
 * @param exports Node 模块导出对象
 * @return Node 模块导出对象
 */
napi_value init(napi_env env, napi_value exports) {
  // 实例化声明用结构体实例数组, 每个注册函数为其中一项
  napi_property_descriptor desc[] = {
    DECLARE_NAPI_METHOD("createFunction", create_function)
  };

  // 将声明结构体实例注册为 Node 函数, 并确认注册成功
  napi_status status = napi_define_properties(env, exports, 1, desc);
  assert(status == napi_ok);

  // 返回到导出对象
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NAPI_MODULE(NODE_GYP_MODULE_NAME, init);
