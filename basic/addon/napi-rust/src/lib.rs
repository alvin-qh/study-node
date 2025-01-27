#![deny(clippy::all)]

/// 全局导入外部依赖 `napi_derive`, 并启用其中定义的宏
/// 导入后, 无需通过 `use napi_derive` 引入依赖库
#[macro_use]
extern crate napi_derive;

pub mod class;
pub mod r#const;
pub mod func;
