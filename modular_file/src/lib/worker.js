const { workerData, parentPort, isMainThread } = require('worker_threads');
const buffer = require('./buffer.js');

if (!isMainThread) {
  let result = null;
  switch (workerData.name) {
  case 'index_marshal':
    result = indexMarshal(workerData.args);
    break;
  case 'index_unmarshal':
    result = indexUnmarshal(workerData.args);
    break;
  case 'data_marshal:json':
    result = dataMarshalJson(workerData.args);
    break;
  case 'data_unmarshal:json':
    result = dataUnmarshalJson(workerData.args);
    break;
  case 'data_marshal:array':
    result = dataMarshalArray(workerData.args);
    break;
  case 'data_unmarshal:array':
    result = dataUnmarshalArray(workerData.args);
    break;
  }
  parentPort.postMessage(result);
}

function dataMarshalArray(args) {
  let buf;
  switch (args.type) {
  case 'int32':
    buf = buffer.fromIntArray(args.data, 4);
    break;
  case 'int64':
    buf = buffer.fromInt64Array(args.data, 4);
    break; 
  case 'float':
    buf =  buffer.fromFloatArray(args.data, 4);
    break;
  case 'double':
    buf =  buffer.fromDoubleArray(args.data, 4);
    break;
  case 'string':
    buf =  buffer.fromStringArray(args.data, 4);
    break;
  default:
    throw new Error('invalid array element datatype');
  }
  buf.writeInt32BE(args.typeValue, 0);
  return buf;
}

function dataUnmarshalArray(args) {
  const data = Buffer.from(args.data);
  switch (args.type) {
  case 'int32':
    return buffer.toIntArray(data, args.offset);
  case 'int64':
    return buffer.toInt64Array(data, args.offset);
  case 'float':
    return buffer.toFloatArray(data, args.offset);
  case 'double':
    return buffer.toDoubleArray(data, args.offset);
  case 'string':
    return buffer.toStringArray(data, args.offset);
  default:
    throw new Error('invalid array element datatype');
  }
}

function dataMarshalJson(args) {
  return JSON.stringify(args.data);
}

function dataUnmarshalJson(args) {
  const b = Buffer.from(args.data);
  return JSON.parse(b.toString());
}

function indexMarshal(args) {
  function marshalElement(elems) {
    return Buffer.concat(elems.map(e => Buffer.concat([
      buffer.fromString(e.key),
      buffer.fromInt(e.offset, e.length),
    ])));
  }

  return Buffer.concat([
    buffer.fromInt(args.type),
    buffer.fromString(args.name),
    marshalElement(args.elements),
  ]);
}

function indexUnmarshal(args) {
  const data = Buffer.from(args.data);
  let off = 0;

  const type = data.readInt32BE(off);
  off += 4;

  const nameLen = data.readInt32BE(off);
  off += 4;

  const name = data.toString('utf-8', off, off + nameLen);
  off += nameLen;

  const elems = [];
  while (off < data.length) {
    const len = data.readInt32BE(off);
    off += 4;

    let key = '';
    if (len > 0) {
      key = data.toString('utf-8', off, off + len);
      off += len;
    }

    const offset = data.readInt32BE(off);
    off += 4;

    const length = data.readInt32BE(off);
    off += 4;

    elems.push({
      key: key,
      offset: offset,
      length: length,
    });
  }

  return {
    type: type,
    name: name,
    elements: elems
  };
}
