import { expect } from 'chai';

import { add } from 'babel-lib';

describe('test `babel-lib` module', () => {
  it('test `add` function', () => {
    const r = add(1, 2);
    expect(r).to.be(3);
  });
});
