import {expect} from "chai";
import {xrange} from "../../src/collections/iterator";
import Arrays from "../../src/collections/arrays";

describe('Test arrays', () => {

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

	it('test `from` function', () => {
		expect(Arrays.from(xrange(1, 5))).to.deep.equal([1, 2, 3, 4]);

		const array = [1, 2, 3];
		expect(Arrays.from(array, n => 10 + n)).to.deep.equal([11, 12, 13]);
	});

	it('test `find` function', () => {
		const result = Arrays.findFirst([1, 2, 3, 4, 5], n => n === 3);
		expect(result).to.equal(3);
	});

	it('test `findAll` function', () => {
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
		expect(primes).is.deep.equal([2, 3, 5]);
	});

	it('test `deleteByIndex` function', () => {
		expect(Arrays.deleteByIndex([1, 2, 3, 4, 5], 0)).to.deep.equal([2, 3, 4, 5]);
		expect(Arrays.deleteByIndex([1, 2, 3, 4, 5], 4)).to.deep.equal([1, 2, 3, 4]);
		expect(Arrays.deleteByIndex([1, 2, 3, 4, 5], 5)).to.deep.equal([1, 2, 3, 4, 5]);    // nothing append
	});

	it('test `insert` function', () => {
		expect(Arrays.insert([1, 2, 3, 4, 5], 0, -2, -1)).to.deep.equal([-2, -1, 1, 2, 3, 4, 5]);
		expect(Arrays.insert([1, 2, 3, 4, 5], 5, 6, 7, 8)).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8]);
	});

	it('test `replace` function', () => {
		expect(Arrays.replace([1, 2, 3, 4, 5], 0, -2, -1)).to.deep.equal([-2, -1, 2, 3, 4, 5]);
		expect(Arrays.replace([1, 2, 3, 4, 5], 4, 6, 7, 8)).to.deep.equal([1, 2, 3, 4, 6, 7, 8]);
	});

	it('test `map` function', () => {
		expect(Arrays.map([1, 2, 3, 4, 5], n => n * 10)).to.deep.equal([10, 20, 30, 40, 50]);
	});
});