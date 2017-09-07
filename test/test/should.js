'use strict';

import should from "should";

/**
 * Test should module
 */
describe('Test "should" module', () => {
    let user = {
        name: 'Alvin'
    };

    it('test "should.have.property(name, value)"', () => {
        user.should.have.property('name', 'Alvin');
    });

    it('test "should.not.have.property"', () => {
        user.should.not.have.property('age', 22);
    });

    it('test "should(obj).be.ok()" / "should(obj).not.be.ok()"', () => {
        should(false).not.be.ok();
        should('').not.be.ok();
        should(null).not.be.ok();
        should(undefined).not.be.ok();
        should(NaN).not.be.ok();

        should(true).be.ok();
        should('Hello').be.ok();
        should([]).be.ok();
        should(100).be.ok();
    });
});
