import {expect} from "chai";
import {makeNamedSymbol, makeUniqueSymbol} from "../../src/basic/symbol";

describe("Test symbol", function () {

    it('should unique symbols are different', function () {
        const s1 = makeUniqueSymbol("symbol");
        const s2 = makeUniqueSymbol("symbol");

        expect(s1).is.not.eql(s2);
        expect(s1).is.not.eql(s2);
    });

    it('should named symbols are equals with same name', function () {
        const s1 = makeNamedSymbol("symbol");
        const s2 = makeNamedSymbol("symbol");

        expect(s1).is.eql(s2);
    });

    it('should symbol use for function name', function () {
        const symbol = makeUniqueSymbol('fn');

        const obj = {
            name: 'Alvin',
            [symbol]() {
                return `My name is ${this.name}`;
            }
        };

        expect(obj[symbol]()).is.eql('My name is Alvin');
    });
});
