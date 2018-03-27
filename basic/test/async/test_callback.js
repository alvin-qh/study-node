import {expect} from "chai";
import {after} from "../../src/async/callback";

describe('Test callback', function () {

    it('should callback successful', function (cb) {
        after(true, 100, msg => {
            expect(msg).is.eql("OK");
            cb();
        }, () => {
            expect.fail();
        });
    });

    it('should callback error', function (cb) {
        after(false, 100, () => {
            expect.fail();
        }, err => {
            expect(err).is.eql("Error caused");
            cb();
        });
    });
});