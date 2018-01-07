import {expect} from "chai";
import {bind} from "../../src/functions/bind";

describe('Test function `bind`', function () {

    function add(...val) {
        let res = val[0];
        for (let i = 1; i < val.length; i++) {
            res += val[i];
        }
        return this.value + res;
    }

    it('should `bind` function with object as this', function () {
        const obj = {value: 100};
        const fn = bind(add, obj);
        expect(fn(100)).is.eql(200);
    });

    it('should `bind` function with object as this and external arguments', function () {
        const obj = {value: 'Hello'};
        const fn = bind(add, obj, ' World');
        expect(fn('!')).is.eql('Hello World!');
    });
});