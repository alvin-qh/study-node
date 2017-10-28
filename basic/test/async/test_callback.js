import {expect} from "chai";
import {callback} from "../../src/async/callback";

describe('Test callback', () => {

	it("Test callback successful", cb => {
		callback(100, msg => {
			expect(msg).is.eql("OK");
			cb();
		}, err => {
			cb();
		})
	})
});