/// 通过 C++ 导出 Node 函数
///
/// 下面 C++ 代码描述了如下 Node 代码
///
/// ```js
/// export function simpleFunc() { return ‘Hello World’; }
/// ```
#include <assert.h>
#include <string.h>

#include "common.h"

/**
 * @brief 定义回调函数, 用于返回一个 Node 类型对象
 *
 * @param env Node 环境上下文
 * @param info 用于获取回调函数
 * @return Node 字符串对象
 */
napi_value simple_callback_function(napi_env env, napi_callback_info /* info */) {
  // 定义要返回的 C++ 变量值
  const char* text = "Hello World";

  // 声明要返回的 Node 对象值
  napi_value val;

  // 通过 NAPI 将 C++ 变量值转换为 Node 字符串对象值, 并确认转换正确
  napi_status status = napi_create_string_utf8(env, text, strlen(text), &val);
  assert(status == napi_ok);

  // 返回 Node 字符串对象值
  return val;
}

/**
 * @brief 初始化 C++ 下的 Node 模块
 *
 * @param env Node 环境上下文
 * @param exports Node 模块导出对象
 * @return Node 模块导出对象
 */
napi_value init(napi_env env, napi_value exports) {
  // 实例化声明用结构体实例数组, 每个注册函数为其中一项
  napi_property_descriptor desc[] = {
    DECLARE_NAPI_METHOD("simpleFunc", simple_callback_function)
  };

  // 将声明结构体实例注册为 Node 函数, 并确认注册成功
  napi_status status = napi_define_properties(env, exports, 1, desc);
  assert(status == napi_ok);

  // 返回注册结果
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NAPI_MODULE(NODE_GYP_MODULE_NAME, init);
