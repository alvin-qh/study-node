/**
 * 等待一个条件为真后调用指定函数
 *
 * @param {() => bool} condition 条件函数, 返回 `bool` 值
 * @param {() => void} finish 当 `condition` 返回 `true` 时, 调用该函数
 */
export function wait(condition, finish) {
  const timer = setInterval(() => {
    if (condition()) {
      clearInterval(timer);
      finish();
    }
  }, 50);
}
