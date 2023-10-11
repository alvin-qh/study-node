import { PathLike } from 'fs';
import fs from 'fs/promises';

export class IO {
  protected fh: fs.FileHandle;

  protected constructor(fh: fs.FileHandle) {
    this.fh = fh;
  }

  async read(position: number, length: number): Promise<Buffer> {
    const buf = Buffer.allocUnsafe(length);
    const r = await this.fh.read(buf, 0, length, position);
    if (r.bytesRead !== length) {
      throw new Error(`cannot read enough bytes by size ${length}`);
    }
    return r.buffer;
  }

  async write(buf: Buffer, position: number): Promise<number> {
    const r = await this.fh.write(buf, 0, buf.length, position);
    if (r.bytesWritten !== buf.length) {
      throw new Error(`cannot written enough bytes by size ${buf.length}`);
    }
    return buf.length;
  }

  async size(): Promise<number> {
    const st = await this.fh.stat();
    return st.size;
  }

  async close(): Promise<void> {
    await this.fh.close();
  }

  static async open(filename: PathLike, truncate: boolean = false): Promise<IO> {
    let flag = 'a+';
    if (truncate) {
      flag = 'w+';
    }
    const fh = await fs.open(filename, flag);
    return new IO(fh);
  }
}
