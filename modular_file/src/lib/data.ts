/* eslint-disable @typescript-eslint/no-explicit-any */
import { Data, DataElementType, DataType } from './type';
import { executeAsync } from './utils';

export class JSONData implements Data<Record<string, any>> {
  private data: Record<string, any>;

  constructor(data?: Record<string, any>) {
    this.data = data ?? {};
  }

  get type(): DataType {
    return 'json';
  }

  async marshal(): Promise<Buffer> {
    return executeAsync<Uint8Array, Buffer>('data_marshal:json', { data: this.data }, data => Buffer.from(data));
  }

  async unmarshal(data: Buffer): Promise<void> {
    return executeAsync<Record<string, any>, void>('data_unmarshal:json', { data: data }, data => this.data = data);
  }

  get content(): Record<string, any> {
    return this.data;
  }
}

type ArrayDataType = number[] | string[] | bigint[];

export class ArrayData implements Data<ArrayDataType> {
  private data: ArrayDataType;
  private elementType: DataElementType;

  constructor(elementType: DataElementType, data?: ArrayDataType) {
    this.elementType = elementType;
    this.data = data ?? [];
  }

  get type(): DataType {
    return 'array';
  }

  async marshal(): Promise<Buffer> {
    if (!this.data) {
      return Buffer.alloc(0);
    }

    return executeAsync<Uint8Array, Buffer>(
      'data_marshal:array',
      {
        type: DataElementType[this.elementType],
        typeValue: this.elementType,
        data: this.data,
      },
      data => Buffer.from(data)
    );
  }

  async unmarshal(data: Buffer): Promise<void> {
    this.elementType = data.readInt32BE() as DataElementType;
    return executeAsync<ArrayDataType, void>(
      'data_unmarshal:array',
      {
        type: DataElementType[this.elementType],
        offset: 4,
        data: data,
      },
      data => this.data = data
    );
  }

  get content(): ArrayDataType {
    return this.data;
  }
}
