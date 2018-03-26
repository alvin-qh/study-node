import {expect} from "chai";
import path from 'path';

import glob from '../../src/io/glob';

describe('Test glob files', () => {

    it('should find all *.js files', async function () {
        // 匹配'files'目录下所有'js'文件, *表示0或多个任意字符(/**/表示包含src目录及其所有子目录)
        const files = await glob(path.resolve('./test/io/files/**/*.js'));

        expect(files).has.been.length(3);
        expect(files.map(file => path.basename(file))).is.deep.equal(['p-a-src.js', 'p-b-src.js', 'p-c-src.js']);
    });

    it('should find all p-?-src.js files', async function () {
        // ?表示一个任意字符
        const files = await glob(path.resolve('./test/io/files/**/p-?-src.js'));

        expect(files).has.been.length(3);
        expect(files.map(file => path.basename(file))).is.deep.equal(['p-a-src.js', 'p-b-src.js', 'p-c-src.js']);
    });

    it('should find all p-[a-b]-src.* files', async function () {
        // [a-b]表示一个任意字符, 必须为'a, b'中的一个
        // 同理: [a-zA-Z], [a, b, c]等
        const files = await glob(path.resolve('./test/io/files/**/p-[a-b]-src.*'));

        expect(files).has.been.length(2);
        expect(files.map(file => path.basename(file))).is.deep.equal(['p-a-src.js', 'p-b-src.js']);
    });
});

