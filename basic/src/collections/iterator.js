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

    [Symbol.iterator]() {
        const self = this;
        let cur = this._min;

        return {
            next() {
                let res;
                if (cur < self._max) {
                    res = {done: false, value: cur};
                    cur += self._step;
                } else {
                    res = {done: true};
                }
                return res;
            }
        }
    }
}


export {xrange, double_xrange, array_iter, Range};