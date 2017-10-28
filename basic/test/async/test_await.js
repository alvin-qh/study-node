import {expect} from "chai";
import {after, throwErrorThisTime} from "../../src/async/await";

describe('Test promise', () => {
	it("Test promise successful", async () => {
		const msg = await after(100);
		expect(msg).is.eql('OK');
	});

	it("Test promise error", async () => {
		throwErrorThisTime();

		try {
			const msg = await after(100)
		} catch (msg) {
			expect(msg).is.eql('Error caused');
		}
	});
});