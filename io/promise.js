#!/usr/bin/env node

'use strict';

let Promise = require('promise');
let assert = require('assert');

let promise = new Promise((resolve) => {
    resolve('hello');
});

promise.then((s) => {
    assert.equal(s, 'hello');
    return new Promise((resolve) => {
        resolve('ok');
    });
}).then((s) => {
    assert.equal(s, 'ok');
    return new Promise((resolve, reject) => {
        reject('Error');
    });
}).catch((err) => {
    assert.equal('err', 'Error');
});