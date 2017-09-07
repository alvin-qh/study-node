#!/usr/bin/env node

'use strict';

let assert = require('assert');

/**
 * 解析字符串
 */
(function () {
    // 基本对象
    assert.deepEqual(JSON.parse('{}'), {});
    assert.deepEqual(JSON.parse('true'), true);
    assert.deepEqual(JSON.parse('"foo"'), 'foo');
    assert.deepEqual(JSON.parse('[1, 5, "false"]'), [1, 5, 'false']);
    assert.deepEqual(JSON.parse('null'), null);

    let json = '{"a":100,"b":"Hello","c":false,"d":{"type":"array","value":[1,2,3]}}';
    let obj = JSON.parse(json);
    assert.equal(obj.a, 100);
    assert.equal(obj.b, 'Hello');
    assert.equal(obj.c, false);
    assert.deepEqual(obj.d.type, 'array');
    assert.deepEqual(obj.d.value, [1, 2, 3]);
    assert.deepEqual(obj, eval('(' + json + ')'));
})();

/**
 * 解析对象
 */
(function () {
    let obj = {
        a: 100,
        b: 'Hello',
        c: false,
        d: {
            type: 'array',
            value: [1, 2, 3]
        }
    };

    assert.equal(JSON.stringify(obj), '{"a":100,"b":"Hello","c":false,"d":{"type":"array","value":[1,2,3]}}');
    assert.deepEqual(eval('(' + JSON.stringify(obj) + ')'), obj);
    assert.deepEqual(JSON.parse(JSON.stringify(obj)), obj);
})();
