#[napi]
pub fn hello_world() -> String {
  "Hello NAPI for Rust!".to_string()
}

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
  a + b
}
