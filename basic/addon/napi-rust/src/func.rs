//! 演示在 Rust 中导出 Node 函数
//!
//! Rust 函数能够被导出为 Node 函数的前提条件为:
//! - 函数的参数和返回值必须为 Rust 基本类型, 或标记了 `#[napi]` 属性的 Rust 结构体, 联合体或枚举;
//! - 函数必须修饰为 `pub`;
//! - 函数所在的模块必须修饰为 `pub`;

use crate::r#const::HELLO;

/// 定义函数, 并通过 `#[napi]` 属性标识, 向 Node 导出 Rust 函数
///
/// 导出的函数相当于下面的 js 代码:
///
/// ```js
/// export function helloWorld(): string {
///   return HELLO;
/// }
/// ```
#[napi]
pub fn hello_world() -> String {
  HELLO.to_string()
}

/// 定义函数, 并通过 `#[napi]` 属性标识, 向 Node 导出 Rust 函数
///
/// 导出的函数相当于如下的 js 代码:
///
/// ```js
/// export function sum(a: number, b: number): number {
///   return a + b;
/// }
/// ```
#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
  a + b
}

/// 定义 `Gender` 枚举, 并通过 `#[napi(string_enum)]` 属性标识, 向 Node 导出值为字符串的枚举
///
/// 导出的枚举相当于如下 js 代码:
///
/// ```js
/// export const enum Gender {
///   Male = 'Male',
///   Female = 'Female'
/// }
/// ```
#[derive(PartialEq, Eq)]
#[napi(string_enum)]
pub enum Gender {
  Male,
  Female,
}

/// 为 `Gender` 枚举实现 `Display` 特性
impl std::fmt::Display for Gender {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    match self {
      Gender::Male => write!(f, "Male"),
      Gender::Female => write!(f, "Female"),
    }
  }
}

/// 定义 `User` 结构体, 并通过 `#[napi(constructor)]` 属性标识, 并向 Node 导出类, 属性的 `constructor` 参数表示为 Node 自动生产参数构造器
///
/// 导出的类相当于如下 js 代码:
///
/// ```js
/// export declare class User {
///   no: string
///   name: string
///   gender: Gender
/// }
/// ```
#[derive(PartialEq, Eq)]
#[napi(constructor)]
pub struct User {
  pub no: String,
  pub name: String,
  pub gender: Gender,
}

/// 定义函数, 并通过 `#[napi]` 属性标识, 并向 Node 导出函数
///
/// 导出的函数相当于如下 js 代码:
///
/// ```js
/// export function createUser(no: string, name: string, gender: Gender): User
/// ```
///
/// 函数可以返回 `User` 类型实例或 `napi::Result<User>` 类型枚举, 这两种返回值映射到 Node 函数时返回值都为 `User` 类型,
/// 区别在于:
/// - 如果函数返回了 `Ok(User)`, 则在 Node 中直接返回 `User` 类对象;
/// - 如果函数返回了 `Err(Error)`, 则在 Node 中会抛出异常;
#[napi]
pub fn create_user(no: String, name: String, gender: Gender) -> napi::Result<User> {
  if no.is_empty() || name.is_empty() {
    Err(napi::Error::new(
      napi::Status::InvalidArg,
      format!("{} cannot be empty", {
        if no.is_empty() {
          "no"
        } else if name.is_empty() {
          "name"
        } else {
          unreachable!()
        }
      }),
    ))?
  } else {
    Ok(User { no, name, gender })
  }
}

/// 定义函数, 并通过 `#[napi]` 属性标识, 并向 Node 导出函数
///
/// 导出的函数相当于如下 js 代码:
///
/// ```js
/// export function userToString(user: User): string
/// ```
#[napi]
pub fn user_to_string(user: &User) -> String {
  format!("{} {} {}", user.no, user.name, user.gender)
}
