import {expect} from "chai";
import {array_iter, double_xrange, get_iterator, Range, RangeWithIter, xrange} from "../../src/collections/iterator";

describe('Test iterator', function () {

    it('should `xrange` work as generator function', function () {
        const values = [];
        for (let n of xrange(0, 5)) {
            values.push(n);
        }

        expect(values).is.lengthOf(5);
        expect(values).is.eql([0, 1, 2, 3, 4]);
        expect(values).is.eql([...xrange(0, 5)]);
    });

    it('should `double_xrange` return two generator functions', function () {
        const values = [];
        for (let n of double_xrange(0, 5, 1)) {
            values.push(n);
        }

        expect(values).is.lengthOf(10);
        expect(values).is.eql([0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
        expect(values).is.eql([...double_xrange(0, 5, 1)]);
    });

    it('should `array_iter` return iterator of array', function () {
        const values = [];

        const iter = array_iter([1, 2, 3, 4]);
        for (let n of iter) {
            values.push(n);
        }

        expect(values).is.lengthOf(4);
        expect(values).is.eql([1, 2, 3, 4]);
    });

    it('should `RangeWithIter` has iterator', function () {
        let range = new RangeWithIter(0, 5);
        let num = 0;
        for (let r of range) {
            expect(r).is.eq(num++);
        }
        expect([...range]).is.eql([0, 1, 2, 3, 4]);
        expect(range.isBreak).is.false;

        range = new RangeWithIter(0, 5);
        for (let r of range) {
            if (r === 3) {
                break;
            }
        }
        expect(range.isBreak).is.true;
    });

    it('should `Range` has iterator', function () {
        const range = new Range(0, 5, 1);
        let num = 0;
        for (let r of range) {
            expect(r).is.eq(num++);
        }
        expect([...range]).is.eql([0, 1, 2, 3, 4]);
    });

    it('should `get_iterator` function working', function () {
        const array = [1, 2, 3];

        let iter = get_iterator(array);
        expect([...iter]).is.eql([1, 2, 3]);

        iter = get_iterator('Hello');
        expect([...iter]).is.eql(['H', 'e', 'l', 'l', 'o']);

        iter = get_iterator(new Range(1, 5, 1));
        expect([...iter]).is.eql([1, 2, 3, 4]);

        iter = get_iterator(xrange(1, 5, 1));
        expect([...iter]).is.eql([1, 2, 3, 4]);
    });
});