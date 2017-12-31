import EventEmitter from "events";

let THROW_ERROR = false;

export function throwErrorThisTime() {
    THROW_ERROR = true;
}

export function after(ms) {
    const emitter = new EventEmitter();

    setTimeout(() => {
        if (THROW_ERROR) {
            emitter.emit('error', 'Error caused');
        } else {
            emitter.emit('success', 'OK');
        }
    }, ms);

    return emitter;
}