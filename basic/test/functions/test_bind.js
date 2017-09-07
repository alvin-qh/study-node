'use strict';

import {expect} from "chai";
import bind from "../../src/functions/bind";


describe('Test function bind', () => {

    function add(...val) {
        let res = val[0];
        for (let i = 1; i < val.length; i++) {
            res += val[i];
        }
        return this.value + res;
    }

    it('test bind function with object as this', () => {
        const obj = {value: 100};
        const fn = bind(add, obj);
        expect(fn(100)).to.equal(200);
    });

    it('test bind function with object as this and external arguments', () => {
        const obj = {value: 'Hello'};
        const fn = bind(add, obj, ' World');
        expect(fn('!')).to.equal('Hello World!');
    });
});