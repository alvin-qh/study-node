import {expect} from "chai";
import makeFunction from "../../src/functions/make-function";

describe('Test function bind', () => {

	it('test make simple function', () => {
		const fn = makeFunction(null, 'return a + b;', 'a', 'b');
		expect(fn(1, 2)).is.equal(3);
	});

	it('test make function with this object and external arguments', () => {
		const obj = {value: 100};
		const fn = makeFunction(obj, 'return this.value + a;', 'a');

		expect(fn(100)).is.equal(200);
	});
});