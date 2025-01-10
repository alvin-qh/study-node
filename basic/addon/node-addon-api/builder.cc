/// 通过 C++ 导出一个用于创建 Node 对象的函数
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
#include <napi.h>

#include <string>
#include <sstream>

/**
 * @brief 定义一个函数, 将注册到 Node 对象的属性, 作为该对象的方法
 *
 * 该方法用于将传入的 `this` 引用的对象格式化为字符串结果返回
 *
 * 通过 `Napi::CallbackInfo` 对象可以获取到当前 C++ 函数调的用信息
 * - 通过 `This` 方法可以获取 Node 调用该函数时传递的 `this` 引用, 为 `Napi::Object` 类型对象;
 *
 * 通过 `Napi::Object` 类型的 `Get` 方法, 即可获取到对象指定属性的值
 *
 * @param info 回调上下文信息对象
 * @return Node 函数返回值
 */
Napi::Value user_to_string(const Napi::CallbackInfo& info) {
  // 获取环境上下文对象
  Napi::Env env = info.Env();

  // 从上下文获取当前函数调用关联的 `this` 引用, 并判断是否为 `Object` 类型
  if (!info.This().IsObject()) {
    Napi::TypeError::New(env, "this is not an object").ThrowAsJavaScriptException();
    return env.Null();
  }

  // 获取 `this` 引用
  Napi::Object this_ = info.This().As<Napi::Object>();

  // 从 `this` 引用中获取 `name` 属性, 并转为 `std::string` 类型
  std::string name = this_.Get("name").As<Napi::String>().Utf8Value();

  // 从 `this` 引用中获取  `age` 属性, 并转为 `double` 类型
  double age = this_.Get("age").As<Napi::Number>().DoubleValue();

  // 从 `this` 引用中获取  `gender` 属性, 并转为 `std::string` 类型
  std::string gender = this_.Get("gender").As<Napi::String>().Utf8Value();

  // 格式化返回字符串
  std::stringstream result;
  result << "name: " << name << ", age: " << age << ", gender: " << gender;

  // 返回格式化后的字符串对象
  return Napi::String::New(env, result.str());
}

/**
 * @brief 定义 C++ 函数, 调用该函数返回一个 Node 对象
 *
 * 通过 `Napi::Object::New` 方法可以创建一个 Node 对象, 并通过该对象的 `Set` 方法设置属性值
 *
 * @param info 回调上下文信息对象
 * @return 返回 Node 回调函数返回的值, 为一个 Node 对象
 */
Napi::Value create_user_object(const Napi::CallbackInfo& info) {
  // 获取环境上下文对象
  Napi::Env env = info.Env();

  if (info.Length() < 3) {
    napi_throw_type_error(env, NULL, "wrong number of arguments");
    return env.Null();
  }

  // 生成一个 Node 对象, 作为返回值
  Napi::Object user = Napi::Object::New(env);

  // 为对象设置 `name` 属性
  user.Set(Napi::String::New(env, "name"), info[0].As<Napi::String>());

  // 为对象设置 `age` 属性
  user.Set(Napi::String::New(env, "age"), info[1].As<Napi::Number>());

  // 为对象设置 `gender` 属性
  user.Set(Napi::String::New(env, "gender"), info[2].As<Napi::String>());

  // 为对象设置 `toString` 方法
  user.Set(Napi::String::New(env, "toString"), Napi::Function::New(env, user_to_string));

  // 返回整个 Node 对象
  return user;
}

/**
 * @brief 初始化 C++ 下的 Node 模块
 *
 * 可以将 `create_user_object` 函数作为一个 Node 属性, 并通过 `napi_define_properties` 函数注册后导出
 *
 * @param env Node 环境上下文
 * @param exports Node 模块导出对象
 * @return Node 模块导出对象
 */
Napi::Object init(Napi::Env env, Napi::Object exports) {
  // 在导出对象中设置名为 `argumentsFunc` 的属性, 属性值为函数
  exports.Set(Napi::String::New(env, "createUserObject"), Napi::Function::New(env, create_user_object));

  // 返回注册结果
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NODE_API_MODULE(createUserObject, init);
