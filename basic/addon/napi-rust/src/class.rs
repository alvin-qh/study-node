//! 演示在 Rust 模块中导出 Node 类
//!
//! Rust 结构体能够被导出为 Node 类的前提条件为:
//! - 结构体必须标记为 `#[napi]` 或 `#[napi(constructor)]`, 后者可为 Node 类自动生成参数构造器;
//! - 结构体必须修饰为 `pub`;
//! - 结构体所在的模块必须修饰为 `pub`;
//! - 结构体的方法若要被导出, 则 `impl` 语句需要标记 `#[napi]` 属性, 其中定义的方法也必须标记 `#[napi]`;
//! - 可以通过 `#[napi(getter)]` 或 `#[napi(setter)]` 属性标记, 将 Rust 方法生成为 Node 类的 `get` 或 `set` 方法;

/// 将 Rust 的 `core::Result` 枚举转化为 `napi::Result` 枚举
fn map_napi_result<T, E: std::error::Error>(result: Result<T, E>) -> napi::Result<T> {
  match result {
    Ok(value) => Ok(value),
    Err(err) => Err(napi::Error::from_reason(format!("{:?}", err))),
  }
}

/// 定义结构体, 并通过 `#[napi(constructor)]` 属性标识, 向 Node 导出 Rust 类, 并自动生成参数构造器
///
/// 导出的函数相当于下面的 js 代码:
///
/// ```js
/// export class DemoWithDefaultConstructor {
///   name: string
///   age: number
///   gender: string
///
///   constructor(name: string, age: number, gender: string)
/// }
/// ```
///
/// `#[napi(constructor)]` 属性标记中的 `constructor` 参数在 Node 中自动为类生成构造器, 该构造器的生成规则为:
/// - 结构体中所有修饰了 `pub` 的字段均会在构造器内部进行赋值;
/// - 构造器的参数为按照结构体字段顺序, 将所有修饰了 `pub` 字段对应生成为参数;
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[napi(constructor)]
pub struct DemoWithDefaultConstructor {
  pub name: String,
  pub age: i32,
  pub gender: String,
}

/// 为 `DemoWithDefaultConstructor` 结构体添加方法, 必须添加 `#[napi]` 属性标识, 方能在 Node 中生成对应方法
#[napi]
impl DemoWithDefaultConstructor {
  /// 定义方法, 用于获取当前实例的 `json` 字符串
  ///
  /// 通过 `#[napi(getter)]` 属性标记, 将该方法生成为 Node 的 `get` 方法
  ///
  /// 导出的方法相当于下面的 js 代码:
  ///
  /// ```js
  /// export class DemoWithDefaultConstructor {
  ///   get json(): string
  ///   ...
  /// }
  /// ```
  ///
  /// 该方法可以返回 `String` 类型实例或 `napi::Result<String>` 类型枚举, 这两种返回值映射到 Node 方法时返回值都为 `String` 类型,
  /// 区别在于:
  /// - 如果函数返回了 `Ok(String)`, 则在 Node 中直接返回 `String` 字符串对象;
  /// - 如果函数返回了 `Err(Error)`, 则在 Node 中会抛出异常;
  #[napi(getter)]
  pub fn get_json(&self) -> napi::Result<String> {
    map_napi_result(serde_json::to_string(self))
  }

  /// 定义方法, 用于为当前实例设置 `json` 字符串
  ///
  /// 通过 `#[napi(setter)]` 属性标记, 将该方法生成为 Node 的 `set` 方法
  ///
  /// 导出的方法相当于下面的 js 代码:
  ///
  /// ```js
  /// export class DemoWithDefaultConstructor {
  ///   set json(json: string): void
  ///   ...
  /// }
  /// ```
  ///
  /// 该方法可以无返回值或返回 `napi::Result<()>` 类型枚举, 这两种返回值映射到 Node 方法时返回值都为 `void` 类型,
  /// 区别在于:
  /// - 如果函数返回了 `Ok(())`, 则在 Node 中表示无返回值;
  /// - 如果函数返回了 `Err(Error)`, 则在 Node 中会抛出异常;
  #[napi(setter)]
  pub fn set_json(&mut self, json: String) -> napi::Result<()> {
    let demo: Self = map_napi_result(serde_json::from_str(&json))?;
    self.name = demo.name;
    self.age = demo.age;
    self.gender = demo.gender;

    Ok(())
  }

