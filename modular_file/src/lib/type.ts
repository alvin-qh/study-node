export declare type MarshalResult = {
  indexLength: number;
  dataLength: number;
};

export declare type NoIndexMarshalResult = Omit<MarshalResult, 'indexLength'>;

/**
 * 定义可序列化类型
 */
export declare interface Serializable {
  get hasIndex(): boolean;
  marshal(position: number): Promise<MarshalResult | NoIndexMarshalResult>;
  unmarshal(position: number, length: number): Promise<void>;
}
