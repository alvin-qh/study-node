import {expect} from "chai";
import {tag} from "../../src/basic/template";

describe('Test string template', () => {

	it('test tag function', () => {
        const a = 10, b = 20;
        expect(`Hello world ${a} ${b}`).is.eql('Hello world 10 20');

		const result = tag `Hello world ${a} ${b}`;
		expect(result.strings).is.eql(['Hello world ', ' ', '']);
		expect(result.values).is.eql([10, 20]);
	});
});