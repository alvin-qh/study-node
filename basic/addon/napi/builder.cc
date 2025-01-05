/// 通过 C++ 导出函数, 该函数返回一个 Node 对象
///
/// 下面 C++ 代码描述了如下 Node 代码
///
/// ```js
/// export function createUserObject(name, age, gender) {
///   return {
///     name,
///     age,
///     gender,
///     toString() {
///       return `name: ${this.name}, age: ${this.age}, gender: ${this.gender}`;
///     }
///   };
/// }
/// ```
#include <assert.h>
#include <stdio.h>

#include "common.h"

/**
 * @brief 定义一个函数, 将注册到 Node 对象的属性, 作为该对象的方法
 *
 * 该方法用于将传入的 `this` 引用的对象格式化为字符串结果返回
 *
 * 通过 `napi_get_cb_info` 函数可以获取到 Node 中调用此函数所传入的参数, 包括 `this` 引用
 *
 * 得到调用方法的 `this` 引用后, 即可通过其获取对象的 `name`, `age` 和 `gender` 属性:
 * - 通过 `napi_get_value_string_utf8` 函数可以获取指定 Node 字符串对象中存储的 C 字符串值;
 * - 通过 `napi_get_value_double` 函数可以获取指定 Node 数值对象中获取 `double` 类型的 C 变量值;
 * - 通过 `napi_create_string_utf8` 函数可以从数值类型的 Node 对象中获取 `double` 类型的 C 变量值;
 *
 * @param env Node 环境上下文
 * @param info 用于获取回调函数
 * @return Node 数值对象
 */
napi_value user_to_string(napi_env env, napi_callback_info info) {
  // 保存 `this` 引用的 Node 变量
  napi_value this_;

  // 获取当前函数被调用上下文中的 `this` 引用
  napi_status status = napi_get_cb_info(env, info, NULL, 0, &this_, NULL);
  assert(status == napi_ok);

  // 定义变量表示 `this` 引用上的三个属性值
  napi_value n_name, n_age, n_gender;

  // 获取 `this` 引用上的三个属性值
  status = napi_get_named_property(env, this_, "name", &n_name);
  assert(status == napi_ok);

  status = napi_get_named_property(env, this_, "age", &n_age);
  assert(status == napi_ok);

  status = napi_get_named_property(env, this_, "gender", &n_gender);
  assert(status == napi_ok);

  char c_name[128];
  size_t c_name_len = 0;

  // 获取 `name` 属性的 C 变量值, 字符串的长度通过 `c_name_len` 变量返回
  status = napi_get_value_string_utf8(env, n_name, c_name, 128, &c_name_len);
  assert(status == napi_ok);

  double c_age = 0;

  // 获取 `age` 属性的 C 变量值
  status = napi_get_value_double(env, n_age, &c_age);
  assert(status == napi_ok);

  char c_gender[16];
  size_t c_gender_len = 0;

  // 获取 `gender` 属性的 C 变量值, 字符串的长度通过 `c_gender_len` 变量返回
  status = napi_get_value_string_utf8(env, n_gender, c_gender, 16, &c_gender_len);
  assert(status == napi_ok && c_gender_len == 1);

  char buf[256] = "";

  // 将 `this` 的属性值格式化为字符串
  size_t len = sprintf(buf, "name: %s, age: %d, gender: %s", c_name, (int) c_age, c_gender);

  napi_value result;

  // 将 `buf` 字符串转为 Node 字符串对象
  status = napi_create_string_utf8(env, buf, len, &result);
  assert(status == napi_ok);

  // 返回格式化后的字符串对象
  return result;
}

/**
 * @brief 定义 C++ 函数, 从上下文获取一个 Node 函数, 调用此函数, 并获取返回值
 *
 * @param env Node 环境上下文
 * @param info 用于获取回调函数
 * @return 返回 Node 回调函数返回的值
 */
napi_value create_user_object(napi_env env, napi_callback_info info) {
  // 定义参数个数
  size_t argc = 3;

  // 定义保存参数值的数组
  napi_value args[3];

  // 从上下文中获取到指定个数的参数值
  // 通过 `argc` 变量的指针指定参数的个数, 通过 `args` 数组指针返回获取的参数值
  napi_status status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);
  assert(status == napi_ok);

  // 判断是否获取到指定数量的参数值
  if (argc < 3) {
    napi_throw_type_error(env, NULL, "wrong number of arguments");
    return NULL;
  }

  // 获取传入的三个参数
  napi_value n_name   = args[0];
  napi_value n_age    = args[1];
  napi_value n_gender = args[2];

  // 指定变量用于获取对应参数的类型
  napi_valuetype t_name, t_age, t_gender;

  // 获取第一个参数类型
  status = napi_typeof(env, n_name, &t_name);
  assert(status == napi_ok);

  // 获取第二个参数类型
  status = napi_typeof(env, n_age, &t_age);
  assert(status == napi_ok);

  // 获取第三个参数类型
  status = napi_typeof(env, n_gender, &t_gender);
  assert(status == napi_ok);

  // 确认参数类型是否为指定类型
  if (t_name != napi_string || t_age != napi_number || t_gender != napi_string) {
    napi_throw_type_error(env, NULL, "wrong arguments");
    return NULL;
  }

  // 定义返回的对象值
  napi_value n_user;

  // 将 `n_user` 变量创建为 Node 对象
  status = napi_create_object(env, &n_user);
  assert(status == napi_ok);

  // 为对象设置 `name` 属性, 属性值为字符串
  status = napi_set_named_property(env, n_user, "name", n_name);
  assert(status == napi_ok);

  // 为对象设置 `age` 属性, 属性值为
  status = napi_set_named_property(env, n_user, "age", n_age);
  assert(status == napi_ok);

  // 为对象设置 `gender` 属性值
  status = napi_set_named_property(env, n_user, "gender", n_gender);
  assert(status == napi_ok);

  napi_value n_func;

  // 通过 `user_to_string` C 函数创建 Node 函数, 保存在 `n_func` 变量中
  status = napi_create_function(env, NULL, 0, user_to_string, NULL, &n_func);
  assert(status == napi_ok);

  // 为对象设置 `toString` 属性, 属性值为 `n_func` 变量保存的函数
  status = napi_set_named_property(env, n_user, "toString", n_func);
  assert(status == napi_ok);

  // 返回整个 Node 对象
  return n_user;
}

/**
 * @brief 初始化 C++ 下的 Node 模块
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
    DECLARE_NAPI_METHOD("createUserObject", create_user_object)
  };

  // 将声明结构体实例注册为 Node 函数, 并确认注册成功
  napi_status status = napi_define_properties(env, exports, 1, desc);
  assert(status == napi_ok);

  // 返回注册结果
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NAPI_MODULE(NODE_GYP_MODULE_NAME, init);
