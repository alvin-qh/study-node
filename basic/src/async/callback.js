let THROW_ERROR = false;

function throwErrorThisTime() {
	THROW_ERROR = true;
}

function after(ms, success, error) {
	setTimeout(() => {
		if (THROW_ERROR) {
			error("Error caused");
		} else {
			success("OK");
		}
	}, ms);
}

export {throwErrorThisTime, after};