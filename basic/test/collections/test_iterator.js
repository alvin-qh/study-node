'use strict';

import {expect} from "chai";
import {double_xrange, xrange, array_iter, Range} from "../../src/collections/iterator";

describe('Test iterator', () => {

    it('test xrange function', () => {
        const values = [];
        for (let n of xrange(0, 5, 1)) {
            values.push(n);
        }

        expect(values).is.lengthOf(5);
        expect(values).is.deep.equal([0, 1, 2, 3, 4]);
        expect(values).is.deep.equal([...xrange(0, 5, 1)]);
    });

    it('test double_xrange function', () => {
        const values = [];
        for (let n of double_xrange(0, 5, 1)) {
            values.push(n);
        }

        expect(values).is.lengthOf(10);
        expect(values).is.deep.equal([0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
        expect(values).is.deep.equal([...double_xrange(0, 5, 1)]);
    });

    it('test array_iter function', () => {
        const values = [];

        const iter = array_iter([1, 2, 3, 4]);
        for (let n of iter) {
            values.push(n);
        }

        expect(values).is.lengthOf(4);
        expect(values).is.deep.equal([1, 2, 3, 4]);
    });

    it('test foreach with Range', () => {
        const range = new Range(0, 5, 1);
        const values = [];
        for (let r of range) {
            values.push(r);
        }

        expect(values).is.lengthOf(5);
        expect(values).is.deep.equal([0, 1, 2, 3, 4]);
        expect(values).is.deep.equal([...range]);
    });
});