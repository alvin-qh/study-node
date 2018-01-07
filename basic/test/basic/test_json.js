import {expect} from "chai";
import {fromJson, toJson, fromJson_es5} from "../../src/basic/json";

describe('Test `JSON` utils', function () {
    const JSON = '{"a":100,"b":"Hello","c":false,"d":{"type":"array","value":[1,2,3]}}';
    const OBJ = {
        a: 100,
        b: "Hello",
        c: false,
        d: {
            type: "array",
            value: [1, 2, 3]
        }
    };

    it('should `fromJson` convert json string to object', function () {
        expect(fromJson('{}')).is.eql({});
        expect(fromJson('true')).is.eql(true);
        expect(fromJson('"foo"')).is.eql('foo');
        expect(fromJson('[1, 5, "false"]')).is.eql([1, 5, 'false']);
        expect(fromJson('null')).is.eql(null);

        const obj1 = fromJson(JSON);
        expect(obj1).is.eql(OBJ);

        const obj2 = fromJson_es5(JSON);
        expect(obj2).is.eql(OBJ);
    });

    it('should `toJson` convert object to json string', function () {
        const json = toJson(OBJ);

        expect(json).is.eql(JSON);
    });
});