/// 通过 C++ 导出带参数的 Node 函数
///
/// 下面 C++ 代码描述了如下 Node 代码
///
/// ```js
/// export function argumentsFunc(num1, num2) {
///   return num1 + num2;
/// }
/// ```
#include <assert.h>

#include "common.h"

/**
 * @brief 定义回调函数, 从上下文中获取两个参数值, 然后返回两个值和的 Node 类型
 *
 * 通过 `napi_get_cb_info` 函数可以获取到 Node 中调用此函数所传入的参数:
 * - 通过 `napi_typeof` 函数可以获取指定 Node 对象的类型, 如果参数是数值类型, 则应为 `napi_number` 枚举值;
 * - 通过 `napi_get_value_double` 函数可以从数值类型的 Node 对象中获取 `double` 类型的 C 变量值;
 * - 通过 `napi_create_double` 函数可以从 `double` 类型的 C 变量值创建一个 Node 的数值类型对象;
 *
 * @param env Node 环境上下文
 * @param info 用于获取回调函数
 * @return Node 数值对象
 */
napi_value arguments_func(napi_env env, napi_callback_info info) {
  // 定义参数个数
  size_t argc = 2;

  // 定义保存参数值的数组
  napi_value args[2];

  // 从上下文中获取到指定个数的参数值
  // 通过 `argc` 变量的指针指定参数的个数, 通过 `args` 数组指针返回获取的参数值
  napi_status status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);
  assert(status == napi_ok);

  // 判断是否获取到指定数量的参数值
  if (argc < 2) {
    napi_throw_type_error(env, NULL, "wrong number of arguments");
    return NULL;
  }

  // 指定两个变量用于获取对应参数的类型
  napi_valuetype type0, type1;

  // 获取第一个参数类型
  status = napi_typeof(env, args[0], &type0);
  assert(status == napi_ok);

  // 获取第二个参数类型
  status = napi_typeof(env, args[1], &type1);
  assert(status == napi_ok);

  // 确认两个参数类型是否为指定类型
  if (type0 != napi_number || type1 != napi_number) {
    napi_throw_type_error(env, NULL, "wrong arguments");
    return NULL;
  }

  // 定义两个 C++ 变量, 用于将 Node 对象转为 C++ 值
  double value0, value1;

  // 将第一个参数转为 C++ double 值
  status = napi_get_value_double(env, args[0], &value0);
  assert(status == napi_ok);

  // 将第二个参数转为 C++ double 值
  status = napi_get_value_double(env, args[1], &value1);
  assert(status == napi_ok);

  napi_value result;

  // 计算两个 double 值的和, 并将结果转为 Node 数值对象
  status = napi_create_double(env, value0 + value1, &result);
  assert(status == napi_ok);

  // 返回 Node 数值对象
  return result;
}

/**
 * 初始化 C++ 下的 Node 模块
 *
 * 可以将 `create_user_object` 函数作为一个 Node 属性方式通过 `napi_define_properties` 函数注册后导出
 *
 * @param env Node 环境上下文
 * @param exports Node 模块导出对象
 * @return Node 模块导出对象
 */
napi_value init(napi_env env, napi_value exports) {
  // 实例化声明用结构体实例数组, 每个注册函数为其中一项
  napi_property_descriptor desc[] = {
    DECLARE_NAPI_METHOD("argumentsFunc", arguments_func)
  };

  // 将声明结构体实例注册为 Node 函数, 并确认注册成功
  // 将  `desc` 中的内容通过 `napi_define_properties` 函数设置为 `exports` 对象的属性
  napi_status status = napi_define_properties(env, exports, 1, desc);
  assert(status == napi_ok);

  // 返回注册结果
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NAPI_MODULE(NODE_GYP_MODULE_NAME, init);
