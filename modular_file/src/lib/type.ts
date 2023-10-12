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
