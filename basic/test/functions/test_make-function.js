import {expect} from "chai";
import {makeFunction} from "../../src/functions/make-function";

describe('Test function `makeFunction`', function () {

    it('should `makeFunction` function make simple function', function () {
        const fn = makeFunction(null, 'return a + b;', 'a', 'b');
        expect(fn(1, 2)).is.eql(3);
    });

    it('should `makeFunction` make function with this object and external arguments', function () {
        const obj = {value: 100};
        const fn = makeFunction(obj, 'return this.value + a;', 'a');

        expect(fn(100)).is.eql(200);
    });
});