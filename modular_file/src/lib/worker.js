const { workerData, parentPort, isMainThread } = require('worker_threads');
const buffer = require('./buffer.js');

const { Unit } = buffer;

if (!isMainThread) {
  parentPort.postMessage(execute(workerData));
}

function execute(wd) {
  let result = null;
  switch (wd.name) {
  case 'index_marshal':
    result = indexMarshal(wd.args);
    break;
  case 'index_unmarshal':
    result = indexUnmarshal(wd.args);
    break;
  case 'data_marshal:json':
    result = dataMarshalJson(wd.args);
    break;
  case 'data_unmarshal:json':
    result = dataUnmarshalJson(wd.args);
    break;
  case 'data_marshal:array':
    result = dataMarshalArray(wd.args);
    break;
  case 'data_unmarshal:array':
    result = dataUnmarshalArray(wd.args);
    break;
  }
  return result;
}

function dataMarshalArray(args) {
  let buf;
  switch (args.type) {
  case 'int32':
    buf = buffer.fromIntArray(args.data);
    break;
  case 'int64':
    buf = buffer.fromInt64Array(args.data);
    break;
  case 'float':
    buf = buffer.fromFloatArray(args.data);
    break;
  case 'double':
    buf = buffer.fromDoubleArray(args.data);
    break;
  case 'string':
    buf = buffer.fromShortStringArray(args.data);
    break;
  default:
    throw new Error('invalid array item datatype');
  }
  return buf;
}

function dataUnmarshalArray(args) {
  const buf = Buffer.from(args.buffer);
  switch (args.type) {
  case 'int32':
    return buffer.toIntArray(buf);
  case 'int64':
    return buffer.toInt64Array(buf);
  case 'float':
    return buffer.toFloatArray(buf);
  case 'double':
    return buffer.toDoubleArray(buf);
  case 'string':
    return buffer.toShortStringArray(buf);
  default:
    throw new Error('invalid array item datatype');
  }
}

function dataMarshalJson(args) {
  return JSON.stringify(args.data);
}

function dataUnmarshalJson(args) {
  const buffer = Buffer.from(args.buffer);
  return JSON.parse(buffer.toString('utf-8'));
}

function indexMarshal(args) {
  function marshalNodes(nodes) {
    return Buffer.concat(nodes.map(n => Buffer.concat([
      buffer.fromShortString(n.key),
      buffer.fromByte(n.type),
      buffer.fromUInt(n.position, n.length),
    ])));
  }

  return Buffer.concat([
    buffer.fromByte(args.type),
    marshalNodes(args.nodes),
  ]);
}

function indexUnmarshal(args) {
  const data = Buffer.from(args.data);
  let off = 0;

  const type = data.readUint8(off);
  off += Unit.int8;

  const nodes = [];
  while (off < data.length) {
    const len = data.readUint16BE(off);
    off += Unit.int16;

    let key = '';
    if (len > 0) {
      key = data.toString('utf-8', off, off + len);
      off += len;
    }

    const type = data.readUint8(off);
    off += Unit.int8;

    const position = data.readUint32BE(off);
    off += Unit.int32;

    const length = data.readUint32BE(off);
    off += Unit.int32;

    nodes.push({
      type: type,
      key: key,
      position: position,
      length: length,
    });
  }

  return {
    type: type,
    nodes: nodes
  };
}

module.exports = { execute };
