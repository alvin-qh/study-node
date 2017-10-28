import EventEmitter from "events";

let THROW_ERROR = false;

function throwErrorThisTime() {
	THROW_ERROR = true;
}

function after(ms) {
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

export {throwErrorThisTime, after};