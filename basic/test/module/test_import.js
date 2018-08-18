import {expect} from "chai";

import Person, * as exp from "../../src/module/exports";
import {add} from "../../src/module/exports";

import * as func from "../../src/module/old_module";

describe('Test module import', () => {

    it('should default export can imported', function () {
        const p = new Person('Alvin', 34, 'M');
        expect(p.name).is.equal('Alvin');
        expect(p.age).is.equal(34);
        expect(p.gender).is.equal('M');
    });

    it('should others export can imported', function () {
        expect(add(1, 2)).is.equal(3);
    });

    it('should all export can imported', function () {
        const p = new exp.default('Alvin', 34, 'M');
        expect(p.name).is.equal('Alvin');
        expect(p.age).is.equal(34);
        expect(p.gender).is.equal('M');

        expect(exp.add(1, 2)).is.equal(3);
    });

    it('should old style module can imported', function () {
        expect(func(1, 2)).is.equal(3);
    });
});