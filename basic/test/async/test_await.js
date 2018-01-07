import {expect} from "chai";
import {after, throwErrorThisTime} from "../../src/async/promise";

describe('Test await', function () {

    it('should `await` successful', async function () {
        const msg = await after(100);
        expect(msg).is.eql('OK');
    });

    it('should `await` error', async function () {
        throwErrorThisTime();

        try {
            await after(100)
        } catch (e) {
            expect(e).is.eql('Error caused');
        }
    });
});