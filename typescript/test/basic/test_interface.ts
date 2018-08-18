import {expect} from "chai";
import {Gender} from "../../src/basic/types";
import * as deepEqual from "deep-eql";
import {Array, Executor, Person, Rectangle, Runnable, Size} from "../../src/basic/interface";

describe('Test interface', function () {

    it('should object implements from interface', function () {
        const person1: Person = {
            name: 'Alvin',
            // @ts-ignore
            birthday: new Date('1981-03-17'),
            gender: Gender.MALE
        };
        const person2: Person = {
            name: 'Alvin',
            // @ts-ignore
            birthday: new Date('1981-03-17'),
            gender: Gender.MALE
        };
        expect(deepEqual(person1, person2)).to.be.true;

        const person3: Person = {
            name: 'Emma',
            // @ts-ignore
            birthday: new Date('1985-03-29'),
            gender: Gender.FEMALE
        };
        expect(deepEqual(person1, person3)).to.not.be.true;
    });

    it('should function implements interface', function () {
        const runner: Runnable = name => `${name} is running`;

        expect(runner('Work1')).to.be.eql('Work1 is running');
    });

    it('should interface include another one', function () {
        let executor: Executor = {
            scope: 'RUNTIME',
            run(name) {
                return `${name} is running in ${this.scope}`
            }
        };

        expect(executor.run('Work1')).to.be.eql('Work1 is running in RUNTIME');
    });

    it('should ignore optional property', function () {
        const executor: Executor = {
            run(name) {
                return `${name} is running in ${this.scope || 'MISSING'}`
            }
        };

        expect(executor.run('Work1')).to.be.eql('Work1 is running in MISSING');
    });

    it('should change readonly property', function () {
        const size: Size = {
            width: 100,
            height: 200,
            area() {
                return this.width * this.height;
            }
        };

        expect(size.area()).to.be.eql(20000);

        size.width = 200;
        // size.height = 300;
        expect(size.area()).to.be.eql(40000);
    });

    it('should index property work', function () {
        const array: Array = {
            0: 1,
            1: 'OK',
            'name': 'Alvin'
        };

        expect(array[0]).to.be.eq(1);
        expect(array[1]).to.be.eq('OK');
        expect(array['name']).to.be.eq('Alvin');
    });

    it('should class implements interface', function () {
        const rect: Rectangle = new Rectangle(0, 0, 100, 200);

        expect(rect.width).to.be.eq(100);
        expect(rect.height).to.be.eq(200);
        expect(rect.area()).to.be.eq(20000);
    });
});