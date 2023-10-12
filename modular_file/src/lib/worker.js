const { workerData, parentPort, isMainThread } = require('worker_threads');
const buffer = require('./buffer.js');

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
    buf = buffer.fromIntArray(args.data, 4);
    break;
  case 'int64':
    buf = buffer.fromInt64Array(args.data, 4);
    break;
  case 'float':
    buf = buffer.fromFloatArray(args.data, 4);
    break;
  case 'double':
    buf = buffer.fromDoubleArray(args.data, 4);
    break;
  case 'string':
    buf = buffer.fromStringArray(args.data, 4);
    break;
  default:
    throw new Error('invalid array item datatype');
  }
  buf.writeInt32BE(args.typeValue, 0);
  return buf;
}

function dataUnmarshalArray(args) {
  const buf = Buffer.from(args.buffer);
  switch (args.type) {
  case 'int32':
    return buffer.toIntArray(buf, args.offset);
  case 'int64':
    return buffer.toInt64Array(buf, args.offset);
  case 'float':
    return buffer.toFloatArray(buf, args.offset);
  case 'double':
    return buffer.toDoubleArray(buf, args.offset);
  case 'string':
    return buffer.toStringArray(buf, args.offset);
  default:
    throw new Error('invalid array item datatype');
  }
}

function dataMarshalJson(args) {
  return JSON.stringify(args.data);
}

function dataUnmarshalJson(args) {
  const buffer = Buffer.from(args.buffer);
  return JSON.parse(buffer.toString());
}

function indexMarshal(args) {
  function marshalNodes(nodes) {
    return Buffer.concat(nodes.map(n => Buffer.concat([
      buffer.fromString(n.key),
      buffer.fromInt(n.position, n.length),
    ])));
  }

  return Buffer.concat([
    buffer.fromInt(args.type),
    marshalNodes(args.nodes),
  ]);
}

function indexUnmarshal(args) {
  const data = Buffer.from(args.data);
  let off = 0;

  const type = data.readInt32BE(off);
  off += 4;

  const nodes = [];
  while (off < data.length) {
    const len = data.readInt32BE(off);
    off += 4;

    let key = '';
    if (len > 0) {
      key = data.toString('utf-8', off, off + len);
      off += len;
    }

    const position = data.readInt32BE(off);
    off += 4;

    const length = data.readInt32BE(off);
    off += 4;

    nodes.push({
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
