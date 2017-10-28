import {expect} from "chai";
import toBoolean from "../../src/basic/boolean";

describe('Test toBoolean', () => {

    it('convert string to boolean', () => {
        expect(toBoolean('Hello')).is.a('boolean');

        expect(toBoolean('Hello')).be.true;
        expect(toBoolean('')).be.false;
    });

    it('convert number to boolean', () => {
        expect(toBoolean(1)).is.a('boolean');

        expect(toBoolean(1)).be.true;
        expect(toBoolean(0)).be.false;
        expect(toBoolean(NaN)).be.false;
    });

    it('convert array to boolean', () => {
        expect(toBoolean([])).is.a('boolean');

        expect(toBoolean([])).be.true;
        expect(toBoolean([1])).be.true;
    });

    it('convert object to boolean', () => {
        expect(toBoolean({})).is.a('boolean');

        expect(toBoolean({})).be.true;
        expect(toBoolean(Object())).be.true;
        expect(toBoolean(null)).be.false;
        expect(toBoolean(undefined)).be.false;
    });
});
