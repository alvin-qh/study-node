import {expect} from "chai";
import {after, throwErrorThisTime} from "../../src/async/promise";

describe('Test promise', () => {

	it("Test promise successful", cb => {
		after(100)
			.then(msg => {
				expect(msg).is.eql('OK');
				cb();
			});
	});

	it("Test promise error", cb => {
		throwErrorThisTime();

		after(100)
			.catch(msg => {
				expect(msg).is.eql('Error caused');
				cb();
			});
	});
});