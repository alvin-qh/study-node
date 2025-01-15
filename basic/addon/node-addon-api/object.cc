/// 通过 C++ 导出函数, 该函数可以返回一个 C++ 语言描述的 Node 类
///
/// 下面 C++ 代码描述了如下 Node 代码
///
/// ```js
/// export class Value {
///   constructor(value) {
///     this._value = value;
///   }
///
///   get value() {
///     return this._value;
///   }
///
///   set value(value) {
///     this.value = value;
///   }
///
///   plusOne() {
///     return this.value + 1;
///   }
///
///   multiply(n) {
///     return new Value(this.value * n);
///   }
/// }
/// ```
#include <napi.h>

class Value : public Napi::ObjectWrap<Value> {
public:
  Value(const Napi::CallbackInfo& info)
    : Napi::ObjectWrap<Value>(info) {
    if (info.Length() <= 0 || info[0].IsUndefined()) {
      Napi::TypeError::New(info.Env(), "number expected").ThrowAsJavaScriptException();
      return;
    }

    this->_value = info[0].As<Napi::Number>().DoubleValue();
  }

  static void init(Napi::Env env, Napi::Object& exports) {
    Napi::Function fn = DefineClass(env, "Value", {
        InstanceMethod("plusOne", &Value::plus_one),
        InstanceMethod("multiply", &Value::multiply),
        InstanceAccessor("value", &Value::get_value, &Value::set_value)
      });

    env.SetInstanceData(
      new Napi::FunctionReference(Napi::Persistent(fn))
    );

    exports.Set("Value", fn);
  }
private:
  double _value;

  Napi::Value get_value(const Napi::CallbackInfo& info) {
    return Napi::Number::New(info.Env(), this->_value);
  }

  void set_value(const Napi::CallbackInfo& info, const Napi::Value& value) {
    if (!value.IsUndefined()) {
      this->_value = value.As<Napi::Number>().DoubleValue();
    }
  }

  Napi::Value plus_one(const Napi::CallbackInfo& info) {
    this->_value++;
    return get_value(info);
  }

  Napi::Value multiply(const Napi::CallbackInfo& info) {
    double multiple = 1;

    if (info.Length() >= 0 && !info[0].IsUndefined()) {
      multiple = info[0].As<Napi::Number>().DoubleValue();
    }

    Napi::Object instance = info.Env()
      .GetInstanceData<Napi::FunctionReference>()
      ->New({
          Napi::Number::New(info.Env(), this->_value * multiple)
        });

    return instance;
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
  Value::init(env, exports);
  // 返回注册结果
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NODE_API_MODULE(NODE_GYP_MODULE_NAME, init);
