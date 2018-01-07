import {expect} from "chai";
import {Worker} from "../../src/basic/oop";

describe('Test `Person` class and its child classes', function () {

    it('should `Work` class is a child of `Person`', function () {
        const worker = new Worker('Alvin', 34, 'M', 'Programming');

        expect(worker.information).is.eql('name: Alvin, age: 34 and gender: 男');
        expect(worker.toString()).is.eql('name: Alvin, age: 34 and gender: 男 and working with: Programming');
        expect(worker.getGender()).is.eql('男');
    });

    it('should `getter/setter` working', function () {
        const worker = new Worker('Alvin', 34, 'M', 'Programming');
        expect(worker.myWork).is.eql('Programming');

        worker.myWork = 'Teacher';
        expect(worker.myWork).is.eql('Teacher');
    });

    it('should `static` function working', function () {
        const worker = new Worker('Alvin', 34, 'M', 'Programming');
        const other = Worker.copy(worker);

        expect(worker).is.eql(other);
    });
});