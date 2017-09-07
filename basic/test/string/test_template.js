'use strict';

import {expect} from "chai";
import tag from "../../src/string/template";


describe('Test string template', () => {

    it('test tag function', () => {
        const a = 10, b = 20;
        const result = tag `Hello world ${a} ${b}`;

        expect(`Hello world ${a} ${b}`).to.equal('Hello world 10 20');
        expect(result.strings).is.deep.equal(['Hello world ', ' ', '']);
        expect(result.values).is.deep.equal([10, 20]);
    });
});