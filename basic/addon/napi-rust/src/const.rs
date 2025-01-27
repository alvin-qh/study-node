//! 演示在 Rust 中导出 Node 常量
//!
//! Rust 常量能够被导出为 Node 常量的前提是:
//! - 常量必须修饰为 `pub`;
//! - 常量所在的模块必须修饰为 `pub`;

/// 定义常量, 并通过 `#[napi]` 属性标识, 向 Node 导出 Rust 常量
///
/// 导出的函数相当于下面的 js 代码:
///
/// ```js
/// export const HELLO: string
/// ```
#[napi]
pub const HELLO: &str = "Hello NAPI for Rust!";
