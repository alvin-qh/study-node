import {expect} from "chai";
import {xrange} from "../../src/collections/iterator";
import Arrays from "../../src/collections/arrays";

describe('Test arrays', function () {

    it('should `isArray` working', function () {
        expect(Arrays.isArray([1, 2, 3])).is.true;
        expect(Arrays.isArray([])).is.true;
        expect(Arrays.isArray("1, 2, 3")).is.false;
    });

    it('should `of` function working', function () {
        expect(Arrays.of(1, 2, 3)).is.eql([1, 2, 3]);
        expect(Arrays.of(1, [2, 3])).is.eql([1, [2, 3]]);
        expect(Arrays.of(1, ...[2, 3])).is.eql([1, 2, 3]);
    });

    it('should `from` function can make array', function () {
        expect(Arrays.from(xrange(1, 5))).is.eql([1, 2, 3, 4]);

        const array = [1, 2, 3];
        expect(Arrays.from(array, n => 10 + n)).is.eql([11, 12, 13]);
    });

    it('test `findFirst` function working', function () {
        const result = Arrays.findFirst([1, 2, 3, 4, 5], n => n === 3);
        expect(result).is.eql(3);
    });

    it('should `findAll` function working', function () {
        function isPrime(n) {
            let start = 2;
            while (start <= Math.sqrt(n)) {
                if (n % start++ < 1) {
                    return false;
                }
            }
            return n > 1;
        }

        const primes = Arrays.findAll([1, 2, 3, 4, 5], isPrime);
        expect(primes).is.eql([2, 3, 5]);
    });

    it('should `deleteByIndex` function working', function () {
        expect(Arrays.deleteByIndex([1, 2, 3, 4, 5], 0)).is.eql([2, 3, 4, 5]);
        expect(Arrays.deleteByIndex([1, 2, 3, 4, 5], 4)).is.eql([1, 2, 3, 4]);
        expect(Arrays.deleteByIndex([1, 2, 3, 4, 5], 5)).is.eql([1, 2, 3, 4, 5]);    // nothing append
    });

    it('should `insert` function working', function () {
        expect(Arrays.insert([1, 2, 3, 4, 5], 0, -2, -1)).is.eql([-2, -1, 1, 2, 3, 4, 5]);
        expect(Arrays.insert([1, 2, 3, 4, 5], 5, 6, 7, 8)).is.eql([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should `replace` function working', function () {
        expect(Arrays.replace([1, 2, 3, 4, 5], 0, -2, -1)).is.eql([-2, -1, 2, 3, 4, 5]);
        expect(Arrays.replace([1, 2, 3, 4, 5], 4, 6, 7, 8)).is.eql([1, 2, 3, 4, 6, 7, 8]);
    });

    it('should `map` function working', function () {
        expect(Arrays.map([1, 2, 3, 4, 5], n => n * 10)).is.eql([10, 20, 30, 40, 50]);
    });
});