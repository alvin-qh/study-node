import assert, { fail } from 'assert';

/**
 * 测试 node.js 内置的 `assert` 模块
 */
describe("test 'assert' module", () => {
  /**
   * 对 `boolean` 值进行断言
   */
  it("assert 'boolean' value", () => {
    assert(true, 'This is true value');
    assert.ok(true, 'This is true value');
  });

  /**
   * 等值断言
   */
  it("assert value 'equals'", () => {
    const expected = 100;

    assert.equal(100, expected);
    assert.notEqual(99, expected);
  });

  /**
   * 深度对象属性比较断言
   */
  it("assert objects 'deepEqual'", () => {
    const expected = { a: 100, b: 200 };

    assert.deepEqual({ a: 100, b: 200 }, expected);
    assert.notDeepEqual({ a: 99, b: 200 }, expected);
  });

  /**
   * 通过 `===` 运算符进行比较断言
   */
  it("assert value equals by '===' operator", () => {
    const excepted = 100;

    assert.strictEqual(excepted, 100);
    assert.notStrictEqual(excepted, '100');
  });

  /**
   * 异常断言
   */
  it("assert exception 'throws'", () => {
    // 断言代码会抛出异常
    assert.throws(() => {
      throw new Error('testing error message');
    });

    // 断言代码不会抛出异常
    assert.doesNotThrow(() => { });

    // 断言代码会抛出指定类型异常
    assert.throws(() => {
      throw new Error('testing error message');
    }, Error);

    // 断言代码不会抛出指定类型异常
    assert.doesNotThrow(() => { }, Error);

    // 断言代码会抛出异常, 且回调返回 true
    assert.throws(() => {
      throw new Error('testing error message');
    }, e => {
      assert.ok(e instanceof Error);
      return true;
    });

    // 断言代码不会抛出异常, 且不调用回调
    assert.doesNotThrow(() => { }, () => {
      fail();
    });
  });

  /**
   * 断言所给的对象引用为 `null`
   */
  it("assert given object is 'null'", () => {
    assert.ifError(null);
  });

  /**
   * 用于显示错误信息
   */
  xit("'skip' this test", () => {
    fail();
  });
});
