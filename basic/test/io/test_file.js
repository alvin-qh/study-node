import {expect} from "chai";

import Paths from '../../src/io/file';

describe('Test Paths class', () => {

    it('should normalize path', async function () {
        const paths = new Paths('/a/b/c/d/../e');

        expect(paths.normalize.path).is.equal('/a/b/c/e');
    });

    it('should join path', async function () {
        const paths = new Paths('/a');
        const newPath = paths.join('b', 'c/d', new Paths('..'), 'e');

        expect(newPath.path).is.equal('/a/b/c/e');
    });

    it('should resolve path', async function () {
        let paths = new Paths('/a/b/c/d');
        let newPath = paths.resolve('../e');
        expect(newPath.path).is.equal('/a/b/c/e');

        // 相对路径自行解析为绝对路径
        paths = new Paths('.');
        newPath = paths.resolve('test/io/foo.js');
        expect(newPath.path).is.equal(__dirname + '/foo.js');

        paths = new Paths('./test/io/a/b');
        newPath = paths.resolve();
        expect(newPath.path).is.equal(__dirname + '/a/b');
    });

    it('should relative path', async function () {
        let paths = new Paths('/a/b/c/d');
        let newPath = paths.resolve('../e');
        expect(newPath.path).is.equal('/a/b/c/e');

        // 相对路径自行解析为绝对路径
        paths = new Paths('.');
        newPath = paths.resolve('test/io/foo.js');
        expect(newPath.path).is.equal(__dirname + '/foo.js');

        paths = new Paths('./test/io/a/b');
        newPath = paths.resolve();
        expect(newPath.path).is.equal(__dirname + '/a/b');
    });
});

