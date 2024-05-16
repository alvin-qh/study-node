import { expect } from 'chai';
import * as dfd from 'danfojs-node';

/**
 * 测试创建 Danfo 对象
 */
describe('Test `Series` type', () => {
  /**
   * 从数组创建 `Series` 对象
   */
  it('should create `Series` object from array', () => {
    // 通过数组创建 `Series` 对象
    const s = new dfd.Series([1, 3, 5, undefined, 6, 8]);
    // 输出对象值
    s.print();

    // 获取该 `Series` 对象数据类型
    expect(s.dtype).is.eq('float32');
    // 获取该 `Series` 对象的数据长度
    expect(s.size).is.eq(6);
    // 获取该 `Series` 对象的数据维度
    expect(s.shape).is.deep.eq([6, 1]);

    // 获取该 `Series` 对象的数据值
    expect(s.values).is.deep.eq([1, 3, 5, undefined, 6, 8]);
    // 获取该 `Series` 对象的前 n 个数据值
    expect(s.head(2).values).is.deep.eq([1, 3]);
    // 获取该 `Series` 对象的后 n 个数据值
    expect(s.tail(2).values).is.deep.eq([6, 8]);
  });

  /**
   * 测试 `Series` 对象的比较方法
   */
  it('should compare `Series` object', () => {
    const s1 = new dfd.Series([1, 2, 3, 4, 5]);
    const s2 = new dfd.Series([1, 4, 5, 7, 8]);

    // 和其它类型进行等值比较

    // 和单个值进行等值比较, 返回结果为 `Series` 对象中每个元素和该单个值是否相等的结果集合
    expect(s1.eq(3).values).is.deep.eq([false, false, true, false, false]);
    // 和数组进行等值比较, 如果数组
    expect(() => { s1.eq([1, 2, 3]); }).to.throw('LengthError: length of other must be equal to length of Series');
    expect(s1.eq(s2).values).is.deep.eq([true, false, false, false, false]);
  });
});
