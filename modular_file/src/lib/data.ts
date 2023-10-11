/* eslint-disable @typescript-eslint/no-explicit-any */
import { PathLike } from 'fs';
import { Index, MediaType } from './_index';
import { Context } from './context';
import { executeAsync } from './utils';
import fs from 'fs';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import { MarshalResult, NoIndexMarshalResult, Serializable } from './type';

export abstract class Data implements Serializable {
  private ctx: Context;

  constructor(context: Context) {
    this.ctx = context;
  }

  protected get context(): Context {
    return this.ctx;
  }

  get hasIndex(): boolean {
    return false;
  }

  abstract marshal(position: number): Promise<MarshalResult | NoIndexMarshalResult>;
  abstract unmarshal(position: number, length: number): Promise<void>;
}

export class JSONData extends Data {
  private _data: Record<string, any>;

  constructor(context: Context, data?: Record<string, any>) {
    super(context);
    this._data = data ?? {};
  }

  get data(): Record<string, any> {
    return this._data;
  }

  async marshal(position: number): Promise<MarshalResult | NoIndexMarshalResult> {
    const buf = await executeAsync<Uint8Array, Buffer>('data_marshal:json', { data: this.data }, data => Buffer.from(data));
    await this.context.io.write(buf, position);
    return {
      dataLength: buf.length
    };
  }

  async unmarshal(position: number, length: number): Promise<void> {
    const buf = await this.context.io.read(position, length);
    return executeAsync<Record<string, any>, void>('data_unmarshal:json', { buffer: buf }, data => this._data = data);
  }
}

// 数据集合类型
export enum DataType {
  int32 = 0x1,
  int64 = 0x2,
  float = 0x10,
  double = 0x11,
  string = 0x100,
  datetime = 0x200,
}

function dataByType(data: string, type: DataType): unknown {
  switch (type) {
  case DataType.int32:
  case DataType.int64:
    return parseInt(data);
  case DataType.float:
  case DataType.double:
    return parseFloat(data);
  default:
    return data;
  }
}

export declare type ArrayType = number[] | string[] | bigint[];

export class ArrayData extends Data {
  private _data: ArrayType;
  private _dataType: DataType;

  constructor(context: Context, dataType: DataType, data?: ArrayType) {
    super(context);
    this._dataType = dataType;
    this._data = data ?? [];
  }

  get data(): ArrayType {
    return this._data;
  }

  async marshal(position: number): Promise<MarshalResult | NoIndexMarshalResult> {
    if (!this._data || this._data.length === 0) {
      return {
        dataLength: 0
      };
    }

    const buf = await executeAsync<Uint8Array, Buffer>(
      'data_marshal:array',
      {
        type: DataType[this._dataType],
        typeValue: this._dataType,
        data: this._data,
      },
      data => Buffer.from(data)
    );

    await this.context.io.write(buf, position);
    return {
      dataLength: buf.length
    };
  }

  async unmarshal(position: number, length: number): Promise<void> {
    const buf = await this.context.io.read(position, length);

    this._dataType = buf.readInt32BE() as DataType;
    return executeAsync<ArrayType, void>(
      'data_unmarshal:array',
      {
        type: DataType[this._dataType],
        offset: 4,
        buffer: buf,
      },
      data => this._data = data
    );
  }
}

export declare type CSVOptions = {
  filename: PathLike;
  indexColumn: string;
  defaultColumnType: DataType;
  columnTypes: Record<string, DataType>;
};

export class CSVData extends Data {
  private index?: Index;
  private cols?: Map<string, ArrayData>;

  constructor(context: Context, csvOptions?: CSVOptions) {
    super(context);
    if (csvOptions) {
      this.readCsv(csvOptions);
    }
  }

  private async readCsv(options: CSVOptions): Promise<void> {
    const parser = fs
      .createReadStream(options.filename)
      .pipe(parse({ delimiter: ',', columns: true, skip_empty_lines: true }));

    const cols = new Map<string, ArrayData>();

    parser.on('readable', () => {
      let columns: string[] | null = null;
      let row: string[];
      while ((row = parser.read())) {
        if (!row) {
          break;
        }
        if (!columns) {
          columns = row;
        } else {
          row.forEach((val, n) => {
            const col = cols[n];
            if ()
          });
        }
      }
    });

    await finished(parser);
  }

  async marshal(position: number): Promise<MarshalResult | NoIndexMarshalResult> {
    const startPos = position;
    position += this.index!.byteLength();

    this.index = new Index(this.context, MediaType.CSV);

    this.cols!.forEach(async (val, key) => {
      const res = await val.marshal(position);
      this.index!.addNode(position, res.dataLength, key);
      position += len;
    });

    const len = await this.index!.marshal(startPos);
    return {
      indexLength: len,
      dataLength: position - startPos - len
    };
  }

  async unmarshal(position: number, length: number): Promise<void> {
    this.index = new Index(this.context);
    await this.index.unmarshal(position, length);
  }
}
