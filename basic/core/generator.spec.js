import { expect } from 'chai';

/**
 * 测试生成器函数
 *
 * 生成器函数返回 `Generator` 类型对象, 该对象可迭代, 可以每次获取一个值,
 * 函数内部通过 `yield` 语句返回每次迭代的值, 直到所有的 `yield` 语句都执行完毕
 *
 * 函数需定义为 `function*`, 表示是一个生成器函数
 */
describe("test 'generator' object", () => {
  /**
   * 测试创建生成器对象
   */
  it("should create 'generator' object", () => {
    /**
     * 定义生成器函数
     *
     * @returns {Generator<1 | 2, number, unknown>} 生成器对象:
     * - 该生成器函数将通过 `yield` 语句生成 `1` 和 `2` 两个值;
     * - 该生成器函数将通过 `return` 语句返回 `number` 类型值;
     * - 该生成器函数没有传递给 `yield` 语句的值
     */
    function* generator() {
      yield 1;
      yield 2;
      return 3;
    }

    // 调用生成器函数, 返回生成器对象
    const it = generator();
    expect(typeof it).to.eq('object');

    // 通过生成器的 `next` 方法获取每次迭代的值, 返回 `{done, value}` 对象,
    // 每执行一次 `next` 方法, 会对应执行生成器函数中的一条 `yield` 语句, 返回 `yield` 语句对应的值:
    // - 如果 `next` 方法的返回值是由 `yield` 语句提供, 则返回值的 `value` 属性为 `yield` 语句对应的值, `done` 属性为 `false`;
    // - 如果 `next` 方法的返回值是由 `return` 语句提供, 则返回值的 `value` 属性为 `return` 语句对应的值, `done` 属性为 `true`;
    // - 如果所有的 `yield` 语句都被执行完, 再次执行 `next` 方法, 则返回值的 `value` 属性为 `undefined`, `done` 属性为 `true`;
    expect(it.next()).to.satisfy(r => !r.done && r.value === 1);
    expect(it.next()).to.satisfy(r => !r.done && r.value === 2);
    expect(it.next()).to.satisfy(r => r.done && r.value === 3);
    expect(it.next()).to.satisfy(r => r.done && r.value === undefined);
  });

  /**
   * 测试生成器对象 `next` 方法的参数
   *
   * 当得到一个生成器对象后, 在调用其 `next` 方法时, 可以传递一个参数, 该参数将作为生成器函数内部
   * '前一个' `yield` 语句的返回值
   *
   * 注意, '前一个' 意味着通过生成器对象第一次调用 `next` 方法时, 传递参数没有意义, 因为第一次调用
   * `next` 方法时, 函数内部没有 '前一个' `yield` 语句
   */
  it("should pass argument to 'next' method of 'generator' object", () => {
    /**
     *
     * @param {number} initValue 初始值
     * @returns {Generator<number, number, number>} 生成器对象:
     * - 该生成器函数将通过`yield` 语句生成 `number` 类型值;
     * - 该生成器函数将通过`return` 语句返回`number` 类型值;
     * - 该生成器函数可以传递给 `yield` 语句 `number` 类型值;
     */
    function* numbers(initValue) {
      const v1 = yield initValue;
      const v2 = yield v1 + (initValue + 1);
      const v3 = yield v2 + (initValue + 2);
      return v3 + (initValue + 3);
    }

    const it = numbers(1);
    expect(it.next()).to.satisfy(r => !r.done && r.value === 1);  // 由 `yield initValue` 语句返回, 此时 `next` 方法参数无意义
    expect(it.next(2)).to.satisfy(r => !r.done && r.value === 4); // 将 `v1` 的值设置为 `2`, 由 `yield v1 + (initValue + 1)` 语句返回
    expect(it.next(3)).to.satisfy(r => !r.done && r.value === 6); // 将 `v2` 的值设置为 `3`, 由 `yield v2 + (initValue + 2)` 语句返回
    expect(it.next(4)).to.satisfy(r => r.done && r.value === 8);  // 将 `v3` 的值设置为 `4`, 由 `return v3 + (initValue + 3)` 语句返回, `done` 为 `true`
  });

  /**
   * 测试生成器对象的 `for..of` 循环
   *
   * 生成器对象本身具备迭代器特性, 故可以通过 `for..of` 循环访问, 每次访问, 生成器函数执行依次 `yield` 语句
   */
  it("should iterate 'generator' object", () => {
    /**
     * 返回 `[min, max)` 区间内的值的生成器对象
     *
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @param {number} step 步进值
     * @returns {Generator<number, void, unknown>} 返回生成器对象
     */
    function* xrange(min, max, step = 1) {
      while (min < max) {
        yield min;
        min += step;
      }
    }

    // 调用生成器函数, 返回生成器对象
    const it = xrange(1, 5);

    // 测试通过 `for..of` 循环访问生成器对象
    let values = [];
    for (const v of it) {
      values.push(v);
    }
    expect(values).to.deep.eq([1, 2, 3, 4]);

    // 测试其它访问生成器对象的语法特性

    // 测试元素展开语法, 将生成器对象展开为数组
    values = [...xrange(1, 5)];
    expect(values).to.deep.eq([1, 2, 3, 4]);

    // 测试 `Array.from` 函数, 将生成器对象转换为数组
    values = Array.from(xrange(1, 5));
    expect(values).to.deep.eq([1, 2, 3, 4]);

    // 测试将生成器对象结构到变量中
    const [a, b, c, d] = xrange(1, 5);
    expect(a).to.eq(1);
    expect(b).to.eq(2);
    expect(c).to.eq(3);
    expect(d).to.eq(4);
  });

  /**
   * 测试生成器对象为对象添加迭代器
   */
  it("should add 'generator' function as iterator to object", () => {
    // 定义生成器对象
    const obj = {
      /**
       * 为对象的迭代器定义生成器方法
       *
       * 相当于
       *
       * ```js
       * const obj = {
       *   [Symbol.iterator]: function* () {
       *     yield 1;
       *     yield 2;
       *     yield 3;
       *   },
       * };
       * ```
       *
       * @returns {Generator<number, void, unknown>} 生成器对象
       * ```
       */
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
      },
    };

    // 测试生成器对象为对象添加迭代器
    const values = [...obj];
    expect(values).to.deep.eq([1, 2, 3]);
  });

  /**
   * 测试为生成器函数内部抛出异常
   *
   * 调用生成器对象的 `throw` 方法, 可以在生成器函数内部抛出异常, 根据生成器函数内部是否捕获了异常,
   * 后续有两种可能性发生
   */
  describe("should throw exception in 'generator' function", () => {
    /**
     * 生成器函数
     *
     * @returns {Generator<number, Error, unknown>} 生成器对象
     */
    function* generator(doCache) {
      if (doCache) {
        // 函数内部捕获异常的情况
        try {
          yield 1;

          // 在完成上一次 `yield` 后, 会令该函数强制抛出异常, 不会执行后续代码
          expect.fail();
        } catch (e) {
          return e;
        }
      } else {
        // 函数内部不捕获异常的情况
        yield 1;

        // 在完成上一次 `yield` 后, 会令该函数强制抛出异常, 不会执行后续代码
        expect.fail();
      }
    }

    /**
     * 测试在函数内部捕获了异常, 且捕获后通过 `yield` 或 `return` 继续返回下一个值
     */
    it('if exception catches', () => {
      let it = generator(true);
      expect(it.next()).to.satisfy(r => !r.done && r.value === 1);

      const r = it.throw(new Error('stop'));
      expect(r.done).is.true;
      expect(r.value.message).to.eq('stop');
    });

    /**
     * 测试在函数内部不捕获异常, 令异常传递到外部
     */
    it('if exception not catches', () => {
      let it = generator(false);
      expect(it.next()).to.satisfy(r => !r.done && r.value === 1);

      expect(() => it.throw(new Error('stop'))).to.throw('stop');
    });
  });

  /**
   * 测试令生成器函数返回指定值
   *
   * 通过生成器对象的 `return` 方法, 可以强制生成器函数退出并返回指定值, 之后的代码不会再执行
   */
  it("should make generator function 'return' given values", () => {
    /**
     * 定义生成器函数, 返回一个生成器对象
     *
     * @returns {Generator<1 | 2, number, unknown>} 生成器对象
     */
    function* generator() {
      yield 1;

      // 在完成上一次 `yield` 后, 会令该函数强制返回, 不会执行后续代码
      expect.fail();
    }

    // 执行函数, 获取生成器对象
    const it = generator();
    // 执行生成器函数的第一个 `yield`
    expect(it.next()).to.satisfy(r => !r.done && r.value === 1);

    // 通过生成器对象执行 `return` 方法, 强制生成器函数退出并返回值
    const r = it.return(100);

    // 确认当生成器函数退出后, 生成器对象结束迭代
    expect(r.done).is.true;
    expect(r.value).to.eq(100);
  });
});
