'use strict';

import {expect} from "chai";
import Arrays from "../../src/collections/arrays";
import {xrange} from "../../src/collections/iterator";

describe('Test Arrays', () => {

    it('test `isArray` function', () => {
        expect(Arrays.isArray([1, 2, 3])).be.true;
        expect(Arrays.isArray([])).be.true;
        expect(Arrays.isArray("1, 2, 3")).be.false;
    });

    it('test `of` function', () => {
        expect(Arrays.of(1, 2, 3)).to.deep.equal([1, 2, 3]);
        expect(Arrays.of(1, [2, 3])).to.deep.equal([1, [2, 3]]);
        expect(Arrays.of(1, ...[2, 3])).to.deep.equal([1, 2, 3]);
    });

    it('test `map` function', () => {
        expect(Arrays.map(xrange(1, 5))).to.deep.equal([1, 2, 3, 4]);

        const array = [1, 2, 3];
        expect(Arrays.map(array, n => 10 + n)).to.deep.equal([11, 12, 13]);
    });

    it('test `find` function', () => {
        const array = [1, 2, 3];
        expect(Arrays.find(array, n => n === 3)).to.equal(3);
    });
});