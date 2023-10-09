import { expect } from 'chai';
import { DefaultIndex, MediaType } from './_index';

describe('Test `Index` class', () => {
  it('should index can marshal and unmarshal', async () => {
    const data = [
      [0, 100, 'A1'],
      [100, 100, 'A2'],
      [123, 50, 'A3'],
      [10001, 88, 'A4'],
      [999, 100, 'A5'],
    ];

    let index = new DefaultIndex(MediaType.JSON, 'test-index');
    data.forEach(val => index.addElement(
      val[0] as number,
      val[1] as number,
      val[2] as string,
    ));

    const buf = await index.marshal();

    index = new DefaultIndex();
    await index.unmarshal(buf);
    expect(index.elements.length).is.eq(5);

    index.elements.forEach((val, n) => {
      const d = data[n];

      expect(val.offset).is.eq(d[0]);
      expect(val.length).is.eq(d[1]);
      expect(val.key).is.eq(d[2]);
    });

    const elem = index.element('A4')!;
    expect(elem.offset).is.eq(10001);
    expect(elem.length).is.eq(88);
    expect(elem.key).is.eq('A4');
  });

  it('should marshal a large data', async () => { 
    let index = new DefaultIndex(MediaType.CSV, 'test-index');
    for (let i = 0; i < 100000; i++) {
      index.addElement(i * 1000, 1000, `A-${i}`);
    }

    const buf = await index.marshal();

    index = new DefaultIndex();
    await index.unmarshal(buf);

    expect(index.elements.length).is.eq(100000);
  });
});
