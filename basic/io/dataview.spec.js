import { expect } from '@jest/globals';

/**
 * 测试 `DataView` 类
 */
describe("test 'DataView' class", () => {
  /**
   * 测试通过 `DataView` 类对象创建 `ArrayBuffer` 对象的视图
   */
  it("create 'DataView' object from 'Buffer' object", () => {
    const arrayBuf = new ArrayBuffer(14);

    // 确认 `ArrayBuffer` 对象的字节长度
    expect(arrayBuf.byteLength).toEqual(14);

    // 写入 `ArrayBuffer` 对象
    {
      // 基于 `ArrayBuffer` 对象创建 `DataView` 对象
      // 创建 `DataView` 对象时, 可以设置 `byteOffset` 参数以及 `byteLength` 参数, 用于重新定义 `DataView` 相对于 `ArrayBuffer` 对象的范围
      const view = new DataView(arrayBuf /* , 0, buf.byteLength */);

      // 确认生成的 `DataView` 对象的字节长度
      expect(view.byteOffset).toEqual(0);
      expect(view.byteLength).toEqual(14);

      // 通过 `DataView` 在 `ArrayBuffer` 中存储一系列数值
      // 从偏移量 0 字节开始, 写入 2 字节整数, 小端格式
      view.setUint16(0, 0x1234, true);

      // 从偏移量 2 字节开始, 写入 4 字节整数, 大端格式
      view.setUint32(2, 0x12345678, false);

      // 从偏移量 6 字节开始, 写入 8 字节整数, 小端格式
      view.setBigUint64(6, BigInt('0x12345678ABCDEF90'), true);
    }

    // 读取 `ArrayBuffer` 对象
    {
      const view = new DataView(arrayBuf /* , 0, buf.byteLength */);

      // 确认生成的 `DataView` 对象的字节长度
      expect(view.byteOffset).toEqual(0);
      expect(view.byteLength).toEqual(14);

      // 从偏移量 0 字节开始, 读取 2 字节整数, 小端格式
      expect(view.getUint16(0, true)).toEqual(0x1234);

      // 从偏移量 2 字节开始, 读取 4 字节整数, 大端格式
      expect(view.getUint32(2, false)).toEqual(0x12345678);

      // 从偏移量 6 字节开始, 读取 8 字节整数, 小端格式
      expect(view.getBigUint64(6, true).toString(16)).toEqual('12345678abcdef90');
    }

    // 测试通过 `Buffer` 类对象访问 `ArrayBuffer` 对象
    {
      // 通过 `ArrayBuffer` 对象创建 `Buffer` 对象
      const buf = Buffer.from(arrayBuf /* , 0, buf.byteLength */);

      // 确认生成的 `Buffer` 对象的字节长度
      expect(buf.byteOffset).toEqual(0);
      expect(buf.length).toEqual(14);

      // 从偏移量 0 开始, 读取 2 字节整数
      expect(buf.readUint16LE(0)).toEqual(0x1234);

      // 从偏移量 2 开始, 读取 4 字节整数
      expect(buf.readUint32BE(2)).toEqual(0x12345678);

      // 从偏移量 6 开始, 读取 8 字节整数
      expect(buf.readBigUInt64LE(6).toString(16)).toEqual('12345678abcdef90');
    }
  });
});
