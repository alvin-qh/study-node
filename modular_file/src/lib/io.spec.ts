import { fail } from 'assert';
import { expect } from 'chai';
import fs from 'fs/promises';
import path from 'path';
import { IO } from './io';

describe('Test `IO` classes', () => {
  const filename = '.test-files/simple-file.dat';

  before(async () => {
    await fs.mkdir(path.dirname(filename), { recursive: true });
  });

  it('test `write`/`read` file', async () => {
    const wio = await IO.open(filename).catch(e => fail(e.message));
    const len = await wio.write(Buffer.from('abcdefgh', 'utf-8'), 100);
    await wio.close();

    const rio = await IO.open(filename).catch(e => fail(e.message));
    expect(await rio.size()).is.eq(len + 100);

    const buf = await rio.read(100, len);
    expect(buf.length).is.eq(8);

    await rio.close();
  });
});
