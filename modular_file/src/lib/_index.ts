import { Unit } from './buffer';
import { Context } from './context';
import { DataType } from './type';
import { executeAsync } from './utils';

export class IndexNode {
  public type: DataType;
  public key: string;
  public position: number;
  public length: number;

  constructor(type: DataType, position: number, length: number, key: string) {
    this.type = type;
    this.position = position;
    this.length = length;
    this.key = key;
  }
}

type IndexNodeLike = Exclude<IndexNode, Record<string, unknown>>;

class IndexNodes {
  nodeList: IndexNode[];
  nodeMap: Map<string, IndexNode>;

  constructor(nodes?: IndexNodeLike[]) {
    this.nodeMap = new Map<string, IndexNode>();
    if (nodes && nodes.length > 0) {
      this.nodeList = nodes;
      nodes.forEach(e => this.nodeMap.set(e.key, e));
    } else {
      this.nodeList = [];
    }
  }

  get(key: string): IndexNode | null {
    return this.nodeMap.get(key) ?? null;
  }

  put(elem: IndexNode) {
    this.nodeList.push(elem);
    if (elem.key) {
      this.nodeMap.set(elem.key, elem);
    }
  }
}

export enum MediaType {
  SECTION = 0x10,
  DATA = 0x20,
  CSV = 0x21,
}

type IndexLike = {
  type: MediaType;
  nodes: IndexNodeLike[];
};

export class Index {
  private _ctx: Context;
  private _type: MediaType;
  private _nodes = new IndexNodes();

  constructor(context: Context, type?: MediaType) {
    this._ctx = context;
    this._type = type ?? MediaType.UNKNOWN;
  }

  get type(): MediaType {
    return this._type;
  }

  get nodes(): IndexNode[] {
    return this._nodes.nodeList;
  }

  getNode(key: string): IndexNode | null {
    return this._nodes.get(key);
  }

  addNode(position: number, length: number, type: DataType, key: string): IndexNode {
    const n = new IndexNode(type, position, length, key);
    this._nodes.put(n);
    return n;
  }

  updateNode(key: string, position: number, length: number): void {
    const n = this._nodes.get(key)!;
    n.position = position;
    n.length = length;
  }

  /**
   * 序列化, 将索引序列化为二进制流
   *
   * @returns 二进制数据
   */
  async marshal(position: number): Promise<number> {
    const result = await executeAsync<Uint8Array>(
      'index_marshal',
      {
        type: this._type,
        nodes: this._nodes.nodeList
      }
    );

    await this._ctx.io.write(Buffer.from(result), position);
    return result.length;
  }

  /**
   * 反序列化, 将二进制数据反序列化为当前对象
   *
   * @param data 二进制数据
   */
  async unmarshal(position: number, length: number): Promise<void> {
    const buf = await this._ctx.io.read(position, length);
    const result = await executeAsync<IndexLike>('index_unmarshal', { data: buf });
    this._type = result.type;
    this._nodes = new IndexNodes(result.nodes);
  }

  byteLength(): number {
    const enc = new TextEncoder();
    const keySize = this._nodes.nodeList.reduce((total, n) => total + enc.encode(n.key).length, Unit.int8);
    return keySize + this._nodes.nodeList.length * 11; // Unit.int8 + Unit.int16 + Unit.int * 2
  }
}
