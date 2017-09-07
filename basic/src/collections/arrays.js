'use strict';

export default {
    isArray(obj) {
        return Array.isArray(obj);
    },

    of(...args) {
        return Array.of(...args);
    },

    map(array, mapFn) {
        return Array.from(array, mapFn);
    },

    find(array, equalFn) {
        const index = array.findIndex(equalFn);
        if (index < 0) {
            return [];
        }
        return array[index];
    }
};