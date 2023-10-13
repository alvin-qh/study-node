/**
 * 定义数据长度
 */
const Unit = {
  int8: 1,
  int16: 2,
  int32: 4,
  int64: 8,
  float: 4,
  double: 8,
};

/**
 * @param {Offset} offset
 * @returns {number}
 */
function _offset(offset) {
  return offset ? (offset.unit * offset.count) : 0;
}

/**
 * @param {number[]} vals 
 * @param {Offset} offset 
 * @returns {Buffer}
 */
function fromByteArray(vals, offset = null) {
  const off = _offset(offset);
  const buf = Buffer.allocUnsafe(vals.length * Unit.int8 + off);
  vals.reduce((off, n) => buf.writeUint8(n, off), off);
  return buf;
}

/**
 * @param {number[]} vals 
 * @param {Offset} offset 
 * @returns {Buffer}
 */
function fromUShortArray(vals, offset = null) {
  const off = _offset(offset);
  const buf = Buffer.allocUnsafe(vals.length * Unit.int16 + off);
  vals.reduce((off, n) => buf.writeUint16BE(n, off), off);
  return buf;
}

/**
 * @param {number[]} vals 
 * @param {Offset} offset 
 * @returns {Buffer}
 */
function fromIntArray(vals, offset = null) {
  const off = _offset(offset);
  const buf = Buffer.allocUnsafe(vals.length * Unit.int32 + off);
  vals.reduce((off, n) => buf.writeInt32BE(n, off), off);
  return buf;
}

/**
 * @param {number[]} vals 
 * @param {Offset} offset 
 * @returns {Buffer}
 */
function fromUIntArray(vals, offset = null) {
  const off = _offset(offset);
  const buf = Buffer.allocUnsafe(vals.length * Unit.int32 + off);
  vals.reduce((off, n) => buf.writeUint32BE(n, off), off);
  return buf;
}

/**
 * @param {Buffer} buf 
 * @param {Offset} offset 
 * @returns {number[]}
 */
function toIntArray(buf, offset = null) {
  let off = _offset(offset);
  const data = new Array((buf.length - off) / Unit.int32);
  for (let i = 0; i < data.length; i++) {
    data[i] = buf.readInt32BE(off);
    off += 4;
  }
  return data;
}

/**
 * @param {number[]} vals 
 * @param {Offset} offset 
 * @returns {Buffer}
 */
function fromInt64Array(vals, offset = null) {
  const off = _offset(offset);
  const buf = Buffer.allocUnsafe(vals.length * Unit.int64 + off);
  vals.reduce((off, n) => buf.writeBigInt64BE(BigInt(n), off), off);
  return buf;
}

/**
 * @param {Buffer} buf
 * @param {Offset} offset 
 * @returns {number[]}
 */
function toInt64Array(buf, offset = null) {
  let off = _offset(offset);
  const data = new Array((buf.length - off) / Unit.int64);
  for (let i = 0; i < data.length; i++) {
    data[i] = Number(buf.readBigInt64BE(off));
    off += Unit.int64;
  }
  return data;
}

/**
 * @param {number[]} vals 
 * @param {Offset} offset 
 * @returns {Buffer}
 */
function fromFloatArray(vals, offset = null) {
  const off = _offset(offset);
  const buf = Buffer.allocUnsafe(vals.length * Unit.float + off);
  vals.reduce((off, n) => buf.writeFloatBE(n, off), off);
  return buf;
}

/**
 * @param {Buffer} buf
 * @param {Offset} offset 
 * @returns {number[]}
 */
function toFloatArray(buf, offset = null) {
  let off = _offset(offset);
  const data = new Array((buf.length - off) / Unit.float);
  for (let i = 0; i < data.length; i++) {
    data[i] = buf.readFloatBE(off);
    off += Unit.float;
  }
  return data;
}

/**
 * @param {number[]} vals 
 * @param {Offset} offset 
 * @returns {Buffer}
 */
