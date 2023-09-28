import { DefaultModularFileReader, DefaultModularFileWriter } from './lib/file';
import { ModularFileReader, ModularFileWriter } from './lib/type';

export {
  ModularFile,
  ModularFileReader,
  ModularFileWriter,
} from './lib/type.js';

export async function newReader(filename: string): Promise<ModularFileReader> {
  return DefaultModularFileReader.create(filename);
}

export async function newWriter(filename: string): Promise<ModularFileWriter> {
  return DefaultModularFileWriter.create(filename);
}

export async function newPipe(filename: string): Promise<[ModularFileReader, ModularFileWriter]> {
  return Promise.all([
    DefaultModularFileReader.create(filename),
    DefaultModularFileWriter.create(filename)
  ]);
}
