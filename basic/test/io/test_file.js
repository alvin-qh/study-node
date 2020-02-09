import {expect} from "chai";

import {Paths} from "../../src/io/file";

import path from "path";

describe('Test Paths class', () => {

    it('should normalize path', async function () {
        const paths = new Paths('/a/b/c/d/../e');

        expect(paths.normalize().path).is.equal('/a/b/c/e');
    });

    it('should join path', async function () {
        const paths = new Paths('/a');
        const newPath = paths.join('b', 'c/d', new Paths('..'), 'e');

        expect(newPath.normalize().path).is.equal('/a/b/c/e');
    });

    it('should resolve path', async function () {
        let paths = new Paths('/a/b/c/d');
        let newPath = paths.resolve('../e');
        expect(newPath.normalize().path).is.equal('/a/b/c/e');

        // 相对路径自行解析为绝对路径
        paths = new Paths('.');
        newPath = paths.resolve('test/io/foo.js');
        expect(newPath.normalize().path).is.equal(__dirname + '/foo.js');

        paths = new Paths('./test/io/a/b');
        newPath = paths.resolve();
        expect(newPath.normalize().path).is.equal(__dirname + '/a/b');
    });

    it('should relative path', async function () {
        let paths = new Paths('/a/b/c');
        let newPath = paths.relative('/a/b/e');
        expect(newPath.normalize().path).is.equal('../e');

        paths = new Paths('/a/b/c');
        newPath = paths.relative('/d');
        expect(newPath.normalize().path).is.equal('../../../d');

        paths = new Paths('./a/b');
        newPath = paths.relative('../d');
        expect(newPath.normalize().path).is.equal('../../../d');
    });

    it('should get dirname', async function () {
        const paths = new Paths('/a/b/c');
        expect(paths.dirname).is.equal('/a/b');
    });

    it('should get basename', async function () {
        const paths = new Paths('/a/b/c.txt');
        expect(paths.basename).is.equal('c.txt');
    });

    it('should get extname', async function () {
        const paths = new Paths('/a/b/c.txt');
        expect(paths.extname).is.equal('.txt');
    });
});

