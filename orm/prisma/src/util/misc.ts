const stateStorage = new Map<string, unknown>();

/**
 * 通过唯一 key 存储一个状态对象
 *
 * @param {string} key 状态对象的 key
 * @param {unknown} state 状态对象
 */
export function saveState(key: string, state: unknown): void {
  stateStorage.set(key, state);
}

/**
 * 通过唯一 key 获取对应的状态对象
 *
 * @param {string} key 状态对象的 key
 * @returns {R} 状态对象
 */
export function getState<R>(key: string): R | undefined {
  return stateStorage.get(key) as R;
}

/**
 * 通过唯一 key 删除状态对象
 *
 * @param key 状态对象的 key
 * @returns 被删除的状态值
 */
export function removeState(key: string): unknown {
  const state = stateStorage.get(key);
  stateStorage.delete(key);
  return state;
}

/**
 * 当指定的状态不存在时, 执行对应的回调函数
 *
 * @param key 状态对象的 key
 * @param fn 当状态对象不存在时, 要执行的回调函数
 */
export function whenStateNotExist(key: string, fn: () => void): void {
  if (!getState(key)) {
    fn();
  }
}

/**
 * `whenStateNotExist` 函数的异步版本
 *
 * @param key 状态对象的 key
 * @param fn 当状态对象不存在时, 要执行的回调函数, 异步函数
 */
export async function whenStateNotExistAsync(key: string, fn: () => Promise<void>): Promise<void> {
  if (!getState(key)) {
    await fn();
  }
}
