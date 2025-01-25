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

/// @brief 定义 C++ 的 `Value` 类, 该类会映射为 Node 中的 `Value` 类
///
/// 需要继承 `Napi::ObjectWrap` 类, 当前类型会被包装为 Node 类型
class Value : public Napi::ObjectWrap<Value> {
public:
  /// @brief 构造器
  ///
  /// 该构造器会被映射为 Node 中 `Value` 类的构造器
  ///
  /// 注意: 构造器中需要调用父类构造器
  ///
  /// @param info 函数调用上下文信息
  Value(const Napi::CallbackInfo& info)
    : Napi::ObjectWrap<Value>(info) {
    // 判断是否传递了 Node 参数, 且该参数不为 `undefined`
    if (info.Length() <= 0 || info[0].IsUndefined()) {
      Napi::TypeError::New(info.Env(), "number expected").ThrowAsJavaScriptException();
      return;
    }

    // 获取从 Node 中传递的参数, 将其转为 `double` 类型, 保存到 `_value` 成员变量中
    _value = info[0].As<Napi::Number>().DoubleValue();
  }

  /// @brief 定义静态函数, 用于初始化 Node 中的 `Value` 类型
  ///
  /// @param env Node 环境上下文对象
  /// @param exports 模块导出对象
  static void init(Napi::Env env, Napi::Object& exports) {
    // 定义 Node 类型, 类名为 `Value`, 具备三个属性, 分别为 `plusOne` 和 `multiply` 两个函数以及 `value` 属性
    // (`value` 属性对应到 `get_value` 和 `set_value` 两个函数, 用于读写属性值)
    //
    // `DefineClass` 函数返回一个 Node 函数对象, 作为 Node 中 `Value` 类型的构造函数, 用于创建 `Value` 类对象
    Napi::Function fn = DefineClass(env, "Value", {
        InstanceMethod("plusOne", &Value::plus_one),
        InstanceMethod("multiply", &Value::multiply),
        InstanceAccessor("value", &Value::get_value, &Value::set_value)
      });

    // 将 Node 的 `Value` 类型构造函数和当前上下文进行绑定, 用于后续获取该函数创建 `Value` 对象
    // 需要将函数包装为 Node 引用
    env.SetInstanceData(
      new Napi::FunctionReference(Napi::Persistent(fn))
    );

    // 将 `Value` 类型构造函数挂载为导出对象的 `Value` 属性
    exports.Set("Value", fn);
  }
private:
  /// @brief 属性值
  double _value;

  /// @brief 获取当前对象 `_value` 字段值, 返回该字段值的 Node 值
  ///
  /// 对应 Node 中 `Value` 类型的 `value` 属性
  ///
  /// @param info 函数调用上下文信息
  /// @return 当前对象 `_value` 字段值的 Node 值
  Napi::Value get_value(const Napi::CallbackInfo& info) {
    // 基于 `_value` 字段值创建 Node 对象并返回
    return Napi::Number::New(info.Env(), this->_value);
  }

  /// @brief 设置当前对象 `_value` 字段值, 通过所给的 Node 参数值
  ///
  /// 对应 Node 中 `Value` 类型的 `value` 属性
  ///
  /// @param info 函数调用上下文信息
  /// @param value 要设置的 `_value` 字段值的 Node 值
  void set_value(const Napi::CallbackInfo& info, const Napi::Value& value) {
    if (!value.IsUndefined()) {
      // 将 Node 值转为 `double` 类型后赋值给 `_value` 字段
      _value = value.As<Napi::Number>().DoubleValue();
    }
  }

  /// @brief 将当前对象的 `_value` 字段值加 `1`, 返回相加后的 `_value` 字段值
  ///
  /// 对应 Node 中 `Value` 类型的 `plusOne` 方法
  ///
  /// @param info 函数调用上下文信息
  /// @return `Napi::Number` 类型值, 表示当前对象 `_value` 字段值加 `1` 的结果
  Napi::Value plus_one(const Napi::CallbackInfo& info) {
    // 将 `_value` 字段值加 `1`
    this->_value++;

    // 返回 `_value` 字段值的 Node 值
    return get_value(info);
  }

  /// @brief 将当前对象的 `_value` 字段值乘以所给参数, 返回新的 `Value` 实例 (Node 对象)
  ///
  /// @param info 函数调用上下文信息
  /// @return 新的 `Value` 实例 (Node 对象)
  Napi::Value multiply(const Napi::CallbackInfo& info) {
    double multiple = 1;

    // 获取 Node 传递的参数, 转为 `double` 类型值
    if (info.Length() >= 0 && !info[0].IsUndefined()) {
      multiple = info[0].As<Napi::Number>().DoubleValue();
    }

    // 获取在 `init` 静态函数中绑定的 `Value` 类型构造函数, 实例化新的 Node `Value` 类型对象,
    // 构造器参数为 `_value` 字段值和参数的乘积
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
  // 调用 `Value` 类的静态方法初始化 Node 中的 `Value` 类, 并将其附加在 `exports` 对象上, 表示导出
  Value::init(env, exports);

  // 返回注册结果
  return exports;
}

// 定义一个 Node 模块并声明导出的函数
NODE_API_MODULE(NODE_GYP_MODULE_NAME, init);
