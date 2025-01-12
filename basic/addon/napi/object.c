#include <assert.h>
#include <stdlib.h>

#include "common.h"

/// @brief 定义结构体, 用于保存 JS 对象的值
typedef struct _Value {
  // 数值类型值
  double value;

  // 当前对象的上下文环境
  napi_env env;

  // 当前对象的引用
  napi_ref ref;
} Value;

/// @brief 从上下文环境中获取绑定的 Node 构造函数对象
///
/// @param env 当前上下文对象
/// @return Node 构造器函数对象
napi_value get_constructor(napi_env env) {
  void* data = NULL;

  // 从上下文中获取关联的 `data` 指针, 为一个 `void*` 类型指针
  napi_status status = napi_get_instance_data(env, &data);
  assert(status == napi_ok);

  napi_value cons;

  // 从 `data` 指针中获取其引用的值, 为 `Value` 类型的 Node 构造器函数
  status = napi_get_reference_value(env, *(napi_ref*)data, &cons);
  assert(status == napi_ok);

  // 返回获取的 Node 构造器函数
  return cons;
}

napi_value get_value(napi_env env, napi_callback_info info) {
  napi_value this_;
  napi_status status = napi_get_cb_info(env, info, NULL, NULL, &this_, NULL);
  assert(status == napi_ok);

  Value* obj;
  status = napi_unwrap(env, this_, (void**)&obj);
  assert(status == napi_ok);

  napi_value num;
  status = napi_create_double(env, obj->value, &num);
  assert(status == napi_ok);

  return num;
}

napi_value set_value(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value args[1];
  napi_value this_;

  napi_status status = napi_get_cb_info(env, info, &argc, args, &this_, NULL);
  assert(status == napi_ok);

  Value* obj;
  status = napi_unwrap(env, this_, (void**)&obj);
  assert(status == napi_ok);

  status = napi_get_value_double(env, args[0], &obj->value);
  assert(status == napi_ok);

  return NULL;
}

napi_value plus_one(napi_env env, napi_callback_info info) {
  napi_value this_;

  napi_status status = napi_get_cb_info(env, info, NULL, NULL, &this_, NULL);
  assert(status == napi_ok);

  Value* obj;
  status = napi_unwrap(env, this_, (void**)&obj);
  assert(status == napi_ok);

  obj->value += 1;

  napi_value num;
  status = napi_create_double(env, obj->value, &num);
  assert(status == napi_ok);

  return num;
}

napi_value multiply(napi_env env, napi_callback_info info) {
  napi_value this_;

  size_t argc = 1;
  napi_value args[1];
  napi_status status = napi_get_cb_info(env, info, &argc, args, &this_, NULL);
  assert(status == napi_ok);

  napi_valuetype v_type;
  status = napi_typeof(env, args[0], &v_type);
  assert(status == napi_ok);

  double multiple = 1;
  if (v_type != napi_undefined) {
    status = napi_get_value_double(env, args[0], &multiple);
    assert(status == napi_ok);
  }

  Value* obj;
  status = napi_unwrap(env, this_, (void**)&obj);
  assert(status == napi_ok);

  napi_value argv[1];
  status = napi_create_double(env, obj->value * multiple, argv);
  assert(status == napi_ok);

  napi_value instance;
  status = napi_new_instance(env, get_constructor(env), 1, argv, &instance);
  assert(status == napi_ok);

  return instance;
}

void destroy_object(napi_env env, void* ptr, void* /*finalize_hint*/) {
  Value* obj = (Value*)ptr;
  // 销毁 obj 指针指向的对象
}

