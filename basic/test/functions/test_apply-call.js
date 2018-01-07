import {expect} from "chai";
import {call} from "../../src/functions/apply-call";

describe('Test function `call`', function () {

    function add(...val) {
        if (!val.length) {
            return this.value;
        }

        let res = val[0];
        for (let i = 1; i < val.length; i++) {
            res += val[i];
        }
        return this.value + res;
    }

    it('should `call` function with object as this', function () {
        const obj = {value: 100};
        expect(call(add, obj)).is.eql(100);
    });

    it('should `call` function with object as this and external arguments', function () {
        const obj = {value: 100};
        expect(call(add, obj, 100)).is.eql(200);
    });

    it('should `call` function with object as this and arguments', function () {
        const obj = {value: 'Hello'};
        expect(call(add, obj, ' World!')).is.eql('Hello World!');
    });
});