import fs from 'fs/promises';
import { ModularFile, ModularFileReader, ModularFileWriter } from './type';

export abstract class DefaultModularFile implements ModularFile {
  protected fd: fs.FileHandle;

  constructor(fd: fs.FileHandle) {
    this.fd = fd;
  }
}

export class DefaultModularFileReader extends DefaultModularFile implements ModularFileReader {
  static async create(filename: string): Promise<DefaultModularFileReader> {
    const fd = await fs.open(filename, 'r');
    return new DefaultModularFileReader(fd);
  }
}

export class DefaultModularFileWriter extends DefaultModularFile implements ModularFileWriter {
  static async create(filename: string): Promise<DefaultModularFileWriter> {
    const fd = await fs.open(filename, 'w');
    return new DefaultModularFileWriter(fd);
  }
}
