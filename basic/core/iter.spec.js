import { expect } from 'chai';

/**
 * 获取给定回调函数的返回值
 *
 * @param {()=>T} fn 返回指定类型值的回调函数
 * @param {T} result 返回值的初始值
 * @returns {T} 由 `fn` 参数回调函数返回的值
 */
function fetchResult(fn, result = undefined) {
  return fn(result);
}

/**
 * 测试迭代器
 */
describe("test 'Iterator'", () => {
  /**
   * 从 `Array` 中获取迭代器对象
   */
  it("should get 'iterator' from 'Array'", () => {
    // 定义数组
    const arr = [1, 2, 3, 4, 5];

    // 通过一个 `Symbol.iterator` 符号属性获取数组迭代器对象
    let it = arr[Symbol.iterator]();
    expect(it).is.ok;

    // 获取迭代器的下一个元素, 返回 { value: 1, done: false }
    let e = it.next();
    expect(e.value).to.eq(1); // 获取下一个元素的值
    expect(e.done).is.false; // 获取是否完成迭代

    // 将迭代器剩余元素放入一个数组
    const cp = [...it];
    expect(cp).to.deep.eq([2, 3, 4, 5]);

    // 此时迭代器已完成迭代, 继续获取下一个元素, 返回 { value: undefined, done: true } 结果
    e = it.next();
    expect(e.value).is.undefined;
    expect(e.done).is.true;

    // 再次获取数组的迭代器对象
    it = arr[Symbol.iterator]();

    // 通过遍历迭代器获取结果
    const result = fetchResult((r) => {
      // 通过 `for ... of` 可以对迭代器进行遍历, 相当于调用迭代器 `next` 方法的语法糖
      for (const e of it) {
        r.push(e);
      }
      return r;
    }, []);

    expect(result).to.deep.eq([1, 2, 3, 4, 5]);
  });

  /**
   * 为类增加迭代器方法
   */
  it('should add iterator into Class', () => {
    /**
     * 定义包含迭代器方法的类
     */
    class Range {
      constructor(min, max, step = 1) {
        this._min = min;
        this._max = max;
        this._step = step;
      }

      /**
       * 通过 `Symbol.iterator` 符号设置类迭代器方法, 返回迭代器对象
       *
       * 迭代器中包含 `next` 方法用于迭代下一个值
       */
      /*
      [Symbol.iterator]() {
        const self = this;
        let cur = this._min;

        // 返回迭代器对象, 包含 next(), return() 以及 throw() 三个方法
        // 注意, 返回为一个新对象, 其内部 this 会发生变化, 需要通过 self 变量桥接或者使用箭头函数避免产生 this
        return {
          next() {
            if (cur < self._max) {
              const val = cur;
              cur += self._step;
              return { done: false, value: val };
            }
            return { done: true };
          },
          return() { // iterator is break
            return { value: undefined, done: true };
          },
          throw() { // iterator raise exception
            return { value: undefined, done: true };
          }
        };
      }
      */

      /**
       * 通过 `Symbol.iterator` 符号设置类迭代器方法
       * 该方法为一个生成器方法, 通过 `yield` 语句返回每次迭代值
       */
      *[Symbol.iterator]() {
        for (let cur = this._min; cur < this._max; cur += this._step) {
          yield cur;
        }
      }
    }

    const range = new Range(1, 10, 2);
    expect([...range]).to.deep.eq([1, 3, 5, 7, 9]);
  });

  /**
   * 为对象增加迭代器方法
   */
  it('should add iterator into object', () => {
    // 定义对象
    const obj = { data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };

    // 通过 `Symbol.iterator` 符号设置对象的迭代器方法
    /*
    Object.defineProperty(obj, Symbol.iterator, {
      value: function () {
        const self = this;
        let cur = 0;

        return {
          next() {
            if (cur >= self.data.length) {
              return { done: true, value: undefined };
            }

            const it = { done: false, value: self.data[cur] };
            cur += 2;
            return it;
          },
        };
      },
    });
    */

    // 通过 `Symbol.iterator` 符号属性设置对象的迭代器方法
    // 通过为 `Symbol.iterator` 符号属性设置生成器函数完成迭代器定义
    Object.defineProperty(obj, Symbol.iterator, {
      value: function* () {
        for (let i = 0; i < this.data.length; i += 2) {
          yield this.data[i];
        }
      },
    });

    // 确认迭代器迭代结果
    expect([...obj]).to.deep.eq([1, 3, 5, 7, 9]);
  });
});