function fromDoubleArray(vals, offset = null) {
  const off = _offset(offset);
  const buf = Buffer.allocUnsafe(vals.length * Unit.double + off);
  vals.reduce((off, n) => buf.writeDoubleBE(n, off), off);
  return buf;
}

/**
 * @param {Buffer} buf
 * @param {Offset} offset 
 * @returns {number[]}
 */
function toDoubleArray(buf, offset = null) {
  let off = _offset(offset);
  const data = new Array((buf.length - off) / Unit.double);
  for (let i = 0; i < data.length; i++) {
    data[i] = buf.readDoubleBE(off);
    off += Unit.double;
  }
  return data;
}

/**
 * @param {number[]} n 
 * @returns {Buffer}
 */
function fromByte(...n) {
  return fromByteArray(n);
}

/**
 * @param {number[]} n 
 * @returns {Buffer}
 */
function fromUShort(...n) {
  return fromUShortArray(n);
}

/**
 * @param {number[]} n 
 * @returns {Buffer}
 */
function fromInt(...n) {
  return fromIntArray(n);
}

/**
 * @param {number[]} n 
 * @returns {Buffer}
 */
function fromUInt(...n) {
  return fromUIntArray(n);
}

/**
 * @param {string} s 
 * @param {(...n: number[])=>Buffer} lenFn
 * @returns {Buffer[]}
 */
function _packstr(s, lenFn) {
  if (!s) {
    return [lenFn(0)];
  }
  const sb = Buffer.from(s, 'utf-8');
  // 前 2 字节为字符串长度, 紧跟字符串内容
  return [lenFn(sb.length), sb];
}

/**
 * @param {string} s
 * @returns {Buffer}
 */
function fromShortString(s) {
  return Buffer.concat(_packstr(s, fromUShort));
}

/**
 * @param {string[]} vals
 * @param {Offset} offset
 * @returns {Buffer}
 */
function fromShortStringArray(vals, offset = null) {
  const off = _offset(offset);
  if (off === 0) {
    return Buffer.concat(vals.flatMap(s => _packstr(s, fromUShort)));
  }
  return Buffer.concat([Buffer.allocUnsafe(off)].concat(vals.flatMap(s => _packstr(s, fromUShort))));
}

/**
 * @param {Buffer} buf
 * @param {Offset} offset 
 * @returns {string}
 */
function toShortString(buf, offset = null) {
  let off = _offset(offset);
  const len = buf.readUInt16BE(off);
  if (len === 0) {
    return '';
  }
  off += Unit.int16;
  return buf.toString('utf-8', off, off + len);
}

/**
 * @param {Buffer} buf 
 * @param {Offset} offset 
 * @returns {string[]}
 */
function toShortStringArray(buf, offset = null) {
  let off = _offset(offset);

  const s = [];
  while (off < buf.length) {
    const len = buf.readUInt16BE(off);
    off += Unit.int16;

    s.push(buf.toString('utf-8', off, off + len));
    off += len;
  }
  return s;
}

/**
 * @param {string} s
 * @returns {Buffer}
 */
function fromLongString(s) {
  return Buffer.concat(_packstr(s, fromInt));
}

/**
 * @param {Buffer} buf 
 * @param {Offset} offset 
 * @returns {string}
 */
function toLongString(buf, offset = null) {
  let off = _offset(offset);
  const len = buf.readInt32BE(off);
  if (len === 0) {
    return '';
  }
  off += Unit.int32;
  return buf.toString('utf-8', off, off + len);
}


module.exports = {
  Unit,
  fromIntArray,
  fromUIntArray,
  toIntArray,
  fromInt,
  fromUInt,
  fromByte,
  fromUShort,
  toInt64Array,
  fromFloatArray,
  fromDoubleArray,
  toFloatArray,
  toDoubleArray,
  fromInt64Array,
  fromShortString,
  fromShortStringArray,
  toShortString,
  toShortStringArray,
  fromLongString,
  toLongString,
};
