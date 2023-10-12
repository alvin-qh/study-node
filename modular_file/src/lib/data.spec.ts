import { fakerZH_CN as faker } from '@faker-js/faker';
import { expect } from 'chai';
import fs from 'fs/promises';
import { Context } from './context';
import { ArrayData, CSVData, JSONData } from './data';
import { IO } from './io';
import { DataType, MarshalResult } from './type';

describe('Test `JSONData` class', () => {
  let context: Context;

  before(async () => {
    await fs.mkdir('.test-files', { recursive: true });
    const io = await IO.open('.test-files/json.dat', true);
    context = new Context(io);
  });

  after(async () => {
    await context.close();
  });

  it('should marshal and unmarshal', async () => {
    let data = new JSONData(context, { A: 100, B: 'Hello', C: [1, 2, 3] });

    const res = await data.marshal(0);
    expect(res.dataLength).is.eq(33);

    data = new JSONData(context);
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
    const io = await IO.open('.test-files/array.dat', true);
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

    let data = new ArrayData(context, DataType.double, elems);
    const res = await data.marshal(0);

    data = new ArrayData(context, DataType.double);
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

    let data = new ArrayData(context, DataType.string, elems);
    const res = await data.marshal(0);

    data = new ArrayData(context, DataType.string);
    await data.unmarshal(0, res.dataLength);
    expect(data.data).is.deep.eq(elems);
  });
});

describe('Test `CSVData` class', () => {
  let context: Context;

  before(async () => {
    await fs.mkdir('.test-files', { recursive: true });
    const io = await IO.open('.test-files/csv.dat', true);
    context = new Context(io);
  });

  after(async () => {
    await context.close();
  });

  it('should csv file can be loaded into `CSVData` object', async () => {
    const data = new CSVData(context);
    await data.loadCSV({ filename: '.test-files/small.csv' });

    expect(data.columnNames.length).is.eq(341);
    expect(data.columnNames).has.contains('HEADL');
    expect(data.columnNames).has.contains('V2j_ZYP2');
    expect(data.columnNames).has.contains('V1j_PP');

    let col = await data.getColumnData('EngFlyCount');
    expect(col!.length).is.eq(10000);

    col = await data.getColumnData('best_datetime');
    expect(col!.length).is.eq(10000);
  });

  it('should `CSVData` object marshal and unmarshal', async () => {
    let data = new CSVData(context);
    await data.loadCSV({ filename: '.test-files/small.csv' });
    const result = await data.marshal(0);

    data = new CSVData(context);
    await data.unmarshal(0, (result as MarshalResult).indexLength);
    expect(data.columnNames.length).is.eq(341);
    expect(data.columnNames).has.contains('HEADL');
    expect(data.columnNames).has.contains('V2j_ZYP2');
    expect(data.columnNames).has.contains('V1j_PP');

    let col = await data.getColumnData('best_datetime');
    expect(col!.length).is.eq(10000);

    col = await data.getColumnData('HEADL');
    expect(col!.length).is.eq(10000);
  });
});
