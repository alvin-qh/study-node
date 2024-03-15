import { expect } from 'chai';
import * as dfd from 'danfojs-node';

/**
 * 测试创建 Danfo 对象
 */
describe('Test create danfo object', () => {
  /**
   * 从数组创建
   */
  it('should create from json', () => {
    const s = new dfd.Series([1, 3, 5, undefined, 6, 8]);
    s.print();

    //
    expect(s.dtype).is.eq('float32');
    expect(s.size).is.eq(6);
    expect(s.shape).is.deep.eq([6, 1]);
  });
});
