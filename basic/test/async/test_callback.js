import {expect} from "chai";
import {after, throwErrorThisTime} from "../../src/async/callback";

describe('Test callback', () => {
	it("Test callback successful", cb => {
		after(100, msg => {
			expect(msg).is.eql("OK");
			cb();
		}, err => {
			expect.fail();
			cb();
		});
	});

	it("Test callback error", cb => {
		throwErrorThisTime();

		after(100, msg => {
			expect.fail();
			cb();
		}, err => {
			expect(err).is.eql("Error caused");
			cb();
		});
	});
});