  /// 定义方法, 用于改变 `DemoWithDefaultConstructor` 结构体实例的字段值
  ///
  /// 通过 `#[napi]` 属性标记, 将该方法生成为 Node 的 `change` 方法
  ///
  /// 导出的方法相当于下面的 js 代码:
  ///
  /// ```js
  /// export class DemoWithDefaultConstructor {
  ///   change(name: string, age: number, gender: string): void
  ///   ...
  /// }
  /// ```
  #[napi]
  pub fn change(&mut self, name: String, age: i32, gender: String) {
    self.name = name;
    self.age = age;
    self.gender = gender;
  }

  /// 定义方法, 用于将 `DemoWithDefaultConstructor` 结构体实例转为字符串
  ///
  /// 通过 `#[napi]` 属性标记, 将该方法生成为 Node 的 `toString` 方法
  ///
  /// 导出的方法相当于下面的 js 代码:
  ///
  /// ```js
  /// export class DemoWithDefaultConstructor {
  ///   toString(): string
  ///   ...
  /// }
  /// ```
  #[napi]
  pub fn to_string(&self) -> String {
    format!(
      "name: {}, age: {}, gender: {}",
      self.name, self.age, self.gender
    )
  }
}

/// 定义结构体, 并通过 `#[napi(js_name = "DemoWithCustomConstructor")]` 属性标识, 向 Node 导出 Rust 类, 并且不会自动生成类构造器,
/// 其中的 `js_name = "DemoWithCustomConstructor"` 参数表示生成的 Node 类名称
///
/// 需要在结构体的 `impl` 实现中手动添加构造器方法
///
/// 导出的函数相当于下面的 js 代码:
///
/// ```js
/// export class DemoWithCustomConstructor {
///   name: string
///   age: number
///   gender: string
/// }
/// ```
#[derive(Debug, Clone)]
#[napi(js_name = "DemoWithCustomConstructor")]
pub struct DemoWithCustomConstructor {
  pub name: String,
  pub age: i32,
  pub gender: String,
}

/// 为 `DemoWithCustomConstructor` 结构体添加方法, 必须添加 `#[napi]` 属性标识, 方能在 Node 中生成对应方法
#[napi]
impl DemoWithCustomConstructor {
  /// 定义生成结构体实例的方法, 并通过 `#[napi(constructor)]` 属性标识, 表示在 Node 中生成为类构造函数
  ///
  /// 导出的函数相当于下面的 js 代码:
  ///
  /// ```js
  /// export class DemoWithCustomConstructor {
  ///   ...
  ///   constructor(name: string, age: number, gender: string)
  /// }
  /// ```
  ///
  /// 该方法的方法名可以任意定义, 但遵从 Rust 规范, 一般命名为 `new` 方法
  #[napi(constructor)]
  pub fn new(name: String, age: i32, gender: String) -> Self {
    Self { name, age, gender }
  }
}

/// 定义结构体, 并通过 `#[napi(js_name = "DemoWithFactory")]` 属性标识, 向 Node 导出 Rust 类, 并自动生成参数构造器
/// 其中的 `js_name = "DemoWithFactory"` 参数表示生成的 Node 类名称
///
/// 该结构体不会在映射为 Node 代码时产生构造器
///
/// 导出的函数相当于下面的 js 代码:
///
/// ```js
/// export class DemoWithFactory {
///   name: string
///   age: number
///   gender: string
/// }
/// ```
#[derive(Debug, Clone)]
#[napi(js_name = "DemoWithFactory")]
pub struct DemoWithFactory {
  pub name: String,
  pub age: i32,
  pub gender: String,
}

/// 为 `DemoWithFactory` 结构体添加方法, 必须添加 `#[napi]` 属性标识, 方能在 Node 中生成对应方法
#[napi]
impl DemoWithFactory {
  /// 为结构体定义方法, 用于构建结构体实例, 并通过 `#[napi(factory)]` 属性标识, 表示在 Node 中生成静态工厂方法
  ///
  /// 该方法参数不包含 `&self` 参数, 故而为一个 "静态" 函数, 生成 Node 函数时也为 "静态" 函数
  ///
  /// 导出的函数相当于下面的 js 代码:
  ///
  /// ```js
  /// export class DemoWithCustomConstructor {
  ///   ...
  ///   static build(name: string, age: number, gender: string): DemoWithFactory
  /// }
  /// ```
  #[napi(factory)]
  pub fn build(name: String, age: i32, gender: String) -> Self {
    Self { name, age, gender }
  }
}
