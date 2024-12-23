import { expect } from 'chai';

describe("test 'generator' object", () => {
  /**
   * 定义返回可迭代对象的 yield 函数
   */
  function* xrange(min, max, step = 1) {
    while (min < max) {
      yield min;
      min += step;
    }
  }

  it("should create 'generator' object", () => {
    const range = xrange(1, 10);
    expect(typeof range).to.eq('object');

    
  });
});
