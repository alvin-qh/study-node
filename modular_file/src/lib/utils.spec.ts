import { expect } from 'chai';
import { isLargeData } from './utils';

describe('Test `utils` module', () => {
  function createRecord(keyCount: number): Record<string, unknown> {
    const obj = {};
    for (let i = 0; i < keyCount; i++) {
      obj[`k${i}`] = `v${i}`;
    }
    return obj;
  }

  it('should `isLargeData` function return `false` if small data', () => {
    expect(isLargeData(Buffer.allocUnsafe(524288))).is.false;
    expect(isLargeData(new Array(65536))).is.false;
    expect(isLargeData(createRecord(65536))).is.false;
  });

  it('should `isLargeData` function return `true` if large data', () => {
    expect(isLargeData(Buffer.allocUnsafe(524289))).is.true;
    expect(isLargeData(new Array(65537))).is.true;
    expect(isLargeData(createRecord(65537))).is.true;
  });

  it('should `isLargeData` function can work with complex object', () => {
    const obj = createRecord(30000);

    obj.ext1 = createRecord(30000);
    expect(isLargeData(obj)).is.false;

    obj.ext2 = createRecord(5537);
    expect(isLargeData(obj)).is.true;
  });
});
