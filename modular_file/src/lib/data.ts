/* eslint-disable @typescript-eslint/no-explicit-any */
import * as buffer from './buffer';
import { Data, DataElementType, DataType } from './type';

export class JSONData implements Data<Record<string, any>> {
  private data: Record<string, any>;

  constructor(data?: Record<string, any>) {
    this.data = data ?? {};
  }

  get type(): DataType {
    return 'json';
  }

  marshal(): Buffer {
    return Buffer.from(JSON.stringify(this.data), 'utf-8');
  }

  unmarshal(data: Buffer) {
    this.data = JSONData.bufferToJson(data);
  }

  private static bufferToJson(data: Buffer): Record<string, any> {
    const b = Buffer.from(data);
    return JSON.parse(b.toString());
  }

  get content(): Record<string, any> {
    return this.data;
  }
}

type ArrayDataType = number[] | string[] | bigint[];

export class ArrayData implements Data<ArrayDataType> {
  private data: ArrayDataType;
  private elementType: DataElementType = 'double';

  constructor(elementType: DataElementType, data?: ArrayDataType) {
    this.elementType = elementType;
    this.data = data ?? [];
  }

  get type(): DataType {
    return 'array';
  }

  marshal(): Buffer {
    if (!this.data) {
      return Buffer.alloc(0);
    }

    switch (this.elementType) {
    case 'int32':
      return buffer.fromIntArray(this.data as number[]);
    case 'int64':
      return buffer.fromInt64Array(this.data as number[]);
    case 'float':
      return buffer.fromFloatArray(this.data as number[]);
    case 'double':
      return buffer.fromDoubleArray(this.data as number[]);
    case 'string':
      return buffer.fromStringArray(this.data as string[]);
    default:
      throw new Error('invalid array element datatype');
    }
  }

  unmarshal(data: Buffer): void {
    switch (this.elementType) {
    case 'int32':
      this.data = buffer.toIntArray(data);
      break;
    case 'int64':
      this.data = buffer.toInt64Array(data);
      break;
    case 'float':
      this.data = buffer.toFloatArray(data);
      break;
    case 'double':
      this.data = buffer.toDoubleArray(data);
      break;
    case 'string':
      this.data = buffer.toStringArray(data);
      break;
    default:
      throw new Error('invalid array element datatype');
    }
  }

  get content(): ArrayDataType {
    return this.data;
  }
}
