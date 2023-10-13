/**
 * 定义偏移量单位
 */
export declare const Unit = {
  int8 = 1,
  int16 = 2,
  int32 = 4,
  int64 = 8,
  float = 4,
  double = 8,
};

/**
 * 定义偏移量类型
 */
export declare type Offset = {
  count: number,
  unit: Unit,
};

/**
 * 从 8 位整数数组产生 `Buffer` 对象
 *
 * @param vals 包含 int8 整数值的数组
 * @param offset 偏移量
 * @returns 包含数组内容的 Buffer 对象
 */
export declare function fromByteArray(vals: number[], offset: Offset = null): Buffer;

/**
 * 从 16 位整数数组产生 `Buffer` 对象
 *
 * @param vals 包含 int16 整数值的数组
 * @param offset 偏移量
 * @returns 包含数组内容的 Buffer 对象
 */
export declare function fromUShortArray(vals: number[], offset: Offset = null): Buffer;

/**
 * 从 32 位整数数组产生 `Buffer` 对象
 *
 * @param vals 包含 int32 整数值的数组
 * @param offset 偏移量
 * @returns 包含数组内容的 Buffer 对象
 */
export declare function fromIntArray(vals: number[], offset = null): Buffer;

/**
 * 从 32 位整数数组产生 `Buffer` 对象
 *
 * @param vals 包含 int32 整数值的数组
 * @param offset 偏移量
 * @returns 包含数组内容的 Buffer 对象
 */
export declare function fromUIntArray(vals: number[], offset = null): Buffer;

/**
 * 将 `Buffer` 中的内容转换为整数数组
 *
 * @param buf 包含数组数据的 `Buffer` 对象
 * @param offset 偏移量
 * @returns 整数数组
 */
export declare function toIntArray(buf: Buffer, offset: Offset = null): number[];

/**
 * 从整数数组产生 `Buffer` 对象
 *
 * @param vals 包含 int64 整数值的数组
 * @param offset 偏移量
 * @returns 包含数组内容的 Buffer 对象
 */
export declare function fromInt64Array(vals: number[], offset: Offset = null): Buffer;

/**
 * 将 `Buffer` 中的内容转换为 `int64` 整数数组
 *
 * @param buf 包含数组数据的 `Buffer` 对象
 * @param offset 偏移量
 * @returns `int64` 整数数组
 */
export declare function toInt64Array(buf: Buffer, offset: Offset = null): number[];

/**
 * 从 32位 浮点数数组产生 `Buffer` 对象
 *
 * @param vals 包含 float 浮点数的数组
 * @param offset 偏移量
 * @returns 包含数组内容的 Buffer 对象
 */
export declare function fromFloatArray(vals: number[], offset: Offset = null): Buffer;

/**
 * 将 `Buffer` 中的内容转换为浮点数数组
 *
 * @param buf 包含数组数据的 `Buffer` 对象
 * @param offset 偏移量
 * @returns 浮点数数组
 */
export declare function toFloatArray(buf: Buffer, offset: Offset = null): number[];

/**
 * 从 64 位浮点数数组产生 `Buffer` 对象
 *
 * @param vals 包含 float 浮点数的数组
 * @param offset 偏移量
 * @returns 包含数组内容的 Buffer 对象
 */
export declare function fromDoubleArray(vals: number[], offset: Offset = null): Buffer;

/**
 * 将 `Buffer` 中的内容转换为 64位 浮点数数组
 *
 * @param buf 包含数组数据的 `Buffer` 对象
 * @param offset 偏移量
 * @returns 浮点数数组
 */
export declare function toDoubleArray(buf: Buffer, offset: Offset = null): number[];

/**
 * 将 8 位整数值转为 `Buffer` 对象
 *
 * @param n `short` 值集合
 * @returns `Buffer` 对象
 */
export declare function fromByte(...n: number[]): Buffer;

/**
 * 将 16 位整数值转为 `Buffer` 对象
 *
 * @param n `short` 值集合
 * @returns `Buffer` 对象
 */
export declare function fromUShort(...n: number[]): Buffer;

/**
 * 将 32 位整数值转为 `Buffer` 对象
 *
 * @param n `int` 值集合
 * @returns `Buffer` 对象
 */
export declare function fromInt(...n: number[]): Buffer;

/**
 * 将 32 位整数值转为 `Buffer` 对象
 *
 * @param n `uint` 值集合
 * @returns `Buffer` 对象
 */
export declare function fromUInt(...n: number[]): Buffer;

/**
 * 将短字符串转为 `Buffer` 对象
 * 
 * 所谓短字符串, 即长度不得大于 `65534` 个字节
 *
 * @param s 字符串
 * @returns `Buffer` 对象
 */
export declare function fromShortString(s: string): Buffer;

/**
 * 将字符串数组转为 `Buffer` 对象
 *
 * 所谓短字符串, 即长度不得大于 `65534` 个字节
 * 
 * @param vals 字符串数组
 * @param offset 偏移量
 * @returns `Buffer` 对象
 */
export declare function fromShortStringArray(vals: string[], offset: Offset = null): Buffer;

/**
 * 将 `Buffer` 对象转为短字符串
 *
 * 所谓短字符串, 即长度不得大于 `65534` 个字节
 * 
 * @param buf `Buffer` 对象
 * @param offset 偏移量
 * @returns 字符串
 */
export declare function toShortString(buf: Buffer, offset: Offset = null): string;

/**
 * 将 `Buffer` 对象转为短字符串数组
 *
 * 所谓短字符串, 即长度不得大于 `65534` 个字节
 * 
 * @param buf `Buffer` 对象
 * @param offset 偏移量
 * @returns 字符串数组
 */
export declare function toShortStringArray(buf: Buffer, offset: Offset = null): string[];

/**
 * 将长字符串转为 `Buffer` 对象
 * 
 * 所谓短字符串, 即长度不得大于 `210000000` 个字节
 * 
 * @param s 字符串
 * @returns `Buffer` 对象
 */
export declare function fromLongString(s: string): Buffer;

/**
 * 将 `Buffer` 对象转为长字符串
 * 
 * 所谓短字符串, 即长度不得大于 `210000000` 个字节
 * 
 * @param buf `Buffer` 对象
 * @param offset 偏移量
 * @returns 字符串
 */
export declare function toLongString(buf: Buffer, offset: Offset = null): string;
