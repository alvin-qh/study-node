import path from "path";


export default class Paths {
    constructor(path_) {
        this.path = path_;
    }

    get normalize() {
        return new Paths(path.normalize(this.path));
    }

    join(...path_) {
        return new Paths(path.join(this.path, ...path_.map(p => p instanceof Paths ? p.path : p)));
    }

    resolve(...path_) {
        return new Paths(path.resolve(this.path, ...path_));
    }

    relative(to) {
        return new Paths(path.relative(this.path, to));
    }
}
//
// /**
//  * 测试path包，用于操作路径
//  */
// (function () {
//     // 'path.resolve([from ...],to)'返回'to'参数所在的绝对路径，from参数个数不定，最终和'to'组成完整的路径
//     // 该方法类似于'path.join'方法，区别在于前者会将相对路径解析为绝对路径，而后者只是简单的字符串处理
//     dir = path.resolve('/a/b/c/d', '../e');
//     assert.equal(dir, '/a/b/c/e');
//
//     dir = path.resolve('.', 'foo.js');
//     assert.equal(dir, __dirname + '/foo.js');
//
//     dir = path.resolve('./a/b');
//     assert.equal(dir, path.join(__dirname, '/a/b'));
//
//     // 'path.relative(from,to)'方法会将'to'参数表示的路径转换为相对于'from'参数表示路径的相对路径
//     dir = path.relative('.', 'a/foo.js');
//     assert.equal(dir, 'a/foo.js');
//
//     dir = path.relative('/a/b/c', '/d/e/f');
//     assert.equal(dir, '../../../d/e/f');
//
//     dir = path.relative('/a/b/c', '/a/b/d/foo.js');
//     assert.equal(dir, '../d/foo.js');
//
//     // 'path.dirname(p)'方法返回'p'参数所表示路径的"路径部分"
//     dir = path.dirname('/a/b/c/d');
//     assert.equal(dir, '/a/b/c');
//
//     // 'path.basename(p,[ext])'方法返回“文件名”，返回的文件名不包含ext参数指定的扩展名
//     dir = path.basename('/a/b/c/foo.js');
//     assert.equal(dir, 'foo.js');
//
//     dir = path.basename('/a/b/c/foo.js', '.js');
//     assert.equal(dir, 'foo');
//
//     // 'path.extname(p)'方法返回'p'参数表示路径的"文件扩展名"
//     dir = path.basename('/a/b/c/foo.js');
//     assert.equal(dir, 'foo.js');
//
// })();
//
//
// /**
//  * 删除指定文件夹（异步方式）
//  * @param dir 要删除的测试文件
//  * @param withDir 是否删除指定路径（false表示只删除文件）
//  * @param callback 回调函数
//  */
// function removeDir(dir, withDir, callback) {
//     // 列举路径下所有文件
//     fs.readdir(dir, (err, files) => {
//         if (err) {  // 出现错误调用回调函数
//             callback(err.code === 'ENOENT' ? undefined : err);
//             return;
//         }
//
//         // 获取目录下文件个数
//         let wait = files.length, count = 0;
//
//         function folderDone(err) {
//             if (++count >= wait || err) {
//                 if (withDir) {
//                     fs.rmdir(dir, callback);
//                 } else {
//                     callback();
//                 }
//             }
//         }
//
//         // 判断目录下是否有文件
//         if (wait == 0) {
//             if (withDir) {
//                 fs.rmdir(dir, callback);   // 如果目录下无文件, 则删除该目录
//             } else {
//                 callback();
//             }
//         } else {
//             // 如果目录下有文件, 则遍历所有文件并逐一删除
//             files.forEach(file => {
//                 var curPath = path.join(dir, file);
//                 fs.lstat(curPath, (err, stats) => {
//                     if (err) {
//                         // 如果发生错误, 则回调函数
//                         callback(err);
//                         return;
//                     }
//                     if (stats.isDirectory()) {
//                         // 更换回调函数, 并回调当前方法
//                         removeDir(curPath, true, folderDone);
//                     } else {
//                         // 删除指定文件
//                         fs.unlink(curPath, folderDone);
//                     }
//                 });
//             });
//         }
//     });
// }
//
// /**
//  * 创建路径
//  * @param dir 被创建的路径
//  * @param callback 创建成功后的回调函数
//  */
// function makeDir(dir, callback) {
//     // 判断路径是否存在
//     fs.exists(dir, exist => {
//         if (exist) {
//             // 路径存在, 直接调用回调函数
//             callback();
//         } else {
//             // 路径不存在, 以异步方式创建路径, 并在创建完毕后调用回调函数
//             fs.mkdir(dir, err => {
//                 callback(err);
//             });
//         }
//     });
// }
//
//
// /**
//  * 创建一个空文件（异步方式）
//  * @param filename 文件名
//  * @param callback
//  */
// function createEmptyFile(filename, callback) {
//     // 创建并打卡文件
//     fs.open(filename, 'w', (err, fd) => {   // err为错误对象, fd为文件句柄
//         if (err) {
//             callback(err);
//         } else {
//             fs.close(fd, err => {
//                 callback(err);
//             });
//         }
//     });
// }
//
//
// /**
//  * 删除指定文件夹（同步方式）
//  * @param dir 要删除的测试文件
//  * @param withDir 是否删除指定路径（false表示只删除文件）
//  */
// function removeDirSync(dir, withDir) {
//     try {
//         // 同步方式获取路径下所有文件（和子文件夹）, 并进行迭代
//         fs.readdirSync(dir).forEach(function (file) {
//             // 获取实际路径
//             file = path.join(dir, file);
//             // 判断获得的路径表示文件还是子文件夹
//             if (fs.lstatSync(file).isDirectory()) {
//                 // 递归调用继续删除子文件夹内所有问题
//                 removeDirSync(file);
//             } else {
//                 // 删除文件
//                 fs.unlinkSync(file);
//             }
//         });
//         if (withDir) {
//             // 删除路径
//             fs.rmdirSync(dir);
//         }
//     } catch (e) {
//         if (e.code !== 'ENOENT') {
//             throw e;
//         }
//     }
// }
//
//
// /**
//  * 创建一个Buffer对象
//  * @param str Buffer中包含的字符串内容
//  * @param encoding 字符串编码
//  */
// function mkbuf(str, encoding) {
//     encoding = encoding || 'utf8';
//     return new Buffer(str, encoding);
// }
//
//
// /**
//  * 测试异步文件操作
//  * 异步文件是node.js的标准方法, 即线程发出‘读取’或‘写入’文件操作后不被阻塞, 而在完成操作后由回调函数继续后续操作
//  */
// (function () {
//
//     let filename = './temp/t1/test.txt';
//     let dir = path.dirname(filename);
//     let data = ', Welcome';
//
//     /**
//      * 用于removeDir函数的回调函数
//      */
//     function removeDirCallback(err) {
//         assert.ifError(err);
//         makeDir(dir, makeDirCallback);
//     }
//
//     /**
//      * 用于makeDir函数的回调函数
//      */
//     function makeDirCallback(err) {
//         assert.ifError(err);
//         // 异步写入文件, 并在写入完毕后调用回调函数
//         fs.writeFile(filename, mkbuf('Hello World'), writeFileCallback);
//     }
//
//     /**
//      * 用于writeFile函数的回调函数
//      */
//     function writeFileCallback(err) {
//         assert.ifError(err);
//         // 异步写入文件, 在现有文件后追加内容
//         fs.appendFile(filename, data, 'utf8', appendFileCallback);
//     }
//
//     /**
//      * 用于appendFile函数的回调函数
//      */
//     function appendFileCallback(err) {
//         assert.ifError(err);
//
//         // 以异步方式读取文件, 并在读取完毕后调用回调函数
//         fs.readFile(filename, 'utf8', readFileCallback);
//
//         // 以异步方式读取文件, 方式2
//         fs.readFile(filename, readFileCallback);
//     }
//
//     /**
//      * 用于readFile的回调函数
//      */
//     function readFileCallback(err, data) {
//         assert.ifError(err);
//         if (data instanceof Buffer) {
//             assert.equal(data.toString('utf8'), 'Hello World, Welcome');
//         } else {
//             assert.equal(data, 'Hello World, Welcome');
//         }
//     }
//
//     // 删除指定路径并调用回调函数
//     removeDir(dir, false, removeDirCallback);
// })();
//
//
// /**
//  * 同步文件操作, 即文件‘读取’或‘写入’操作会阻塞线程, 等待操作结束后进行下一步操作
//  */
// (function () {
//     let filename = './temp/t2/test.txt';
//     // 获取文件所在路径名称
//     let dir = path.dirname(filename);
//
//     // 如果路径存在, 则删除
//     removeDirSync(dir, false);
//
//     // 以同步方式判断路径是否存在
//     if (!fs.existsSync(dir)) {
//         // 以同步方式创建文件
//         fs.mkdirSync(dir);
//     }
//
//     // 以同步方式写入文件
//     fs.writeFileSync(filename, mkbuf('Hello World'));
//
//     // 以同步方式追加到文件
//     fs.appendFileSync(filename, mkbuf(', Welcome'));
//
//     // 以同步方式读取文件内容
//     let buffer = fs.readFileSync(filename);
//     assert.equal(buffer.toString('utf8'), 'Hello World, Welcome');
// })();
//
//
// /**
//  * 文件异步操作
//  */
// (function () {
//     let filename = './temp/t3/test.txt';
//     let dir = path.dirname(filename);
//     let newname = dir + '/test_new.txt';
//
//     /**
//      * removeDir函数调用后的回调函数
//      */
//     function removeDirCallback(err) {
//         assert.ifError(err);
//         makeDir(dir, makeDirCallback);
//     }
//
//     /**
//      * makeDir函数调用后的回调函数
//      */
//     function makeDirCallback(err) {
//         assert.ifError(err);
//         createEmptyFile(filename, createEmptyFileCallback);
//     }
//
//     /**
//      * createEmptyFile函数调用后回调函数
//      */
//     function createEmptyFileCallback(err) {
//         assert.ifError(err);
//         fs.exists(filename, exist => {
//             assert.ok(exist);
//
//             // 判断文件是否创建成功且为空文件
//             // 回调函数中的'stat'参数居有如下方法:
//             //      stats.isFile()
//             //      stats.isDirectory()
//             //      stats.isBlockDevice()
//             //      stats.isCharacterDevice()
//             //      stats.isSymbolicLink() (only valid with fs.lstat())
//             //      stats.isFIFO()
//             //      stats.isSocket()
//             // 对象具备如下属性:
//             //      {
//             //          dev: ??,
//             //          ino: ??,
//             //          mode: ??,
//             //          nlink: 1,
//             //          uid: ??,
//             //          gid: ??,
//             //          rdev: ??,
//             //          size: 文件大小,
//             //          blksize: 文件块大小,
//             //          blocks: 文件块数,
//             //          atime: 文件访问时间,
//             //          mtime: 文件内容修改时间,
//             //          ctime: 文件属性改变时间,
//             //          birthtime: 文件创建时间
//             //      }
//             fs.stat(filename, (err, stat) => {
//                 assert.ifError(err);
//                 assert.equal(stat.size, 0);
//
//                 // 判断文件是否可以按照指定方式访问
//                 fs.access(filename, fs.R_OK | fs.W_OK, err => {
//                     assert.ifError(err);
//                     fs.rename(filename, newname, renameCallback);
//                 });
//             });
//         });
//     }
//
//     /**
//      * fs.rename回调函数
//      */
//     function renameCallback(err) {
//         assert.ifError(err);
//
//         // 判断改名前的文件是否存在
//         fs.exists(filename, exist => {
//             assert.ifError(exist);
//
//             // 判断改名后的文件是否存在
//             fs.exists(newname, exist => {
//                 assert.ok(exist);
//
//                 // 根据指定相对路径, 获取真实路径(绝对路径)
//                 fs.realpath(newname, realPathCallback);
//             });
//         });
//     }
//
//     /**
//      * 'fs.realpath'回调函数
//      */
//     function realPathCallback(err, realpath) {
//         assert.ifError(err);
//         // 获取文件的绝对路径
//         assert.equal(path.resolve(newname), realpath);
//     }
//
//     // 删除指定文件夹并回调函数
//     removeDir(dir, false, removeDirCallback);
// })();
//
//
// /**
//  * 测试低级文件操作API
//  */
// (function () {
//     let filename = './temp/t4/test.txt';
//     let basedir = path.dirname(filename);
//
//     /**
//      * removeDir回调函数
//      */
//     function removeDirCallback(err) {
//         assert.ifError(err);
//         makeDir(basedir, makeDirCallback);
//     }
//
//     /**
//      * makeDir回调函数
//      */
//     function makeDirCallback(err) {
//         assert.ifError(err);
//         fs.open(filename, 'w+', (err, fd) => {
//             // 要写入的内容缓存
//             let buffer = mkbuf('Hello World');
//
//             // 将数据写入句柄所指定的文件中, 将缓冲所有内容写入到文件0开始的位置上
//             // 写入完毕后调用'makeWriteFileCallback'函数返回的回调函数
//             fs.write(fd, buffer, 0, buffer.length, 0, (err, written, writtenBuffer) => {
//                 // 判断写入数据长度是否正确
//                 assert.equal(written, buffer.byteLength);
//                 // 判断写入数据内容是否正确
//                 assert.equal(writtenBuffer.toString('utf8'), 'Hello World');
//
//                 // 读取句柄所表示的文件, 并传入保存读取结果的缓冲对象.
//                 // 从文件0位置开始读取, 存入缓冲0~100字节中. 读取完毕后调用回调函数
//                 fs.read(fd, new Buffer(100), 0, 100, 0, (err, bytesRead, readBuffer) => {
//                     assert.ifError(err);
//
//                     // 判断读取数据长度是否正确
//                     assert.equal(bytesRead, buffer.byteLength);
//                     // 判断读取数据内容是否正确正确
//                     assert.equal(readBuffer.toString('utf8', 0, bytesRead), 'Hello World');
//                 });
//             });
//         });
//     }
//
//     // 删除目录文件
//     removeDir(basedir, false, removeDirCallback);
// })();
//
// // 导出函数
// exports.removeDir = removeDir;
// exports.makeDir = makeDir;
