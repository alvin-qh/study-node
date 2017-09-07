'use strict';

function tag(strings, ...values) {
    return {
        strings: strings,
        values: values
    }
}

export default tag;