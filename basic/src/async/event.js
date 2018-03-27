import EventEmitter from "events";

export function after(success, ms) {
    const emitter = new EventEmitter();

    setTimeout(() => {
        if (success) {
            emitter.emit('success', 'OK');
        } else {
            emitter.emit('error', 'Error caused');
        }
    }, ms);

    return emitter;
}