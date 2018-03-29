/**
 * glob文件串流演示
 */
import glob from "glob";

export default function (pattern) {
    return new Promise((resolve, reject) => {
        glob(pattern, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}