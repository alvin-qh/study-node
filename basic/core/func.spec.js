import { expect } from '@jest/globals';

/**
 * 测试函数
 */
describe('test functions', () => {
  /**
   * 测试函数 1, 内部不使用 `this` 引用
   *
   * @param  {...number} args 不定参数, 可为任意数量数值参数
   * @returns {number} 所有参数相加的结果
   */
  function fn1(...args) {
    if (args.length === 0) {
      return null;
    }
    return args.reduce((sum, n) => sum + n);
  }

  /**
   * 测试函数 2, 内部使用 `this` 引用
   *
   * @param  {...number} args 不定参数, 可为任意数量数值参数
   * @returns {number} 所有参数和 `this.value` 相加的结果
   */
  function fn2(...args) {
    if (args.length === 0) {
      return this.value;
    }

    return args.reduce((sum, n) => sum + n, this.value);
  }

  /**
   * 为函数设置 this 引用
   */
  it("should attach 'this' reference to function", () => {
    // 调用测试函数 1, 不传递 this 引用
    let r = fn1.apply(null);
    expect(r).toEqual(null);

    r = fn1.apply(null, [100]);
    expect(r).toEqual(100);

    r = fn1.apply(null, [100, 200]);
    expect(r).toEqual(300);

    // 调用测试函数 2, 传递一个对象作为该函数的 this 引用
    r = fn2.apply({ value: 100 });
    expect(r).toEqual(100);

    r = fn2.apply({ value: 100 }, [200, 300]);
    expect(r).toEqual(600);
  });

  /**
   * 为函数绑定 this 引用和一部分参数, 返回新函数对象
   */
  it('should bind function with some arguments', () => {
    // 为 fn1 函数绑定第一个参数
    let fn = fn1.bind(null, 100);
    // 调用绑定后函数, 并传入第二个参数
    let r = fn(200);
    expect(r).toEqual(300);

    // 为 fn1 函数绑定 this 引用和前两个参数
    fn = fn2.bind({ value: 100 }, 200, 300);
    // 调用绑定后函数, 并传入第三个参数
    r = fn(400);
    expect(r).toEqual(1000);
  });

  /**
   * 将字符串转化为函数
   */
  it('should compile string into function', () => {
    // 构建函数对象, 传入函数参数名称和函数体内容

    let fn = new Function('a', 'b', 'return a + b;');
    let r = fn(10, 20);
    expect(r).toEqual(30);

    // 为函数绑定 this 引用

    fn = new Function('a', 'return this.value + a').bind({ value: 100 });
    r = fn(200);
    expect(r).toEqual(300);
  });
});
