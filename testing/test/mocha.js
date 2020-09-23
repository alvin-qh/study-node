const assert = require('assert');

/**
 * Test "node.js assert" module
 */
describe('Test "node.js assert" module', () => {
  /**
   * 用于断定value的值是否表示true
   */
  it('should "assert.ok" work', () => {
    assert.ok(true, 'This is true value');
    assert(true, 'This is true value');
  });

  /**
   * 用于断定actual和expected是否相等（通过==运算符）
   */
  it('should "assert.equal" work', () => {
    const expected = 100;
    assert.equal(100, expected);
  });

  /**
   * 用于断定actual和expected是否不相等（通过!=判断）
   */
  it('should "assert.notEqual" work', () => {
    const expected = 100;
    assert.notEqual(99, expected);
  });

  /**
   * 用于断定actual和expected是否相等（逐一比较对象属性）
   */
  it('should "assert.deepEqual" work', () => {
    const expected = { a: 100, b: 200 };
    assert.deepEqual({ a: 100, b: 200 }, expected);
  });

  /**
   * 用于断定actual和expected是否不相等（逐一比较对象属性）
   */
  it('should "assert.notDeepEqual" work', () => {
    const expected = { a: 200, b: 200 };
    assert.notDeepEqual({ a: 100, b: 200 }, expected);
  });

  /**
   * 用于断定actual和expected是否相等（通过===运算符比较）
   */
  it('should "assert.strictEqual" work', () => {
    const excepted = 100;
    assert.strictEqual(excepted, 100);
  });

  /**
   * 用于断定actual和expected是否不相等（通过!==运算符比较）
   */
  it('should "assert.notStrictEqual" work', () => {
    const excepted = '100';
    assert.notStrictEqual(excepted, 100);
  });

  /**
   * 用于断定是否有指定的异常抛出
   */
  it('should "assert.throws" work', () => {
    assert.throws(() => {
      throw new Error("testing error message");
    });	// pass test if any exception was raised

    assert.throws(() => {
      throw new Error("testing error message");
    }, Error);	// pass test if exception as 'Error' was raised

    assert.throws(() => {
      throw new Error("testing error message");
    }, e => {
      if (e instanceof Error) {
        console.error(e);
        return true;	// cannot pass test if return false
      }
    });
  });

  /**
   * 用于断定是否有指定的异常抛出
   */
  it('should "assert.doesNotThrow" work', () => {
    assert.doesNotThrow(() => {
    });	// pass test if any exception was raised

    assert.doesNotThrow(() => {
    }, Error);	// pass test if exception as 'Error' was raised

    assert.doesNotThrow(() => {
    }, e => {
      assert(e === null);
    });
  });

  /**
   * 用于断定value值是否为false
   */
  it('should "assert.ifError" work', () => {
    assert.ifError(null);
    // assert.ifError(new Error());
  });

  /**
   * 用于显示错误信息
   */
  xit('test', () => {
    assert.fail(100, 100, '', '=');
  });
});
