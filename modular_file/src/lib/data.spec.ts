import { fakerZH_CN as faker } from '@faker-js/faker';
import { expect } from 'chai';
import fs from 'fs/promises';
import { Context } from './context';
import { ArrayData, DataType, JSONData } from './data';
import { IO } from './io';

describe('Test `JSONData` class', () => {
  let context: Context;

  before(async () => {
    await fs.mkdir('.test-files', { recursive: true });
    const io = await IO.open('.test-files/data.dat', true);
    context = new Context(io);
  });

  after(async () => {
    await context.close();
  });

  it('should marshal and unmarshal', async () => {
    const data = new JSONData(context, { A: 100, B: 'Hello', C: [1, 2, 3] });

    const res = await data.marshal(0);
    expect(res.dataLength).is.eq(33);

    await data.unmarshal(0, 33);
    expect(data.data.A).is.eq(100);
    expect(data.data.B).is.eq('Hello');
    expect(data.data.C).is.deep.eq([1, 2, 3]);
  });
});

describe('Test `ArrayData` class', () => {
  let context: Context;

  before(async () => {
    await fs.mkdir('.test-files', { recursive: true });
    const io = await IO.open('.test-files/data.dat', true);
    context = new Context(io);
  });

  after(async () => {
    await context.close();
  });

  it('should double array marshal and unmarshal', async () => {
    const elems = [
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
    ];

    const data = new ArrayData(context, DataType.double, elems);
    const res = await data.marshal(0);

    await data.unmarshal(0, res.dataLength);
    expect(data.data).is.deep.eq(elems);
  });

  it('should string array marshal and unmarshal', async () => {
    const elems = [
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
    ];

    const data = new ArrayData(context, DataType.string, elems);
    const res = await data.marshal(0);

    await data.unmarshal(0, res.dataLength);
    expect(data.data).is.deep.eq(elems);
  });
});
