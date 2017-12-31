let THROW_ERROR = false;

export function throwErrorThisTime() {
    THROW_ERROR = true;
}

export function after(ms, success, error) {
    setTimeout(() => {
        if (THROW_ERROR) {
            error("Error caused");
        } else {
            success("OK");
        }
    }, ms);
}
