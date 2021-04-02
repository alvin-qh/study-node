import { expect } from "chai";

import { add } from "../../../app";

describe('Test "if mocha can be run with @babel/register module"', () => {
  it('should "expect" function work', () => {
    expect(add(1, 2)).is.equal(3);
  });
});
