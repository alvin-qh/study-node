#!/usr/bin/env node

'use strict';

let assert = require('assert');

/**
 * Buffer类用于存储一系列byte，可以将字符串，数字等数据转换为byte后存入
 */
(function () {
    // 通过字符串实例化Buffer对象
    let str = new Buffer('Hello大家好', 'utf8');
    assert.ok(Buffer.isBuffer(str));
    // 获取字符串长度为5
    assert.equal(str.length, 14);
    assert.equal(str.byteLength, str.length);

    // 前5个字节的内容
    assert.equal(str.toString("utf8", 0, 5), 'Hello');
    // 5个字节之后的内容
    assert.equal(str.toString("utf8", 5), '大家好');
    // 第一个字符的编码
    assert.equal(str[0], 72);
    // 第二个字符的编码转为字符
    assert.equal(String.fromCharCode(str[1]), 'e');

    // 将大于一个byte的数字存入缓存
    let buffer = new Buffer([1, 0xFF7F]);
    assert.deepEqual([...buffer], [1, 127]);    // 大于一个byte的数值存入Buffer会被截断，只存储一个byte
})();


/**
 * 可以将其他存储数据的内存转为Buffer，进一步解码为字符串
 */
(function () {
    // 实例化一个存储5个byte的二进制缓存
    let int8 = new Int8Array([104, 101, 108, 108, 111]);
    // 利用二进制缓存实例化Buffer对象
    let str = new Buffer(int8.buffer, 'ascii');

    assert.equal(str.length, 5);
    // 解码缓存内容
    assert.equal(str.toString("ascii"), 'hello');
})();


/**
 * 可以向缓存内写入指定长度的内容
 */
(function () {
    // 创建1024字节的缓存
    let buffer = new Buffer(1024);
    assert.equal(buffer.length, 1024);

    // 写入字符串，并得到写入的总字节数
    let len = buffer.write('Hello大家好', 'utf8');
    assert.equal(len, 14);
    assert.equal(buffer.toString('utf8', 0, len), 'Hello大家好');

    // 重新写入字符串会覆盖之前写入的内容
    len = buffer.write('Welcome to node.js', 'utf8');
    assert.equal(len, 18);
    assert.equal(buffer.toString('utf8', 0, len), 'Welcome to node.js');

    // 写入时可以设置偏移量，以避免覆盖之前写入的内容
    len += buffer.write(' Hello大家好', len, 'utf8');
    assert.equal(len, 33);
    assert.equal(buffer.toString('utf8', 0, len), 'Welcome to node.js Hello大家好');

    // 也可以设置写入缓冲内容的上限，例如只写入4个字节
    len += buffer.write('12345', len, 4, 'utf8');
    assert.equal(len, 37);
    assert.equal(buffer.toString('utf8', 0, len), 'Welcome to node.js Hello大家好1234');
})();


/**
 * 利用Buffer可以很容易的进行编码转换
 */
(function () {
    // 创建包含字符串的缓存对象
    let buffer = new Buffer('Hello大家好', 'utf8');
    assert.equal(buffer.length, 14); // utf-8编码，14个字节

    buffer = new Buffer(buffer.toString('utf8'), 'ucs2');
    assert.equal(buffer.length, 16); // ucs2编码，16个字节
    assert.equal(buffer.toString('ucs2'), 'Hello大家好'); // 完成编码转换
})();


/**
 * 将内存数据进行copy
 */
(function () {
    // 存储5个byte的缓存
    let buf1 = new Buffer([1, 2, 3, 4, 5, 6]);
    let buf2 = new Buffer(buf1.length);

    // 将buf2以0填充
    buf2.fill(0);

    // 将buf1的内容copy到buf2中
    // buf1   1 2 3 4 5 6
    //          ^   ^
    // buf2   0 0 0 0 0 0
    //            ^   ^
    //        0 0 2 3 4 0
    buf1.copy(buf2, 2, 1, 4);
    assert.deepEqual([...buf2], [0, 0, 2, 3, 4, 0]);

})();


/**
 * 以JSON表示内存数据
 */
(function () {
    let str = new Buffer('大家好', 'utf8');
    assert.equal(str.length, 9);
    assert.deepEqual(str.toJSON(), {type: 'Buffer', data: [229, 164, 167, 229, 174, 182, 229, 165, 189]});
})();


/**
 * Base64
 */
(function () {
    // 将字符串编码后存入buffer
    let buffer = new Buffer('大家好', 'utf8');
    // 将buffer内容转为base64编码
    let base64 = buffer.toString('base64');
    // 将base64编码转回buffer，并以utf8解码
    assert.equal(new Buffer(base64, 'base64').toString('utf8'), '大家好');

    // 将byte数组编码后存入buffer
    buffer = new Buffer([1, 2, 3, 4, 5, 6]);
    // 将buffer内容转为base64编码
    base64 = buffer.toString('base64');
    // 将base64编码转回buffer
    assert.deepEqual(Array.from(new Buffer(base64, 'base64')), [1, 2, 3, 4, 5, 6]);
})();


