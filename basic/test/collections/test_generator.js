import {expect} from "chai";
import {Range} from "../../src/collections/generator";

describe('Test generator', () => {

	it('test `Range` class', () => {
		const range = new Range(1, 5, 1);

		expect(Array.from(range)).to.deep.eq([1, 2, 3, 4]);
	});

	it('test completed loop', () => {
		const range = new Range(1, 5, 1);

		for (let n of range) {
		}

		expect(range.isBreak()).to.be.false;
	});

	it('test break loop', () => {
		const range = new Range(1, 5, 1);

		for (let n of range) {
			if (n === 3) {
				break;
			}
		}

		expect(range.isBreak()).to.be.true;
	});

	it('test throw loop', () => {
		const range = new Range(1, 5, 1);

		try {
			for (let n of range) {
				if (n === 3) {
					throw Error();
				}
			}
		} catch (ignore) {
		}

		expect(range.isBreak()).to.be.true;
	});
});