const { expect } = require('chai');
const { math } = require('@alvin-node/package-install');

describe('Test math package', () => {
    it('should add function working', () => {
        expect(math.add(10, 20)).is.eql(30);
    });

    it('should sub function working', () => {
        expect(sub(10, 20)).is.eql(-10);
    });
});