const { expect } = require('chai');
const { add, sub } = require('../../math');

describe('Test math package', () => {
  it('should add function working', () => {
    expect(add(10, 20)).is.eql(30);
  });

  it('should sub function working', () => {
    expect(sub(10, 20)).is.eql(-10);
  });
});
