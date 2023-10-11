/**
 * 从整数数组产生 `Buffer` 对象
 * 
 * @param {number[]} vals 包含 int32 整数值的数组
 * @param {number} offset 偏移量
 * @returns {Buffer} 包含数组内容的 Buffer 对象
 */
function fromIntArray(vals, offset = 0) {
  const buf = Buffer.allocUnsafe(vals.length * 4 + offset);
  vals.reduce((offset, n) => buf.writeInt32BE(n, offset), offset);
  return buf;
}

/**
 * 将 `Buffer` 中的内容转换为整数数组
 * 
 * @param {Buffer} buf 包含数组数据的 `Buffer` 对象
 * @param {number} offset 偏移量
 * @returns {number[]} 整数数组
 */
function toIntArray(buf, offset = 0) {
  const data = new Array((buf.length - offset) / 4);
  for (let i = 0; i < data.length; i++) {
    data[i] = buf.readInt32BE(offset);
    offset += 4;
  }
  return data;
}

/**
 * 从整数数组产生 `Buffer` 对象
 * 
 * @param {number[]} vals 包含 int64 整数值的数组
 * @param {number} offset 偏移量
 * @returns {Buffer} 包含数组内容的 Buffer 对象
 */
function fromInt64Array(vals, offset = 0) {
  const buf = Buffer.allocUnsafe(vals.length * 8 + offset);
  vals.reduce((offset, n) => buf.writeBigInt64BE(BigInt(n), offset), offset);
  return buf;
}

/**
 * 将 `Buffer` 中的内容转换为 `int64` 整数数组
 * 
 * @param {Buffer} buf 包含数组数据的 `Buffer` 对象
 * @param {number} offset 偏移量
 * @returns {number[]} `int64` 整数数组
 */
function toInt64Array(buf, offset = 0) {
  const data = new Array((buf.length - offset) / 8);
  for (let i = 0; i < data.length; i++) {
    data[i] = Number(buf.readBigInt64BE(offset));
    offset += 8;
  }
  return data;
}

/**
 * 从 32位 浮点数数组产生 `Buffer` 对象
 * 
 * @param {number[]} vals 包含 float 浮点数的数组
 * @param {number} offset 偏移量
 * @returns {Buffer} 包含数组内容的 Buffer 对象
 */
function fromFloatArray(vals, offset = 0) {
  const buf = Buffer.allocUnsafe(vals.length * 4 + offset);
  vals.reduce((offset, n) => buf.writeFloatBE(n, offset), offset);
  return buf;
}

/**
 * 将 `Buffer` 中的内容转换为浮点数数组
 * 
 * @param {Buffer} buf 包含数组数据的 `Buffer` 对象
 * @param {number} offset 偏移量
 * @returns {number[]} 浮点数数组
 */
function toFloatArray(buf, offset = 0) {
  const data = new Array((buf.length - offset) / 4);
  for (let i = 0; i < data.length; i++) {
    data[i] = buf.readFloatBE(offset);
    offset += 4;
  }
  return data;
}

/**
 * 从 64 位浮点数数组产生 `Buffer` 对象
 * 
 * @param {number[]} vals 包含 float 浮点数的数组
 * @param {number} offset 偏移量
 * @returns {Buffer} 包含数组内容的 Buffer 对象
 */
function fromDoubleArray(vals, offset = 0) {
  const buf = Buffer.allocUnsafe(vals.length * 8 + offset);
  vals.reduce((offset, n) => buf.writeDoubleBE(n, offset), offset);
  return buf;
}

/**
 * 将 `Buffer` 中的内容转换为 64位 浮点数数组
 * 
 * @param {Buffer} buf 包含数组数据的 `Buffer` 对象
 * @param {number} offset 偏移量
 * @returns {number[]} 浮点数数组
 */
function toDoubleArray(buf, offset = 0) {
  const data = new Array((buf.length - offset) / 8);
  for (let i = 0; i < data.length; i++) {
    data[i] = buf.readDoubleBE(offset);
    offset += 8;
  }
  return data;
}

/**
 * 将整数值转为 `Buffer` 对象
 * 
 * @param {number[]} n `int` 值
 * @returns {Buffer} `Buffer` 对象
 */
function fromInt(...n) {
  return fromIntArray(n);
}

/**
 * @param {string} s 
 * @returns {Buffer[]}
 */
function _fromString(s) {
  if (!s) {
    return [fromInt(0)];
  }
  const sb = Buffer.from(s, 'utf-8');
  // 前 4 字节为字符串长度, 紧跟字符串内容
  return [fromInt(sb.length), sb];
}

/**
 * 将字符串转为 `Buffer` 对象
 * 
 * @param {string} s 字符串
 * @returns {Buffer} `Buffer` 对象
 */
function fromString(s) {
  return Buffer.concat(_fromString(s));
}

/**
 * 将字符串数组转为 `Buffer` 对象
 * 
 * @param {string[]} vals 字符串数组
 * @returns {Buffer} `Buffer` 对象
 */
function fromStringArray(vals, offset = 0) {
  if (offset === 0) {
    return Buffer.concat(vals.flatMap(s => _fromString(s)));
  }
  return Buffer.concat([fromInt(offset)].concat(vals.flatMap(s => _fromString(s))));
}

/**
 * 将 `Buffer` 对象转为字符串
 * 
 * @param {Buffer} buf `Buffer` 对象
 * @param {number} offset 偏移量
 * @returns {string} 字符串
 */
function toString(buf, offset = 0) {
  const len = buf.readInt32BE(offset);
  if (len === 0) {
    return '';
  }
  offset += 4;
  return buf.toString('utf-8', offset, offset + len);
}

/**
 * 将 `Buffer` 对象转为字符串数组
 * 
 * @param {Buffer} buf `Buffer` 对象
 * @param {number} offset 偏移量
 * @returns {string[]} 字符串数组
 */
function toStringArray(buf, offset = 0) {
  const s = [];
  while (offset < buf.length) {
    const len = buf.readInt32BE(offset);
    offset += 4;

    s.push(buf.toString('utf-8', offset, offset + len));
    offset += len;
  }
  return s;
}

module.exports = {
  fromIntArray,
  toIntArray,
  fromInt,
  toInt64Array,
  fromFloatArray,
  fromDoubleArray,
  toFloatArray,
  toDoubleArray,
  fromInt64Array,
  fromString,
  fromStringArray,
  toString,
  toStringArray,
};
