import {expect} from "chai";
import {Gender} from "../../src/basic/types";

describe('Test enum', function () {

    it('should enum has number value', function () {
        expect(Gender.MALE).to.be.eq(0);
    });

    it('should enum has string name', function () {
        expect(Gender[Gender.FEMALE]).to.be.eq('FEMALE');
        expect(Gender[0]).to.be.eq('MALE');
    });
}); 