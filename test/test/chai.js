'use strict';

import {describe, it} from "mocha";
import {expect} from "chai";

/**
 * Test should module
 */
describe('Test "should" module', function () {
    it('test "expect(obj).to ..."', function () {

        // be / not be
        expect(false).not.be.ok;
        expect(false).be.false;

        expect('').not.be.ok;
        expect(null).not.be.ok;
        expect(null).be.null;

        expect(undefined).not.be.ok;
        expect(undefined).be.undefined;

        expect(NaN).not.be.ok;
        expect(NaN).be.NaN;

        expect(true).be.ok;


        const obj = {a: 100};

        // equal / deep equal
        expect('Hello').equal('Hello');
        expect('Hello').not.equal('hello');
        expect(obj).equal(obj);
        expect(obj).not.equal({a: 100});
        expect(obj).deep.equal({a: 100});
        expect(obj).eql({a: 100});   // equate to `be.deep.equal`

        // a / an
        expect(obj).is.an('object');
        expect(obj).not.is.a('string');

        // have / have any / have all
        expect(obj).to.have.property('a');
        expect(obj).not.to.have.property('b');

        expect(obj).to.have.any.key('a', 'b');
        expect(obj).not.to.have.all.key('a', 'b');


        const array = [1, 2, 3];

        // include / contains
        expect(array).include(2);
        expect('hello').include('llo');
        expect(array).includes(1, 2);
        expect(array).contains(1, 2);
        expect(obj).include.keys('a');
        expect(obj).contains.keys('a');

        // instanceof
        expect(array).be.an.instanceof(Array);
        expect(obj).be.an.instanceof(Object);

        // within
        expect(12).be.within(10, 13);

        // length
        expect(array).be.have.length;
        expect(array).be.have.length.within(1, 4);
    });
});