import should from "should";

/**
 * Test should module
 */
describe('Test "should" module', function () {

    const user = {
        name: 'Alvin'
    };

    it('should "have.property" work', function () {
        user.should.have.property('name', 'Alvin');
    });

    it('should "not.have.property" work', function () {
        user.should.not.have.property('age', 22);
    });

    it('should "be/not be" work', function () {
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
