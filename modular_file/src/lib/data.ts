/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse } from 'csv-parse';
import fs, { PathLike } from 'fs';
import { Index, MediaType } from './_index';
import { Context } from './context';
import { DataType, MarshalResult, NoIndexMarshalResult, Serializable } from './type';
import { executeAsync } from './utils';
import { finished } from 'stream/promises';

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
   * @returns 数组数据
   */
  get data(): ArrayType {
    return this._data ?? [];
  }

  /**
   * 获取数组数据长度
   * 
   * @returns 数组数据长度
   */
  get length(): number {
    return this.data.length;
  }

  /**
   * 获取当前对象中存储的数组类型
   * 
   * @returns 数组数据类型
   */
  get type(): DataType {
    return this._dataType;
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
    const result = await executeAsync<ArrayType>(
      'data_unmarshal:array',
      {
        type: DataType[this._dataType],
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
  indexColumn?: string;
  defaultColumnType?: DataType;
  columnTypes?: Record<string, DataType>;
};

/**
 * 用于存储 CSV 数据的类型
 */
export class CSVData extends Data {
  private index?: Index;
  private columnMap?: Map<string, ArrayData>;

  async loadCSV(options: CSVOptions): Promise<void> {
    const columnMap = new Map<string, ArrayData>();
    let columns: string[] | null = null;

    const parser = fs.createReadStream(options.filename)
      .pipe(parse({ delimiter: ',', columns: false, }))
      .on('data', row => {
        if (columns !== null) {
          const _columns = columns;
          row.forEach((val, n) => {
            const array = columnMap.get(_columns[n])!;
            array.add(dataByType(val, array.type));
          });
        } else {
          row.forEach(c => {
            const dtype = (options.columnTypes?.[c]) ?? (options.defaultColumnType ?? DataType.string);
            columnMap.set(c, new ArrayData(this.context, dtype));
          });
          columns = row;
        }
      })
      .on('error', err => {
        throw err;
      });

    await finished(parser);
    this.columnMap = columnMap;
  }

  get columnNames(): string[] {
    if (!this.columnMap) {
      return [];
    }
    return [...this.columnMap.keys()];
  }

  async getColumnData(columnName: string): Promise<ArrayData | null> {
    if (!this.columnMap) {
      return null;
    }
    const data = this.columnMap.get(columnName);
    if (!data) {
      return null;
    }

    if (data.length === 0) {
      if (!this.index) {
        return null;
      }
      const node = this.index.getNode(columnName);
      if (!node) {
        return null;
      }
      await data.unmarshal(node.position, node.length);
    }
    return data;
  }

  async marshal(position: number): Promise<MarshalResult | NoIndexMarshalResult> {
    const startPos = position;

    const index = new Index(this.context, MediaType.CSV);
    this.columnMap!.forEach(async (val, key) => {
      index.addNode(0, 0, val.type, key);
    });
    position += index.byteLength();

    for (const [key, val] of this.columnMap!) {
      const res = await val.marshal(position);
      index.updateNode(key, position, res.dataLength);
      position += res.dataLength;
    }

    const len = await index.marshal(startPos);
    return {
      indexLength: len,
      dataLength: position - startPos - len
    };
  }

  async unmarshal(position: number, length: number): Promise<void> {
    this.index = new Index(this.context);
    await this.index.unmarshal(position, length);

    const columnMap = new Map<string, ArrayData>();
    this.index.nodes.forEach(n => {
      columnMap.set(n.key, new ArrayData(this.context, n.type));
    });
    this.columnMap = columnMap;
  }
}
