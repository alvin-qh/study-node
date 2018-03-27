import {expect} from "chai";
import {after} from "../../src/async/promise";

describe('Test promise', function () {

    it('should promise successful', function (cb) {
        after(true, 100)
            .then(msg => {
                expect(msg).is.eql('OK');
                cb();
            });
    });

    it('should promise error', function (cb) {
        after(false, 100)
            .catch(msg => {
                expect(msg).is.eql('Error caused');
                cb();
            });
    });
});