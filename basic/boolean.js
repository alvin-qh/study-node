#!/usr/bin/env node

'use strict';

let assert = require('assert');

// 定义boolean对象
let bool = Boolean(true);
assert.equal(bool, true);

// 将整数转为boolean对象
bool = Boolean(10); // 非0转为true
assert.equal(bool, true);

bool = Boolean(0);  // 0转为false
assert.equal(bool, false);

// 其它转为false的对象
assert.equal(Boolean(''), false);  // 空字符串转为false
assert.equal(Boolean(undefined), false);    // undefined 转为false

bool = Boolean(NaN);
assert.equal(bool, false);

bool = Boolean(null);
assert.equal(bool, false);