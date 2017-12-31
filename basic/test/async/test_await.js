import {expect} from "chai";
import {after, throwErrorThisTime} from "../../src/async/promise";

describe('Test await', () => {

    it("Test await successful", async () => {
        const msg = await after(100);
        expect(msg).is.eql('OK');
    });

    it("Test await error", async () => {
        throwErrorThisTime();

        try {
            await after(100)
        } catch (e) {
            expect(e).is.eql('Error caused');
        }
    });
});