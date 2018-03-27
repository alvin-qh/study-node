export function after(ok, ms, success, error) {
    setTimeout(() => {
        if (ok) {
            success("OK");
        } else {
            error("Error caused");
        }
    }, ms);
}
