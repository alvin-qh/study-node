import Promise from "promise";

export function after(success, ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (success) {
                resolve('OK');
            } else {
                reject('Error caused');
            }
        }, ms);
    });
}