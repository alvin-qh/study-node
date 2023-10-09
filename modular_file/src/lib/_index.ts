import { Index } from './type';
import { executeAsync } from './utils';

export class IndexElement {
  public key: string;
  public offset: number;
  public length: number;

  constructor(offset?: number, length?: number, key?: string) {
    this.offset = offset ?? 0;
    this.length = length ?? 0;
    this.key = key ?? '';
  }
}

type IndexElementLike = Exclude<IndexElement, Record<string, unknown>>;

class IndexElementMap {
  elems: IndexElement[];
  elemMap: Map<string, IndexElement> | null = null;

  constructor(elems?: IndexElementLike[]) {
    if (elems) {
      this.elems = elems;
    } else {
      this.elems = [];
    }
  }

  private _initMap() {
    if (this.elems && !this.elemMap) {
      this.elemMap = new Map<string, IndexElement>();
      this.elems.forEach(e => this.elemMap!.set(e.key, e));
    }
  }

  get(key: string): IndexElement | null {
    this._initMap();
    return this.elemMap!.get(key) ?? null;
  }

  put(elem: IndexElement) {
    this.elems.push(elem);
    if (elem.key) {
      this._initMap();
      this.elemMap!.set(elem.key, elem);
    }
  }
}

export enum MediaType {
  UNKNOWN = 0,
  JSON = 0x1,
  CSV = 0x10,
  YAML = 0x100,
  BIN = 0x200,
}

type DefaultIndexLike = {
  type: MediaType;
  name: string;
  elements: IndexElementLike[];
};

export class DefaultIndex implements Index {
  private _type: MediaType;
  private _name: string;
  private _elements = new IndexElementMap();

  constructor(type?: MediaType, name?: string) {
    this._type = type ?? MediaType.UNKNOWN;
    this._name = name ?? '';
  }

  get type(): MediaType {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get elements(): IndexElement[] {
    return this._elements.elems;
  }

  element(key: string): IndexElement | null {
    return this._elements.get(key);
  }

  addElement(off: number, len: number, key?: string) {
    this._elements.put(new IndexElement(off, len, key));
  }

  /**
   * 序列化, 将索引序列化为二进制流
   * 
   * @returns 二进制数据
   */
  async marshal(): Promise<Buffer> {
    return executeAsync<Uint8Array, Buffer>(
      'index_marshal',
      {
        type: this._type,
        name: this._name,
        elements: this._elements.elems
      },
      result => Buffer.from(result)
    );
  }

  /**
   * 反序列化, 将二进制数据反序列化为当前对象
   * 
   * @param data 二进制数据
   */
  async unmarshal(data: Buffer): Promise<void> {
    return executeAsync<DefaultIndexLike, void>('index_unmarshal', { data: data }, result => {
      this._type = result.type;
      this._name = result.name;
      this._elements = new IndexElementMap(result.elements);
    });
  }
}