/**
 * 测试异步迭代器
 */
describe("test 'asyncIterator'", () => {
  /**
   * 为类增加异步迭代器方法
   */
  it('should add async iterator into Class', async () => {
    /**
     * 定义包含异步迭代器方法的类
     */
    class AsyncRange {
      constructor(min, max, step = 1) {
        this._min = min;
        this._max = max;
        this._step = step;
      }

      /**
       * 通过特殊 `Symbol.asyncIterator` 设置类迭代器方法, 返回异步迭代器对象
       *
       * 异步迭代器中具备 `async next` 方法, 用于异步迭代
       */
      /*
      [Symbol.asyncIterator]() {
        const self = this;
        let cur = this._min;

        return {
          next() {
            return new Promise(resolve => {
              setTimeout(() => {
                if (cur < self._max) {
                  const val = cur;
                  cur += self._step;
                  resolve({ done: false, value: val });
                } else {
                  resolve({ done: true });
                }
              }, 100);
            });
          },
        };
      }
      */

      /**
       * 通过 `Symbol.asyncIterator` 符号设置类异步迭代器方法
       * 该方法为一个异步生成器方法, 通过 `yield await` 语句异步返回每次迭代值
       */
      async *[Symbol.asyncIterator]() {
        let cur = this._min;
        for (; cur < this._max; cur += this._step) {
          yield await new Promise((resolve) => {
            setTimeout(() => {
              resolve(cur);
            }, 100);
          });
        }
      }
    }

    const result = await fetchResult(async (r) => {
      // 通过 `await (..of)` 语句可以调用异步迭代器进行迭代
      for await (const e of new AsyncRange(1, 10, 2)) {
        r.push(e);
      }
      return r;
    }, []);

    expect(result).to.deep.eq([1, 3, 5, 7, 9]);
  });

  /**
   * 为对象增加异步迭代器方法
   */
  it('should add async iterator into object', async () => {
    // 定义对象
    const obj = { data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };

    // 通过 `Symbol.iterator` 符号设置对象的迭代器方法
    /*
    Object.defineProperty(obj, Symbol.asyncIterator, {
      value: function () {
        const self = this;
        let cur = 0;

        return {
          next() {
            return new Promise(resolve => {
              setTimeout(() => {
                if (cur >= self.data.length) {
                  resolve({ done: true, value: undefined });
                } else {
                  const it = { done: false, value: self.data[cur] };
                  cur += 2;
                  resolve(it);
                }
              }, 100);
            });
          },
        };
      },
    });
    */

    // 通过 `Symbol.iterator` 符号属性设置对象的迭代器方法
    // 通过为 `Symbol.iterator` 符号属性设置生成器函数完成迭代器定义
    Object.defineProperty(obj, Symbol.asyncIterator, {
      value: async function* () {
        for (let n = 0; n < this.data.length; n += 2) {
          yield await new Promise((resolve) => {
            setTimeout(() => {
              resolve(this.data[n]);
            }, 100);
          });
        }
      },
    });

    // 确认迭代器迭代结果
    const result = await fetchResult(async (r) => {
      // 通过 `await (..of)` 语句可以调用异步迭代器进行迭代
      for await (const e of obj) {
        r.push(e);
      }
      return r;
    }, []);

    expect(result).to.deep.eq([1, 3, 5, 7, 9]);
  });
});
