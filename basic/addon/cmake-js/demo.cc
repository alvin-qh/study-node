#include <napi.h>

#include <sstream>

/// @brief 定义演示类, 导出到 Node 环境使用
class Demo : public Napi::ObjectWrap<Demo> {
public:
  /// @brief 构造器, 用于构造当前对象
  ///
  /// @param info 调用上下文对象引用
  Demo(const Napi::CallbackInfo& info)
    : Napi::ObjectWrap<Demo>(info) {
    // 判断是否传入构造器参数
    if (info.Length() <= 0 || info[0].IsUndefined()) {
      Napi::TypeError::New(info.Env(), "value expected").ThrowAsJavaScriptException();
      return;
    }

    // 保存构造器参数值
    _value = info[0].As<Napi::String>().Utf8Value();
  }

  /// @brief 初始化 `Demo` 类型并导出
  ///
  /// @param env 环境上下文对象
  /// @param exports 模块导出对象
  static void init(Napi::Env env, Napi::Object& exports) {
    // 定义要导出的构造器函数对象, 用于在 Node 环境中实例化 `Demo` 对象
    Napi::Function fn = DefineClass(env, "Demo", {
        InstanceAccessor("value", &Demo::get_value, &Demo::set_value),
        InstanceMethod("toString", &Demo::to_string)
      });

    // 将构造器函数对象和 `Demo` 类型进行绑定
    env.SetInstanceData(
      new Napi::FunctionReference(Napi::Persistent(fn))
    );

    // 将构造器函数导出为 `Demo` 名称
    exports.Set("Demo", fn);
  }
private:
  std::string _value;

  /// @brief 对应 Node 中的 `value` 属性, 用于获取 `value` 属性值的函数
  ///
  /// @param info 调用上下文对象引用
  /// @return `value` 属性值, 为 `Napi::String` 类型
  Napi::Value get_value(const Napi::CallbackInfo& info) {
    return Napi::String::New(info.Env(), _value);
  }

  /// @brief 对应 Node 中的 `value` 属性, 用于设置 `value` 属性值的函数
  ///
  /// @param info 调用上下文对象引用
  /// @param value 要设置的属性值, 为 `Napi::Value` 类型
  void set_value(const Napi::CallbackInfo& info, const Napi::Value& value) {
    if (value.IsUndefined()) {
      Napi::TypeError::New(info.Env(), "value is undefined").ThrowAsJavaScriptException();
      return;
    }
    _value = info[0].As<Napi::String>().Utf8Value();
  }

  /// @brief 对应 Node 中的 `toString` 方法, 返回当前对象的字符串表示
  ///
  /// @param info 调用上下文对象引用
  /// @return 字符串值, 为 `Napi::String` 类型
  Napi::Value to_string(const Napi::CallbackInfo& info) {
    std::stringstream stream;
    stream << "Hello CMakeJS, value is: " << _value;

    return Napi::String::New(info.Env(), stream.str());
  }
};

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
  // 调用 `Value` 类的静态方法初始化 Node 中的 `Value` 类, 并将其附加在 `exports` 对象上, 表示导出
  Demo::init(env, exports);

  // 返回注册结果
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NODE_API_MODULE(NODE_GYP_MODULE_NAME, init);
