import { expect } from 'chai';

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

    // 通过一个特殊 Symbol 获取数组迭代器对象
    const elem = arr[Symbol.iterator]();
    expect(elem).is.ok;

    // 获取迭代器的下一个元素, 返回 { value: 1, done: false }
    let e = elem.next();
    expect(e.value).to.eq(1); // 获取下一个元素的值
    expect(e.done).is.false;  // 获取是否完成迭代

    // 将迭代器剩余元素放入一个数组
    const cp = [...elem];
    expect(cp).to.deep.eq([2, 3, 4, 5]);

    // 此时迭代器已完成迭代, 继续获取下一个元素, 返回 { value: undefined, done: true } 结果
    e = elem.next();
    expect(e.value).is.undefined;
    expect(e.done).is.true;
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
       * 通过特殊 Symbol 设置类迭代器方法, 返回迭代器对象
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
});
