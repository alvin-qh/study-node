import { expect } from '@jest/globals';

import * as crypto from 'node:crypto';

/**
 * 测试缓存类型
 */
describe("test 'Buffer' class", () => {
  /**
   * 测试将缓存数据转为字符串
   */
  it("should create buffer 'from' string", () => {
    const s = 'Hello 大家好';

    // 通过字符串创建缓冲区
    let buf = Buffer.from(s, 'utf-8');

    // 将缓冲区内容写入数组
    const data = [...buf];

    // 从数组中读取内容形成缓存对象
    buf = Buffer.from(data);

    // 将缓存对象转为字符串, 确认和原字符串相同
    expect(buf.toString('utf-8')).toEqual(s);
  });

  /**
   * 测试向缓冲区依次写入多个字符串
   */
  it("should 'write' multiple strings into 'Buffer' object", () => {
    const buf = Buffer.allocUnsafe(16);

    // 从偏移量 0 字节开始, 写入 4 字节字符串
    let len = buf.write('ABCD', 'utf-8');
    expect(len).toEqual(4);

    // 从偏移量 4 字节开始, 写入 8 字节字符串
    len = buf.write('EFGHIJKL', 4, 'utf-8');
    expect(len).toEqual(8);

    // 从偏移量 12 字节开始, 写入 4 字节字符串
    len = buf.write('WXYZ', 12, 'utf-8');
    expect(len).toEqual(4);

    // 从偏移量 0 字节开始, 读取 8 字节字符串
    expect(buf.toString('utf-8', 0, 8)).toEqual('ABCDEFGH');

    // 从偏移量 8 字节开始, 读取 4 字节字符串
    expect(buf.toString('utf-8', 8, 12)).toEqual('IJKL');

    // 从偏移量 12 字节开始, 读取到缓冲区结束
    expect(buf.toString('utf-8', 12)).toEqual('WXYZ');
  });

  /**
   * 测试向缓冲区依次写入多个字符串
   */
  it("should get 'subarray' from 'Buffer' object", () => {
    // 创建缓冲区对象
    const buf = Buffer.from('ABCDEFGHIJKL', 'utf-8');

    // 从偏移量 8 字节开始, 截取 4 字节内容
    const sub = buf.subarray(8, 14);

    // 确认截取内容正确
    expect(sub.byteLength).toEqual(4);
    expect(sub.toString('utf-8')).toEqual('IJKL');
  });

  /**
   * 测试通过缓存对象读写数据
   */
  it("should 'concat' more buffers into one", () => {
    /**
     * 将字符串写入缓冲区, 缓冲区的内容包括:
     * 1. 前 4 字节为字符串长度
     * 2. 中间部分为字符串本身
     * 3. 结束部分为字符串的散列值
     *
     * @param {string} s 要写入缓冲区的字符串
     * @returns `Buffer` 对象
     */
    function toBuffer(s) {
      // 创建长度为 4 字节的长度缓存对象
      // const b1 = Buffer.alloc(4);
      const b1 = Buffer.allocUnsafe(4);

      // 从字符串创建缓存对象
      const b2 = Buffer.from(s, 'utf-8');

      // 求字符串缓存对象的散列值, 得到散列值缓存对象
      const b3 = crypto.createHash('MD5').update(b2).digest();

      // 将字符串缓存对象的长度写入长度缓存对象
      b1.writeInt32BE(b2.byteLength);

      return Buffer.concat([b1, b2, b3]);
    }

    /**
     * 从缓冲区中读取字符串内容
     *
     * @param {Buffer} buf 缓冲区对象
     * @returns {{str: string, hash: string}} 从缓冲区读取的字符串结果
     */
    function toString(buf) {
      // 从缓存对象中读取前四字节, 为字符串长度
      const len = buf.readInt32BE(0);

      // 从缓存对象中第 5 个字节开始, 按已知长度读取字符串
      const b1 = buf.subarray(4, 4 + len);

      // 从缓存对象中读取字符串之后的散列值
      const b2 = buf.subarray(4 + len);

      return {
        str: b1.toString('utf-8'),
        hash: b2.toString('hex'),
      };
    }

    const s = 'Hello, 大家好';

    // 将字符串转为 `Buffer` 对象, 确认转换后长度
    const buf = toBuffer(s);
    expect(buf.byteLength).toEqual(36);

    // 从 `Buffer` 对象中恢复字符串, 确认转换结果正确
    const { str, hash } = toString(buf);
    expect(str).toEqual(s);
    expect(hash).toEqual('f1b391ef02a8134f5e59c26d0e2bcd9b');
  });

  /**
   * 测试 base64 编码
   */
  it("should encode and decode by 'base64'", () => {
    const data = Buffer.from('Hello, 大家好', 'utf-8');

    // 将缓存对象编码为 base64 字符串
    const b64 = data.toString('base64');

    // 确认编码结果为 base64 字符串
    const match = /^[a-zA-Z0-9+/=]{24}$/.test(b64);
    expect(match).toBeTruthy();

    // 将 base64 字符串进行解码, 得到缓存对象
    const buf = Buffer.from(b64, 'base64');
    expect(buf).toEqual(data);
  });

  /**
   * 像缓冲区对象根据偏移量写入各类数据, 并通过同样的偏移量进行读取
   */
  it("should write binary data into 'Buffer' object based on 'offset'", () => {
    const buf = Buffer.allocUnsafe(24);

    // 从偏移量 0 字节开始, 写入 8 字节整数
    let len = buf.writeBigUint64BE(BigInt('0xAABBCCDDEEFF1122'));
    expect(len).toEqual(8);

    // 从偏移量 8 字节开始, 写入 4 字节整数
    len = buf.writeUInt32BE(0x12345678, 8);
    expect(len).toEqual(12);

    // 从偏移量 12 字节开始, 写入 2 字节整数
    len = buf.writeUInt16BE(0xABCD, 12);
    expect(len).toEqual(14);

    // 从偏移量 14 字节开始, 写入 10 字节字符串
    len = buf.write('Hello Word', 14, 'utf-8');
    expect(len).toEqual(10);

    // 从偏移量 0 字节开始, 读取 8 字节整数
    expect(buf.readBigUInt64BE(0).toString(16)).toEqual('aabbccddeeff1122');

    // 从偏移量 8 字节开始, 读取 4 字节整数
    expect(buf.readUInt32BE(8)).toEqual(0x12345678);

    // 从偏移量 12 字节开始, 读取 2 字节整数
    expect(buf.readUInt16BE(12)).toEqual(0xABCD);

    // 从偏移量 14 字节开始, 读取 10 字节字符串
    expect(buf.subarray(14, 24).toString('utf-8')).toEqual('Hello Word');
  });

  /**
   * 将 `TypeArray` 数组中的数值以字节序列填充到 `Buffer` 对象指定偏移量位置后
   *
   * 注意, `TypedArray` 数组存储数值的字节序无法定义, 会自动遵循当前系统 CPU 的字节序存储数值
   */
  it("should 'write' data into 'Buffer' object by 'TypedArray' object", () => {
    // 初始化 32 字节缓冲区
    const buf = Buffer.allocUnsafe(28);

    // 通过 `TypedArray` 创建 4 字节整数数组, 含 5 项共 20 字节, 从偏移量 0 字节开始, 将 `TypedArray` 数组填充入缓冲区
    const uint32Array = Uint32Array.of(1, 2, 3, 4, 5);
    buf.fill(uint32Array);

    // 通过 `TypedArray` 创建 2 字节整数数组, 含 4 项共 8 字节, 从偏移量 20 字节开始, 将 `TypedArray` 数组填充入缓冲区
    const uint16Array = Uint16Array.of(11, 22, 33, 44);
    buf.fill(uint16Array, uint32Array.byteLength);

    // 从偏移量 0 开始, 按每次 4 字节依次读取 5 个数字
    expect(buf.readUint32LE(0)).toEqual(1);
    expect(buf.readUint32LE(4)).toEqual(2);
    expect(buf.readUint32LE(8)).toEqual(3);
    expect(buf.readUint32LE(12)).toEqual(4);
    expect(buf.readUint32LE(16)).toEqual(5);

    // 从偏移量 20 开始, 按每次 2 字节依次读取 4 个数字
    expect(buf.readUint16LE(uint32Array.byteLength)).toEqual(11);
    expect(buf.readUint16LE(uint32Array.byteLength + 2)).toEqual(22);
    expect(buf.readUint16LE(uint32Array.byteLength + 4)).toEqual(33);
    expect(buf.readUint16LE(uint32Array.byteLength + 6)).toEqual(44);
  });

  /**
   * 对缓冲区内部的数据交换字节序
   *
   * 缓冲区具备 `swap16`, `swap32` 和 `swap64` 三个方法, 用于将缓冲区内容按 2, 4, 8 字节进行大小端转换
   */
  it("should 'swap' buffer data", () => {
    // 分配 16 字节缓冲区对象
    const buf = Buffer.allocUnsafe(16);

    // 向缓冲区内写入 4 个整数, 小端格式
    let n = 0;
    for (let i = 0; i < 4; i++) {
      n = buf.writeUint32LE(i + 1, n);
    }

    // 将缓冲区内容按 4 字节转换为大端格式
    let swapBuf = buf.swap32();
    expect(swapBuf.byteLength).toEqual(16);
    expect(swapBuf.readUInt32BE(0)).toEqual(1);
    expect(swapBuf.readUInt32BE(4)).toEqual(2);
    expect(swapBuf.readUInt32BE(8)).toEqual(3);
    expect(swapBuf.readUInt32BE(12)).toEqual(4);

    // 将缓冲区内容按 4 字节转换为小端格式
    swapBuf = buf.swap32();
    expect(swapBuf.byteLength).toEqual(16);
    expect(swapBuf.readUInt32LE(0)).toEqual(1);
    expect(swapBuf.readUInt32LE(4)).toEqual(2);
    expect(swapBuf.readUInt32LE(8)).toEqual(3);
    expect(swapBuf.readUInt32LE(12)).toEqual(4);
  });
});
