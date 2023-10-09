export declare interface ModularFile { }

export declare interface ModularFileReader extends ModularFile { }

export declare interface ModularFileWriter extends ModularFile { }

export declare interface Section {
}

export declare interface Index {
  /**
   * 反序列化, 将二进制数据反序列化为当前对象
   * 
   * @param data 二进制数据
   */
  unmarshal(data: Buffer): void;
}

export declare type DataType = 'json' | 'array';

/**
 * 数据存储接口
 */
export declare interface Data<T> {
  /**
   * 获取数据类型
   */
  get type(): DataType;

  /**
   * 反序列化, 将二进制数据反序列化为当前对象
   * 
   * @param data 二进制数据
   */
  unmarshal(data: Buffer): void;

  /**
   * 获取当前数据对象
   * 
   * @returns 当前数据表示的对象
   */
  get content(): T;
}

// 数据集合类型
export enum DataElementType {
  int32 = 0x1,
  int64 = 0x2,
  float = 0x10,
  double = 0x11,
  string = 0x100,
}
