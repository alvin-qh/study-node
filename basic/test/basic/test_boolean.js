import {expect} from "chai";
import {toBoolean} from "../../src/basic/boolean";

describe('Test toBoolean', () => {

    it('convert string to boolean', () => {
        expect(toBoolean('Hello')).is.a('boolean');

        expect(toBoolean('Hello')).to.be.true;
        expect(toBoolean('')).to.be.false;
    });

    it('convert number to boolean', () => {
        expect(toBoolean(1)).is.a('boolean');

        expect(toBoolean(1)).to.be.true;
        expect(toBoolean(0)).to.be.false;
        expect(toBoolean(NaN)).to.be.false;
    });

    it('convert array to boolean', () => {
        expect(toBoolean([])).is.a('boolean');

        expect(toBoolean([])).to.be.true;
        expect(toBoolean([1])).to.be.true;
    });

    it('convert object to boolean', () => {
        expect(toBoolean({})).is.a('boolean');

        expect(toBoolean({})).to.be.true;
        expect(toBoolean(Object())).to.be.true;
        expect(toBoolean(null)).to.be.false;
        expect(toBoolean(undefined)).to.be.false;
    });
});
