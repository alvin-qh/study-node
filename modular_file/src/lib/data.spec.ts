import { ArrayData, JSONData } from './data';
import { expect } from 'chai';
import { fakerZH_CN as faker } from '@faker-js/faker';
import * as buffer from './buffer';

describe('Test "JSONData" class', () => {
  it('should unmarshal from buffer', () => {
    const data = new JSONData();
    expect(data.type).is.eq('json');

    data.unmarshal(Buffer.from('{"A": 100, "B": "Hello", "C": [1, 2, 3]}'));

    expect(data.content.A).is.eq(100);
    expect(data.content.B).is.eq('Hello');
    expect(data.content.C).is.deep.eq([1, 2, 3]);
  });

  it('should marshal to buffer', () => {
    const data = new JSONData({ A: 100, B: 'Hello', C: [1, 2, 3] });

    const buf = data.marshal();
    expect(buf).has.length(33);
    expect(buf.toString('utf-8')).is.eq('{"A":100,"B":"Hello","C":[1,2,3]}');

    data.unmarshal(buf);
    expect(data.content.A).is.eq(100);
    expect(data.content.B).is.eq('Hello');
    expect(data.content.C).is.deep.eq([1, 2, 3]);
  });
});

describe('Test "ArrayData" class', () => {
  it('should unmarshal double array from buffer', () => {
    const data = new ArrayData('double');
    expect(data.type).is.eq('array');

    const elems = [
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float()
    ];

    data.unmarshal(buffer.fromDoubleArray(elems));
    expect(data.content).is.deep.eq(elems);
  });

  it('should unmarshal string array from buffer', () => {
    const data = new ArrayData('string');
    expect(data.type).is.eq('array');

    const elems = [
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric()
    ];

    data.unmarshal(buffer.fromStringArray(elems));
    expect(data.content).is.deep.eq(elems);
  });

  it('should marshal string array to buffer', () => {
    const elems = [
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
      faker.string.alphanumeric()
    ];

    const data = new ArrayData('string', elems);

    const buf = data.marshal();

    const array = buffer.toStringArray(buf);
    expect(array).is.deep.eq(elems);
  });

  it('should marshal double array to buffer', () => {
    const elems = [
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float()
    ];

    const data = new ArrayData('double', elems);

    const buf = data.marshal();

    const array = buffer.toDoubleArray(buf);
    expect(array).is.deep.eq(elems);
  });
});
