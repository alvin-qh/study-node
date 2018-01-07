import {expect} from "chai";
import {after, throwErrorThisTime} from "../../src/async/promise";

describe('Test promise', function () {

    it('should promise successful', function (cb) {
        after(100)
            .then(msg => {
                expect(msg).is.eql('OK');
                cb();
            });
    });

    it('should promise error', function (cb) {
        throwErrorThisTime();

        after(100)
            .catch(msg => {
                expect(msg).is.eql('Error caused');
                cb();
            });
    });
});