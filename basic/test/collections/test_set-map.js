import {expect} from "chai";
import {mapOf, setOf} from "../../src/collections/set-map";

describe('Test `Set` object', function () {

    it('should `Set` contains unique elements', function () {
        const set = setOf(1, 2, 3, 4, 5, 4, 3, 2, 1);
        expect([...set]).is.eql([1, 2, 3, 4, 5]);

        set.add(6);
        expect([...set]).is.eql([1, 2, 3, 4, 5, 6]);

        set.add(2);
        expect([...set]).is.eql([1, 2, 3, 4, 5, 6]);

        expect(set.has(2)).is.true;
        expect(set.has(0)).is.false;

        set.delete(2);
        expect(set.has(2)).is.false;

        expect([...set.entries()]).is.eql([[1, 1], [3, 3], [4, 4], [5, 5], [6, 6]]);

        set.clear();
        expect(set.size).is.eql(0);
    });

    it('should `Map` contains key/value pairs', function () {
        const map = mapOf(['a', 1], ['b', 2]);
        expect(map.size).is.eql(2);
        expect([...map]).is.eql([['a', 1], ['b', 2]]);

        const val = map.get('b');
        expect(val).is.eq(2);

        map.set('b', 3);
        expect(map.size).is.eql(2);
        expect([...map]).is.eql([['a', 1], ['b', 3]]);

        map.set('c', 2);
        expect(map.size).is.eql(3);
        expect([...map]).is.eql([['a', 1], ['b', 3], ['c', 2]]);

        map.delete('b');
        expect(map.size).is.eql(2);
        expect(map.get('b')).is.undefined;

        expect([...map.entries()]).is.eql([["a", 1], ["c", 2]]);

        map.clear();
        expect(map.size).is.eql(0);
    });
});