/**
 * 从整数数组产生 `Buffer` 对象
 * 
 * @param vals 包含 int32 整数值的数组
 * @returns 包含数组内容的 Buffer 对象
 */
export function fromIntArray(vals: number[]): Buffer {
  const buf = Buffer.allocUnsafe(vals.length * 4);
  vals.reduce((offset, n) => buf.writeInt32BE(n, offset), 0);
  return buf;
}

/**
 * 将 `Buffer` 中的内容转换为整数数组
 * 
 * @param buf 包含数组数据的 `Buffer` 对象
 * @returns 整数数组
 */
export function toIntArray(buf: Buffer): number[] {
  const data = new Array(buf.length / 4);
  let offset = 0;

  for (let i = 0; i < data.length; i++) {
    data[i] = buf.readInt32BE(offset);
    offset += 4;
  }
  return data;
}

/**
 * 从整数数组产生 `Buffer` 对象
 * 
 * @param vals 包含 int64 整数值的数组
 * @returns 包含数组内容的 Buffer 对象
 */
export function fromInt64Array(vals: number[]): Buffer {
  const buf = Buffer.allocUnsafe(vals.length * 8);
  vals.reduce((offset, n) => buf.writeBigInt64BE(BigInt(n), offset), 0);
  return buf;
}

/**
 * 将 `Buffer` 中的内容转换为 `int64` 整数数组
 * 
 * @param buf 包含数组数据的 `Buffer` 对象
 * @returns `int64` 整数数组
 */
export function toInt64Array(buf: Buffer): number[] {
  const data = new Array(buf.length / 8);
  let offset = 0;

  for (let i = 0; i < data.length; i++) {
    data[i] = Number(buf.readBigInt64BE(offset));
    offset += 8;
  }
  return data;
}

/**
 * 从 32位 浮点数数组产生 `Buffer` 对象
 * 
 * @param vals 包含 float 浮点数的数组
 * @returns 包含数组内容的 Buffer 对象
 */
export function fromFloatArray(vals: number[]): Buffer {
  const buf = Buffer.allocUnsafe(vals.length * 4);
  vals.reduce((offset, n) => buf.writeFloatBE(n, offset), 0);
  return buf;
}

/**
 * 将 `Buffer` 中的内容转换为浮点数数组
 * 
 * @param buf 包含数组数据的 `Buffer` 对象
 * @returns 浮点数数组
 */
export function toFloatArray(buf: Buffer): number[] {
  const data = new Array(buf.length / 4);
  let offset = 0;

  for (let i = 0; i < data.length; i++) {
    data[i] = buf.readFloatBE(offset);
    offset += 4;
  }
  return data;
}

/**
 * 从 64 位浮点数数组产生 `Buffer` 对象
 * 
 * @param vals 包含 float 浮点数的数组
 * @returns 包含数组内容的 Buffer 对象
 */
export function fromDoubleArray(vals: number[]): Buffer {
  const buf = Buffer.allocUnsafe(vals.length * 8);
  vals.reduce((offset, n) => buf.writeDoubleBE(n, offset), 0);
  return buf;
}

/**
 * 将 `Buffer` 中的内容转换为 64位 浮点数数组
 * 
 * @param buf 包含数组数据的 `Buffer` 对象
 * @returns 浮点数数组
 */
export function toDoubleArray(buf: Buffer): number[] {
  const data = new Array(buf.length / 8);
  let offset = 0;

  for (let i = 0; i < data.length; i++) {
    data[i] = buf.readDoubleBE(offset);
    offset += 8;
  }
  return data;
}

function fromInt(n: number): Buffer {
  const b = Buffer.allocUnsafe(4);
  b.writeInt32BE(n);
  return b;
}

export function fromStringArray(vals: string[]): Buffer {
  const bufs = vals.flatMap(s => {
    const sb = Buffer.from(s, 'utf-8');
    return [fromInt(sb.length), sb];
  });
  return Buffer.concat(bufs);
}

export function toStringArray(buf: Buffer): string[] {
  const s: string[] = [];
  for (let offset = 0; offset < buf.length;) {
    const len = buf.readInt32BE(offset);
    offset += 4;

    s.push(buf.toString('utf-8', offset, offset + len));
    offset += len;
  }
  return s;
}
