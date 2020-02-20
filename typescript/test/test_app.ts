import {expect} from "chai";
import {Person, appendPerson, hasPersonInQueue, stop, isStop, main} from "../app"

describe('test "app" module', () => {

    it('should "Person" to string is working', () => {
        const person = new Person('Alvin', 'F', new Date('1981-3-17'));
        expect(person.toString()).is.equal('Alvin, F, born on 1981-3-17', 'Person::toString error');
    });

    it('should "appendPerson" function is working', () => {
        const person = new Person('Alvin', 'F', new Date('1981-3-17'));
        appendPerson(person);
        expect(hasPersonInQueue()).is.true;
    });

    it('should "stop" function is working', done => {
        main(['500']).then(() => done());

        stop();
        expect(isStop()).is.true;
    });
});
