/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse } from 'csv-parse';
import fs, { PathLike } from 'fs';
import { finished } from 'stream/promises';
import { Index, MediaType } from './_index';
import { Context } from './context';
import { MarshalResult, NoIndexMarshalResult, Serializable } from './type';
import { computeIfNotExist, executeAsync } from './utils';

/**
 * 所有数据类的超类, 表示一种特定类型的数据
 */
export abstract class Data implements Serializable {
  private ctx: Context;

  constructor(context: Context) {
    this.ctx = context;
  }

  get context(): Context {
    return this.ctx;
  }

  get hasIndex(): boolean {
    return false;
  }

  abstract marshal(position: number): Promise<MarshalResult | NoIndexMarshalResult>;
  abstract unmarshal(position: number, length: number): Promise<void>;
}

/**
 * 表示 JSON 类型数据的类型
 */
export class JSONData extends Data {
  private _data: Record<string, any>;

  constructor(context: Context, data?: Record<string, any>) {
    super(context);
    this._data = data ?? {};
  }

  /**
   * 获取当前对象中包含的 JSON 数据本身
   * 
   * @returns JSON 类型数据
   */
  get data(): Record<string, any> {
    return this._data;
  }

  async marshal(position: number): Promise<MarshalResult | NoIndexMarshalResult> {
    const result = await executeAsync<Uint8Array>('data_marshal:json', { data: this.data });
    await this.context.io.write(Buffer.from(result), position);
    return {
      dataLength: result.length
    };
  }

  async unmarshal(position: number, length: number): Promise<void> {
    const buf = await this.context.io.read(position, length);
    const result = await executeAsync<Record<string, any>>('data_unmarshal:json', { buffer: buf });
    this._data = result;
  }
}

/**
 * `ArrayData` 数据集合类型
 */
export enum DataType {
  int32 = 0x1,
  int64 = 0x2,
  float = 0x10,
  double = 0x11,
  string = 0x100,
  datetime = 0x200,
}

/**
 * 将字符串表示的原始数据类型转为目标类型
 * 
 * @param data 字符串描述的原始数据
 * @param type 要转换的数据类型枚举
 * @returns 转换后的数据结果
 */
function dataByType(data: string, type: DataType): string | number | bigint {
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

/**
 * `ArrayData` 类型实际存储的数据类型
 * 
 * 数组中可存储类型包括: `number`, `string` 和 `bigint` 中的一种
 */
export declare type ArrayType = Array<number | string | bigint>;

/**
 * 数组数据类型, 存储一种特定类型数据的数组
 * 
 * 数组中可存储类型包括: `number`, `string` 和 `bigint` 中的一种
 */
export class ArrayData extends Data {
  private _data: ArrayType;
  private _dataType: DataType;

  constructor(context: Context, dataType: DataType, data?: ArrayType) {
    super(context);
    this._dataType = dataType;
    this._data = data ?? [];
  }

  /**
   * 获取当前对象中存储的数组对象本身
   * 
   * @returns 数组数据类型
   */
  get data(): ArrayType {
    return this._data;
  }

  /**
   * 在当前对象中添加一个数组元素值
   * 
   * @param val 数组元素值
   */
  add(val: ArrayType[0]): void {
    this._data.push(val);
  }

  async marshal(position: number): Promise<MarshalResult | NoIndexMarshalResult> {
    if (!this._data || this._data.length === 0) {
      return {
        dataLength: 0
      };
    }

    const result = await executeAsync<Uint8Array>(
      'data_marshal:array',
      {
        type: DataType[this._dataType],
        typeValue: this._dataType,
        data: this._data,
      }
    );

    await this.context.io.write(Buffer.from(result), position);
    return {
      dataLength: result.length
    };
  }

  async unmarshal(position: number, length: number): Promise<void> {
    const buf = await this.context.io.read(position, length);

    this._dataType = buf.readInt32BE() as DataType;
    const result = await executeAsync<ArrayType>(
      'data_unmarshal:array',
      {
        type: DataType[this._dataType],
        offset: 4,
        buffer: buf,
      }
    );
    this._data = result;
  }
}

/**
 * CSV 类型数据实例化选项
 * 
 * - `filename` 存储 CSV 数据的文件路径名
 * - `indexColumn` 索引列列名
 * - `defaultColumnType` 默认数值类型
 * - `columnTypes` 指定特殊列的数据类型, 未指定的列采用 `defaultColumnType` 定义的默认类型
 */
export declare type CSVOptions = {
  filename: PathLike;
  indexColumn: string;
  defaultColumnType: DataType;
  columnTypes: Record<string, DataType>;
};

/**
 * 用于存储 CSV 数据的类型
 */
export class CSVData extends Data {
  private index?: Index;
  private columnMap?: Map<string, ArrayData>;

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

    const columnMap = new Map<string, ArrayData>();

    parser.on('readable', () => {
      let columns: string[] | null = null;
      let row: string[];
      while ((row = parser.read())) {
        if (!row) {
          break;
        }
        if (columns !== null) {
          const _columns = columns;
          row.forEach((val, n) => {
            const col = _columns[n];
            const dtype = options.columnTypes[col] ?? options.defaultColumnType;
            const array = computeIfNotExist(columnMap, col, () => new ArrayData(this.context, dtype));
            array.add(dataByType(val, dtype));
          });
        } else {
          columns = row;
        }
      }
    });

    await finished(parser);
  }

  async marshal(position: number): Promise<MarshalResult | NoIndexMarshalResult> {
    const startPos = position;
    position += this.index!.byteLength();

    this.index = new Index(this.context, MediaType.CSV);

    this.columnMap!.forEach(async (val, key) => {
      const res = await val.marshal(position);
      this.index!.addNode(position, res.dataLength, key);
      position += len;
    });

    const len = await this.index.marshal(startPos);
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
