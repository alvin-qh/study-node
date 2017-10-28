import {expect} from "chai";
import call from "../../src/functions/apply-call";

describe('Test function bind', () => {

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

	it('test bind function with object as this', () => {
		const obj = {value: 100};
		expect(call(add, obj)).to.equal(100);
	});

	it('test bind function with object as this and external arguments', () => {
		const obj = {value: 100};
		expect(call(add, obj, 100)).to.equal(200);
	});

	it('test bind function with object as this and arguments', () => {
		const obj = {value: 'Hello'};
		expect(call(add, obj, ' World!')).to.equal('Hello World!');
	});
});