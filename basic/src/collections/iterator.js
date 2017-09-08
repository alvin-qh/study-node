'use strict';

function* xrange(min, max, step) {
    step = step || 1;
    while (min < max) {
        yield min;
        min += step;
    }
}

function* double_xrange(min, max, step) {
    yield* xrange(min, max, step);
    yield* xrange(min, max, step);
}

function array_iter(array) {
    return [...array][Symbol.iterator]();
}

class Range {
    constructor(min, max, step = 1) {
        this._min = min;
        this._max = max;
        this._step = step;
    }

    * [Symbol.iterator]() {
        let cur = this._min;
        while (cur < this._max) {
            yield cur;
            cur += this._step;
        }
    }
}

function get_iterator(array) {
    const obj = {};
    obj[Symbol.iterator] = array[Symbol.iterator].bind(array);
    return obj;
}


export {xrange, double_xrange, array_iter, Range, get_iterator};