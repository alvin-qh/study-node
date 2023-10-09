import { ArrayData, JSONData } from './data';
import { expect } from 'chai';
import { fakerZH_CN as faker } from '@faker-js/faker';
import * as buffer from './buffer.js';
import { DataElementType } from './type';

describe('Test `JSONData` class', () => {
  it('should unmarshal from buffer', async () => {
    const data = new JSONData();
    expect(data.type).is.eq('json');

    await data.unmarshal(Buffer.from('{"A": 100, "B": "Hello", "C": [1, 2, 3]}'));

    expect(data.content.A).is.eq(100);
    expect(data.content.B).is.eq('Hello');
    expect(data.content.C).is.deep.eq([1, 2, 3]);
  });

  it('should marshal to buffer', async () => {
    const data = new JSONData({ A: 100, B: 'Hello', C: [1, 2, 3] });

    const buf = await data.marshal();
    expect(buf).has.length(33);
    expect(buf.toString('utf-8')).is.eq('{"A":100,"B":"Hello","C":[1,2,3]}');

    await data.unmarshal(buf);
    expect(data.content.A).is.eq(100);
    expect(data.content.B).is.eq('Hello');
    expect(data.content.C).is.deep.eq([1, 2, 3]);
  });
});

describe('Test `ArrayData` class', () => {
  it('should unmarshal double array from buffer', async () => {
    const data = new ArrayData(DataElementType.double);
    expect(data.type).is.eq('array');

    const elems = [
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float()
    ];

    const buf = buffer.fromDoubleArray(elems, 4);
    buf.writeInt32BE(DataElementType.double);

    await data.unmarshal(buf);
    expect(data.content).is.deep.eq(elems);
  });

  it('should unmarshal string array from buffer', async() => {
    const data = new ArrayData(DataElementType.string);
    expect(data.type).is.eq('array');

    const elems = [
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric()
    ];

    const buf = buffer.fromStringArray(elems, 4);
    buf.writeInt32BE(DataElementType.string);

    await data.unmarshal(buf);
    expect(data.content).is.deep.eq(elems);
  });

  it('should marshal string array to buffer', async () => {
    const elems = [
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric()
    ];

    const data = new ArrayData(DataElementType.string, elems);
    const buf = await data.marshal();

    const array = buffer.toStringArray(buf, 4);
    expect(array).is.deep.eq(elems);
  });

  it('should marshal double array to buffer', async () => {
    const elems = [
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float()
    ];

    const data = new ArrayData(DataElementType.double, elems);
    const buf = await data.marshal();

    const array = buffer.toDoubleArray(buf, 4);
    expect(array).is.deep.eq(elems);
  });
});
