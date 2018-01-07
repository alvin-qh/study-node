import {expect} from "chai";
import {after, throwErrorThisTime} from "../../src/async/event";

describe('Test event', function () {

    it('should event successful', function (cb) {
        const emitter = after(100);
        emitter.on('success', msg => {
            expect(msg).is.eql("OK");
            cb();
        });
    });

    it('should event error', function (cb) {
        throwErrorThisTime();

        const emitter = after(100);
        emitter.on('error', msg => {
            expect(msg).is.eql('Error caused');
            cb();
        });
    });
});