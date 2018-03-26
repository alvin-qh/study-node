/**
 * glob文件串流演示
 */
import glob from "glob";

export default function (pattern) {
    return new Promise(function (resolve, reject) {
        glob(pattern, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}
//
// // 匹配'files'目录下所有'js'文件, *表示0或多个任意字符(/**/表示包含src目录及其所有子目录)
// glob("files/**/*.js", (err, files) => {
//     assert.ifError(err);
//     assert.deepEqual(files, ['files/p-a-src.js', 'files/p-b-src.js', 'files/p-c-src.js']);
// });
//
// // ?表示一个任意字符
// glob("files/**/p-?-src.js", (err, files) => {
//     assert.ifError(err);
//     assert.deepEqual(files, ['files/p-a-src.js', 'files/p-b-src.js', 'files/p-c-src.js']);
// });
//
// // [a-b]表示一个任意字符, 必须为'a, b'中的一个
// // 同理: [a-zA-Z], [a, b, c]等
// glob("files/**/p-[a-b]-src.*", (err, files) => {
//     assert.ifError(err);
//     assert.deepEqual(files, ['files/p-a-src.js', 'files/p-b-src.js']);
// });
