import {expect} from "chai";
import {after} from "../../src/async/event";

describe('Test event', function () {

    it('should event successful', function (cb) {
        const emitter = after(true, 100);
        emitter.on('success', msg => {
            expect(msg).is.eql("OK");
            cb();
        });
    });

    it('should event error', function (cb) {
        const emitter = after(false, 100);
        emitter.on('error', msg => {
            expect(msg).is.eql('Error caused');
            cb();
        });
    });
});