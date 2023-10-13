/* eslint-disable @typescript-eslint/no-explicit-any */
import { PathLike } from 'fs';
import { Context } from './context';

/**
 * 包含索引项数据的序列化结果
 */
export declare type MarshalResult = {
  indexLength: number;
  dataLength: number;
};

/**
 * 对于数据中不包含索引项的序列化结果
 */
export declare type NoIndexMarshalResult = Omit<MarshalResult, 'indexLength'>;

/**
 * 定义可序列化类型
 */
export declare interface Serializable {
  /**
   * 数据对象中是否包含索引项
   *
   * @returns `true` 表示有索引项
   */
  get hasIndex(): boolean;

  /**
   * 获取上下文对象
   *
   * @returns 上下文对象
   */
  get context(): Context;

  /**
   * 将当前对象序列化到上下文中
   *
   * @param position 序列化操作在上下文中的起始位置
   * @returns 序列化数据长度
   */
  marshal(position: number): Promise<MarshalResult | NoIndexMarshalResult>;

  /**
   * 从上下文对象中反序列化对象
   *
   * @param position 反序列化操作在上下文中的起始位置
   * @param length 反序列化操作长度
   */
  unmarshal(position: number, length: number): Promise<void>;
}

/**
 * 数据类型
 */
export enum DataType {
  int32 = 0x10,
  int64 = 0x20,
  float = 0x30,
  double = 0x40,
  string = 0x50,
  datetime = 0x60,
}

/**
 * 数据类型接口, 表示一种特定类型的数据
 */
export declare interface Data {
  get context(): Context;
}

/**
 * 表示 JSON 类型数据的类型
 */
export declare interface JSONData extends Data {
  /**
   * 获取当前对象中包含的 JSON 数据本身
   *
   * @returns JSON 类型数据
   */
  get data(): Record<string, any>;
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
export declare interface ArrayData {
  /**
   * 获取当前对象中存储的数组对象本身
   *
   * @returns 数组数据
   */
  get data(): ArrayType;

  /**
   * 获取数组数据长度
   *
   * @returns 数组数据长度
   */
  get length(): number;

  /**
   * 获取当前对象中存储的数组类型
   *
   * @returns 数组数据类型
   */
  get type(): DataType;
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
export declare interface CSVData {
  /**
   * 获取所有 CSV 列名
   */
  get columnNames(): string[];

  /**
   * 获取指定列的数据
   * 
   * @param strict 是否为严格模式, 严格模式中, 返回结果的列必须要和 `columnNames` 完全匹配, 即不允许 `columnNames` 中包含不存在的列
   * @param columnNames 列名称集合
   * @returns 指定列的数据集合
   */
  getColumnData(strict: boolean, ...columnNames: string[]): Promise<Record<string, ArrayData>>;
}

/**
 * 定义段类型的类型
 */
export declare type SectionType = 'meta' | 'setting' | 'input' | 'result';

/**
 * 定义数据段
 */
export declare interface Section {
  /**
   * 获取数据段类型
   */
  type(): SectionType;
}

/**
 * 元数据段
 */
export declare interface MetaSection extends Section {
  /**
   * 获取数据文件版本
   * 
   * @returns 版本号
   */
  get version(): string;

  /**
   * 获取数据文件创建时间
   * 
   * @returns 创建时间
   */
  get createdAt(): Date;

  /**
   * 获取数据文件创建人
   * 
   * @returns 创建人
   */
  get createdBy(): string;

  /**
   * 获取数据文件签名
   */
  get signature(): string;
}

/**
 * 配置数据段
 */
export declare interface SettingSection extends Section {
  /**
   * 获取配置名称集合
   * 
   * @returns 配置名称的集合
   */
  get names(): string[];


}

export declare interface InputSection extends Section {
}

export declare interface ResultSection extends Section {
}
