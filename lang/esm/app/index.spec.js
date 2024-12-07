import { expect } from 'chai';

import { add } from 'esm-lib';

describe('test `es-module-lib`', () => {
  it('should `add` function imported', () => {
    expect(add(1, 2)).to.equal(3);
  });
});
