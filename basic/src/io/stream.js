import assert from "assert";

import fs from "fs";

import path from "path";

import file from "./file";

/**
 * 用于比较文件内容的assertion
 * @param filename 文件名
 * @param str 要比较的文件内容
 * @param encoding 字符编码
 */
assert.fileContentEqual = function (filename, str, encoding) {
    encoding = encoding || 'utf8';
    fs.readFile(filename, encoding, (err, data) => {
        assert.ifError(err);
        assert.equal(data, str);
    });
};

/**
 * 测试'WriteStream.write(str/buffer[, option])'方法, callback方式
 */
(function () {
    let filename = './temp/t5/test_write_callback.txt';
    let basedir = path.dirname(filename);

    /**
     * makeDir函数回调函数
     */
    function makeDirCallback(err) {
        assert.ifError(err);

        // 创建写入流
        let ws = fs.createWriteStream(filename);
        // 判断流是否可以写入
        assert.ok(ws.writable);

        // 设置默认状态下写入内容的编码
        ws.setDefaultEncoding('utf8');

        // 写入信息
        ws.write('Hello', () => {
            // Do nothing when write complete
        });

        // 写入最后一条信息
        ws.end(new Buffer(' World', 'utf8'), () => {
            // 判断文件写入的内容
            assert.fileContentEqual(filename, 'Hello World');
        });
    }

    file.removeDir(basedir, false, err => {
        assert.ifError(err);
        file.makeDir(basedir, makeDirCallback);
    });
})();


/**
 * 测试'WriteStream.write(str/buffer[, option])'方法, event方式
 */
(function () {
    let filename = './temp/t5/test_write_event.txt';
    let basedir = path.dirname(filename);

    /**
     * makeDir函数回调函数
     */
    function makeDirCallback(err) {
        assert.ifError(err);

        // 创建写入流
        let ws = fs.createWriteStream(filename);
        // 判断流是否可以写入
        assert.ok(ws.writable);

        ws.on('drain', function () {
            console.log('year')
        });

        // 设置默认状态下写入内容的编码
        ws.setDefaultEncoding('utf8');

        for (let i = 0; i < 10000; i++) {
            // 写入信息
            ws.write('Hello');
            ws.write('\n');
        }

        // 写入最后一条信息
        //ws.end(new Buffer(' World', 'utf8'));
    }

    file.removeDir(basedir, false, err => {
        assert.ifError(err);
        file.makeDir(basedir, makeDirCallback);
    });
})();
