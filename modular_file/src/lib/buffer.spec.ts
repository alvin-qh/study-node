import { fakerZH_CN as faker } from '@faker-js/faker';
import { expect } from 'chai';
import * as buffer from './buffer.js';

describe('Test "buffer" module', () => {
  it('should int array to buffer', () => {
    const opt = {
      min: -0x7fffffff,
      max: 0x7fffffff
    };

    const ns = [
      faker.number.int(opt),
      faker.number.int(opt),
      faker.number.int(opt),
      faker.number.int(opt),
      faker.number.int(opt),
      faker.number.int(opt)
    ];
    const buf = buffer.fromIntArray(ns);
    expect(buf).has.length(ns.length * 4);

    const nss = buffer.toIntArray(buf);
    expect(nss).is.deep.eq(ns);
  });

  it('should int64 array to buffer', () => {
    const ns = [
      Number(faker.number.bigInt()),
      Number(faker.number.bigInt()),
      Number(faker.number.bigInt()),
      Number(faker.number.bigInt()),
      Number(faker.number.bigInt()),
      Number(faker.number.bigInt())
    ];
    const buf = buffer.fromInt64Array(ns);
    expect(buf).has.length(ns.length * 8);

    const nss = buffer.toInt64Array(buf);
    expect(nss).is.deep.eq(ns);
  });

  it('should double array to buffer', () => {
    const ns = [
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float(),
      faker.number.float()
    ];
    const buf = buffer.fromDoubleArray(ns);
    expect(buf).has.length(ns.length * 8);

    const nss = buffer.toDoubleArray(buf);
    expect(nss).is.deep.eq(ns);
  });

  it('should string array to buffer', () => {
    const ns = ['aaaa', 'aabbb', 'abcabc', '^U*&%^*&', '中文测试'];
    const buf = buffer.fromStringArray(ns);
    expect(buf).has.length(55);

    const nss = buffer.toStringArray(buf);
    expect(nss).is.deep.eq(ns);
  });
});
