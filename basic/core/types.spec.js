import { expect } from 'chai';

/**
 * 测试 nodejs 类型
 */
describe('test node type', () => {
  /**
   * 测试 Boolean 类型
   */
  it("test 'Boolean' type", () => {
    // 非空字符串表示的布尔类型
    let b = Boolean('Hello');
    expect(b).is.true;

    // 空字符串表示的布尔类型
    b = Boolean('');
    expect(b).is.false;

    // 非零数值表示的布尔类型
    b = Boolean(1);
    expect(b).is.true;

    // 数值零表示的布尔类型
    b = Boolean(0);
    expect(b).is.false;

    // 空数组表示的布尔类型, 注意: 空数组的布尔值为 `true`
    b = Boolean([]);
    expect(b).is.true;

    // 对象数组表示的布尔类型, 注意: 对象数组的布尔值为 `true`
    b = Boolean({});
    expect(b).is.true;

    // `null` 值表示的布尔类型
    b = Boolean(null);
    expect(b).is.false;

    // `NaN` 值表示的布尔类型
    b = Boolean(NaN);
    expect(b).is.false;

    // `undefined` 值表示的布尔类型
    b = Boolean(undefined);
    expect(b).is.false;
  });
});