/// @brief 创建新的 Node 对象
///
/// 当前函数被作为产生 Node 对象的构造函数, 故在 Node 中执行如下代码时, 都会关联执行到本函数
///
/// ```js
/// const v1 = new Value(100);
/// const v2 = Value(200);
/// ```
///
/// 这两种调用方式的区别在于, 其 `new.target` 是否有值
///
/// @param env 当前上下文对象
/// @param info 函数调用信息
/// @return Node 对象
napi_value new_object(napi_env env, napi_callback_info info) {
  napi_value target;

  // 获取调用的 `new.target` 属性值
  napi_status status = napi_get_new_target(env, info, &target);
  assert(status == napi_ok);

  size_t argc = 1;
  napi_value args[1];

  // 判断 `new.target` 是否存在, 即表示是否在 Node 中通过 `new` 关键字调用此函数
  if (target != NULL) {
    napi_value this_;

    // 通过上下文, 获取调用此函数所传递的参数以及当前 Node 对象的 `this` 引用
    status = napi_get_cb_info(env, info, &argc, args, &this_, NULL);
    assert(status == napi_ok);

    // 获取传递参数的类型
    napi_valuetype v_type;
    status = napi_typeof(env, args[0], &v_type);
    assert(status == napi_ok);

    double value = 0;

    // 如果传递的 Node 参数类型不为 `undefined`, 则获取 Node 参数值, 保存在 `double` 类型变量中
    if (v_type != napi_undefined) {
      status = napi_get_value_double(env, args[0], &value);
      assert(status == napi_ok);
    }

    // 实例化 `Value` 结构体变量, 用于包装为 Node 对象
    Value* obj = (Value*)malloc(sizeof(Value));
    obj->value = value;
    obj->env = env;

    // 将 C 结构体指针包装为 Node 对象
    status = napi_wrap(
      env,            // 上下文环境对象
      this_,          // 当前对象在 Node 中的 `this` 引用
      (void*)obj,     // 要包装的结构体指针
      destroy_object, // 销毁对象的方法
      NULL,           // 附加的 `hit` 指针
      &obj->ref       // 返回包装后对象的引用
    );
    assert(status == napi_ok);

    // 返回当前 Node 对象的 `this` 引用
    return this_;
  }

  // 如果在 Node 中直接调用 `Value` 函数 (即 `Value(...)` 而非 `new Value(...)`)

  // 获取调用函数时传递的参数
  status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);
  assert(status == napi_ok);

  napi_value instance;

  // 通过绑定的 Node 构造函数, 创建 `Value` 类型的实例
  status = napi_new_instance(env, get_constructor(env), argc, args, &instance);
  assert(status == napi_ok);

  // 返回生成的对象实例
  return instance;
}

/// @brief 当 `Value` 类型不再被 `Node` 使用时, 调用此函数将其销毁
///
/// @param env 上下文对象
/// @param data 和 `Value` 类型关联的 `data` 属性值
/// @param hint 和 `Value` 类型关联的 Hint 数据
void finalize_class(napi_env env, void* data, void* /* hint */) {
  // 从上下文 `data` 属性中获取 Node 引用
  napi_ref* constructor_ref = (napi_ref*)data;

  // 从 Node 引用中删除对当前类型构造器的引用
  napi_status status = napi_delete_reference(env, *constructor_ref);
  assert(status == napi_ok);

  // 在 C 中释放内存
  free(constructor_ref);
}

/// @brief 初始化当前模块
///
/// 在初始化过程中, 通过 `napi_define_class` 函数声明了一个 Node 类型 (`class`), 该类型包含 `value` 属性 (以及对应的 `get`, `set` 函数),
/// 以及 `plusOne` 和 `multiply` 方法; 此外, 还将 `new_object` 函数绑定为 Node 类型的构造函数
///
/// 为了之后方便调用 Node 构造函数, 这里将构造函数作为 Node 引用, 作为上下文的 `data` 属性进行存储, 后续和 `Value` 类型相关的调用,
/// 都可以通过获取到上下文的 `data` 属性值, 从而获取到构造器函数
///
/// @param env 当前上下文对象
/// @param exports 可以导出的 Node 对象
/// @return 实际导出的 Node 对象
napi_value init(napi_env env, napi_value exports) {
  // 定义对象上定义的各个属性
  napi_property_descriptor props[] = {
    // 为 Node 类型定义 `value` 属性, 并对应两个 C 函数 `get_value` 和 `set_value` 作为属性值访问器函数
    { "value", 0, 0, get_value, set_value, 0, napi_default, 0 },

    // 为 Node 类型定义 `plusOne` 方法, 对应 C 函数 `plus_one`
    DECLARE_NAPI_METHOD("plusOne", plus_one),

    // 为 Node 类型定义 `multiply` 方法, 对应 C 函数 `multiply`
    DECLARE_NAPI_METHOD("multiply", multiply),
  };

  napi_value constructor;

  // 定义一个 Node 类型, 名为 `Value`, 并设定 C 函数 `new_object` 作为创建对象的构造函数
  // 返回 `constructor` 变量值表示对应的 Node 构造函数对象
  napi_status status = napi_define_class(
    env, "Value", NAPI_AUTO_LENGTH, new_object, NULL, 3, props, &constructor
  );
  assert(status == napi_ok);

  // 创建一个 Node 引用类型变量
  napi_ref* constructor_ref = (napi_ref*)malloc(sizeof(napi_ref));

  // 将 Node 引用类型变量引用到 Node 构造函数对象上
  status = napi_create_reference(env, constructor, 1, constructor_ref);
  assert(status == napi_ok);

  // 将 Node 引用类型变量作为 `data` 属性关联到当前上下文对象上
  status = napi_set_instance_data(
    env,
    constructor_ref, // 关联当前上下文的 `data` 属性
    finalize_class,  // 指向一个 C 销毁函数, 当前上下文销毁时, 执行对应的销毁函数
    NULL
  );
  assert(status == napi_ok);

  // 在导出对象上关联 `Value` Node 类型
  status = napi_set_named_property(env, exports, "Value", constructor);
  assert(status == napi_ok);

  return exports;
}

// 定义 Node 模块
NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
