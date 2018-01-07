import {expect} from "chai";
import {toBoolean} from "../../src/basic/boolean";

describe('Test toBoolean', function () {

    it('should convert string to boolean', function () {
        expect(toBoolean('Hello')).is.a('boolean');

        expect(toBoolean('Hello')).is.true;
        expect(toBoolean('')).is.false;
    });

    it('should convert number to boolean', function () {
        expect(toBoolean(1)).is.a('boolean');

        expect(toBoolean(1)).is.true;
        expect(toBoolean(0)).is.false;
        expect(toBoolean(NaN)).is.false;
    });

    it('should convert array to boolean', function () {
        expect(toBoolean([])).is.a('boolean');

        expect(toBoolean([])).is.true;
        expect(toBoolean([1])).is.true;
    });

    it('should convert object to boolean', function () {
        expect(toBoolean({})).is.a('boolean');

        expect(toBoolean({})).is.true;
        expect(toBoolean(Object())).is.true;
        expect(toBoolean(null)).is.false;
        expect(toBoolean(undefined)).is.false;
    });
});