/**
 * 测试TypedArray，用于存储不同类型数据，由以下类型实现：
 * Int8Array();
 * Uint8Array();
 * Uint8ClampedArray();
 * Int16Array();
 * Uint16Array();
 * Int32Array();
 * Uint32Array();
 * Float32Array();
 * Float64Array();
 */
(function () {
    let int8 = new Int8Array(5);

    // 该类型集合每个元素1字节
    assert.equal(int8.BYTES_PER_ELEMENT, 1);
    // 集合长度
    assert.equal(int8.length, 5);
    // 集合所占的byte数
    assert.equal(int8.byteLength, 5);
    // 集合缓冲的偏移量
    assert.equal(int8.byteOffset, 0);

    // 在数组的指定位置存储一个byte
    int8[4] = 0x7F;
    assert.equal(int8[4], 127);

    // 存储大于
    int8[4] = 0xFF7F;
    assert.equal(int8[4], 127);


    let int32 = new Uint32Array(5);

    // 该类型集合每个元素1字节
    assert.equal(int32.BYTES_PER_ELEMENT, 4);
    assert.equal(int32.length, 5);
    assert.equal(int32.byteLength, 20);
    assert.equal(int32.byteOffset, 0);

})();


/**
 * 测试ArrayBuffer，用于存储数据的缓冲对象，存储单位为字节
 */
(function () {
    // 设置元素内容
    let int32 = new Int32Array([1, 1000, 2, 2000, 3]);
    assert.deepEqual(Array.from(int32), [1, 1000, 2, 2000, 3]);

    // 将int32数组的内存数据存储到int8数组中
    let int8 = new Int8Array(int32.buffer);
    assert.equal(int8.byteLength, int32.byteLength);
    assert.equal(int8.length, int32.length * 4);
    assert.deepEqual(int8, new Int8Array([
        0x01, 0x00, 0x00, 0x00,     // 0001 0000 0000 0000 (1)
        0xE8, 0x03, 0x00, 0x00,     // 1110 1000 0000 0011 (1000)
        0x02, 0x00, 0x00, 0x00,     // 0002 0000 0000 0000 (2)
        0xD0, 0x07, 0x00, 0x00,     // 1101 0000 0000 0111 (2000)
        0x03, 0x00, 0x00, 0x00      // 0003 0000 0000 0000 (3)
    ]));

    // 将int32数组的内存数据存储到int8数组中，偏移4个字节
    int8 = new Int8Array(int32.buffer, 4);
    assert.equal(int8.byteLength, int32.byteLength - 4); // 数组byte长度相差4字节
    assert.equal(int8.length, (int32.length - 1) * 4);   // 数组长度相差4个元素
    assert.equal(int8.byteOffset, 4);   // 缓存偏移量4字节
    (function (except) {
        for (let i = 0; i < int8.length; i++) {
            assert.equal(int8[i], except[i]);
        }
    })(new Int8Array([
        0xE8, 0x03, 0x00, 0x00,     // 1110 1000 0000 0011 (1000)
        0x02, 0x00, 0x00, 0x00,     // 0002 0000 0000 0000 (2)
        0xD0, 0x07, 0x00, 0x00,     // 1101 0000 0000 0111 (2000)
        0x03, 0x00, 0x00, 0x00      // 0003 0000 0000 0000 (3)
    ]));

    // 获取int32数组的内存数据
    let buffer = int32.buffer;
    assert.equal(buffer.byteLength, int32.length * 4);

    // 截取8个字节内容
    let sub = buffer.slice(0, 8);
    assert.deepEqual([...new Int32Array(sub)], [1, 1000]);

})();


/**
 * DataView用于读取和设置ArrayBuffer控制内存
 */
(function () {
    // 定义4字节的byte数组
    let int8 = new Int8Array(4);
    // 使用DataView关联到byte数组的内存上
    let dv = new DataView(int8.buffer);

    // 在偏移量0的位置写入一个32位整数
    dv.setInt32(0, 0x1F2F3F4F);
    // 读取byte数组内容，其内存数据已被DataView对象改变
    assert.deepEqual([...int8].map(n => n.toString(16).toUpperCase()), ['1F', '2F', '3F', '4F']);

    // 设置32位数值数组，写入一个整数
    let int32 = new Int32Array([0x1A2A3A4A]);

    // 将DataView对象关联到32位数组上, 偏移量为0，访问4字节
    dv = new DataView(int32.buffer, 0, 4);

    // 通过DataView按字节读取
    assert.equal(dv.getInt8(0).toString(16).toUpperCase(), '4A');
    assert.equal(dv.getInt8(1).toString(16).toUpperCase(), '3A');
    assert.equal(dv.getInt8(2).toString(16).toUpperCase(), '2A');
    assert.equal(dv.getInt8(3).toString(16).toUpperCase(), '1A');
})();
