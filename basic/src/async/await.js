import Promise from "promise";

let THROW_ERROR = false;

function throwErrorThisTime() {
	THROW_ERROR = true;
}

function after(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (THROW_ERROR) {
				reject('Error caused');
			} else {
				resolve('OK');
			}
		}, ms);
	});
}

export {throwErrorThisTime, after};