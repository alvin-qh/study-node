'use strict';

class Range {
    constructor(min, max, step) {
        this._min = min;
        this._max = max;
        this._step = step;
        this._breaked = false;
    }

    isBreak() {
        return this._breaked;
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
            },
            return() {
                self._breaked = true;
                return {done: true};
            },
            throw() {
                self._breaked = true;
                return {done: true};
            }
        }
    }
}

export default Range;