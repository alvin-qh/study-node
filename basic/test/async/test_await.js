import {expect} from "chai";
import {after} from "../../src/async/promise";

describe('Test await', function () {

    it('should `await` successful', async function () {
        const msg = await after(true, 100);
        expect(msg).is.eql('OK');
    });

    it('should `await` error', async function () {
        try {
            await after(false, 100)
        } catch (e) {
            expect(e).is.eql('Error caused');
        }
    });

    it('should `await` async success', function (cb) {

        async function runSuccess() {
            return await after(true, 100);
        }

        runSuccess()
            .then(msg => {
                expect(msg).is.eql('OK');
                cb();
            })
            .catch(() => {
                expect.fail();
            });
    });

    it('should `await` async error', function (cb) {

        async function runError() {
            return await after(false, 100);
        }

        runError()
            .then(() => {
                expect.fail();
            })
            .catch(err => {
                expect(err).is.eql('Error caused');
                cb()
            });
    });

    it('should `await` async run in order', async function () {
        const time = process.uptime();

        await after(true, 100);
        await after(true, 100);
        await after(true, 100);

        expect((process.uptime() - time) * 1000).is.above(300);
    });

    it('should `await` async run in same times', function (cb) {
        const time = process.uptime();

        Promise.all([
            after(true, 100),
            after(true, 100),
            after(true, 100)
        ]).then(result => {
            expect((process.uptime() - time) * 1000).is.below(150);
            expect(result).is.deep.equal(['OK', 'OK', 'OK']);
            cb();
        });
    });
});