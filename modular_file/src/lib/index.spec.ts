import { expect } from 'chai';
import fs from 'fs/promises';
import { Index, MediaType } from './_index';
import { Context } from './context';
import { IO } from './io';

describe('Test `Index` class', () => {
  let context: Context;

  before(async () => {
    await fs.mkdir('.test-files', { recursive: true });
    const io = await IO.open('.test-files/index.dat', true);
    context = new Context(io);
  });

  after(async () => {
    await context.close();
  });

  it('should index can marshal and unmarshal', async () => {
    const data = [
      [0, 100, 'A1'],
      [100, 100, 'A2'],
      [123, 50, 'A3'],
      [10001, 88, 'A4'],
      [999, 100, 'A5'],
    ];

    let index = new Index(context, MediaType.JSON);
    data.forEach(val => index.addNode(
      val[0] as number,
      val[1] as number,
      val[2] as string,
    ));

    const len = await index.marshal(0);

    index = new Index(context);
    await index.unmarshal(0, len);
    expect(index.nodes.length).is.eq(5);

    index.nodes.forEach((node, n) => {
      const val = data[n];
      expect(node.position).is.eq(val[0]);
      expect(node.length).is.eq(val[1]);
      expect(node.key).is.eq(val[2]);
    });

    const node = index.nodeByKey('A4')!;
    expect(node.position).is.eq(10001);
    expect(node.length).is.eq(88);
    expect(node.key).is.eq('A4');
  });

  it('should marshal a large data', async () => {
    let index = new Index(context, MediaType.CSV);
    for (let i = 0; i < 100000; i++) {
      index.addNode(i * 1000, 1000, `A-${i}`);
    }

    const len = await index.marshal(0);

    index = new Index(context);
    await index.unmarshal(0, len);

    expect(index.nodes.length).is.eq(100000);
  });
});
