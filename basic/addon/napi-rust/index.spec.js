import { expect } from 'chai';

import { helloWorld, sum } from './index.cjs';

describe('test export functions from rust module', () => {
  it("should 'helloWorld' function worked", () => {
    const r = helloWorld();
    expect(r).to.eq('Hello NAPI for Rust!');
  });

  it("should 'sum' function worked", () => {
    expect(sum(1, 2)).to.equal(3);
  });
});
