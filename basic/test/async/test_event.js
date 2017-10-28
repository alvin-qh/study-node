import {expect} from "chai";
import {after, throwErrorThisTime} from "../../src/async/event";

describe('Test event', () => {
	it("Test event successful", cb => {
		const emitter = after(100);
		emitter.on('success', msg => {
			expect(msg).is.eql("OK");
			cb();
		});
	});

	it("Test event error", cb => {
		throwErrorThisTime();

		const emitter = after(100);
		emitter.on('error', msg => {
			expect(msg).is.eql('Error caused');
			cb();
		});
	});
});