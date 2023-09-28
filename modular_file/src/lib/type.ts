export declare interface ModularFile { }

export declare interface ModularFileReader extends ModularFile { }

export declare interface ModularFileWriter extends ModularFile { }

export declare interface Section<T> {
  get index(): Index;

  loadData(indexElem: IndexElement): Data<T>;
}

export declare interface WriteableSection {
  set index(index: Index);

  writeData(): number;
}

export declare interface Index { }

export declare interface IndexElement { }

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
   * 序列化, 将当前对象序列化为二进制数据
   */
  marshal(): Buffer;

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
export type DataElementType = 'int32' | 'int64' | 'float' | 'double' | 'string';
