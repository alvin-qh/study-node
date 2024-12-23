import {
  afterAll, beforeAll, describe, expect, it,
} from 'bun:test';

import {
  getState,
  removeState,
  saveState,
  whenStateNotExist,
} from './misc';

describe("test 'util.misc' module", () => {
  /**
   * 初始化测试
   */
  beforeAll(() => {
    // 设置状态值
    saveState('test', true);
  });

  /**
   * 清理测试
   */
  afterAll(() => {
    // 删除状态值
    removeState('test');
  });

  /**
   * 测试根据已有的 key 获取状态值
   */
  it("should 'getState' function returned exist state object", () => {
    // 通过已存在的 key 获取状态值
    const state = getState('test');
    expect(state).toBeTrue();
  });

  /**
   * 测试根据未知的 key 获取状态值, 返回 `undefined`
   */
  it("should 'getState' function returned not exist state object", () => {
    // 通过不存在的 key 查询状态值
    const state = getState('__unknown');
    expect(state).toBeUndefined();
  });

  /**
   * 测试当状态值不存在时调用指定的回调函数
   */
  it("should 'whenStateNotExist' function called when state not exist", () => {
    // 获取一个不存在的状态值
    const state = getState('__unknown');
    expect(state).toBeUndefined();

    let called = false;
    // 此时可以引发回调函数
    whenStateNotExist('__unknown', () => {
      called = true;
      // 保存状态值, 此时状态值已存在
      saveState('__unknown', true);
    });
    // 确认回调函数被调用
    expect(called).toBeTrue();
    // 测试状态值已被设置
    expect(getState('__unknown')).toBeTrue();

    // 再次调用时, 回调函数不再被调用
    whenStateNotExist('__unknown', () => {
      expect().fail();
    });
  });
});
