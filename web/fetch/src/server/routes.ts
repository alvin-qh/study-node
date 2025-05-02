import Router from '@koa/router';

import { File } from 'formidable';

import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { encodeAttachment } from '@/utils/attachment';

// 实例化主页路由
const home = new Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 设置上传文件路径
export const UPLOAD_PATH = (() => {
  const uploadPath = path.join(__dirname, '.upload');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }
  return uploadPath;
})();

/**
 * 添加 `/` 路由
 */
home.get('', async (ctx) => {
  const username = ctx.cookies.get('username');
  if (!username) {
    ctx.status = 401;
    return ctx.render('error', { error: 'User not login' });
  }
  return ctx.render('home', { username });
});

/**
 * 添加 `/login` 路由
 */
home.post('login', async (ctx) => {
  // 接受请求的表单数据
  const form = ctx.request.body as {
    username: string
    password: string
  };

  // 验证密码
  if (form.password !== '123456') {
    ctx.status = 403;
    return ctx.render('error', { error: 'Invalid password' });
  }

  // 设置 cookie
  ctx.cookies.set('username', form.username, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    path: '/',
    secure: false,
    overwrite: false,
  });

  // 登录成功, 重定向到主页
  return ctx.redirect('/');
});

/**
 * 添加 `/logout` 路由, 当前用户退出登录
 */
home.post('logout', async (ctx) => {
  // 删除 cookie
  ctx.cookies.set('username', '', {
    maxAge: 0,
    httpOnly: true,
    path: '/',
    secure: false,
    overwrite: false,
  });

  // 登出成功, 重定向到主页
  return ctx.redirect('/');
});

const resources = new Router();

/**
 * 添加 `/res/upload` 路由, 上传文件
 *
 * 在 Koa 中, 文件上传是通过 `koa-body` 中间件来进行处理的,
 * 参见 `./index.ts` 文件
 */
resources.post('/upload', async (ctx) => {
  // 从请求中获取上传的文件, 为一个对象,
  // `key` 为上传文件名称, `value` 为上传文件的 `File` 对象
  const uploadFiles = ctx.request.files ?? {};

  // 获取所有上传文件的 `key` 值
  const fileKeys = Object.keys(uploadFiles);

  // 如果没有上传文件, 返回错误信息
  if (fileKeys.length === 0) {
    ctx.status = 400;
    ctx.body = JSON.stringify({
      status: 'error',
      message: 'No file uploaded',
    });
    return;
  }

  // 用于记录所有上传文件原始名称的集合
  const uploadedFiles: Array<string> = [];

  // 用于统计所有上传文件大小的整数值
  let totalFileSize = 0;

  // 遍历所有上传文件, 并将文件移动到 `UPLOAD_PATH` 目录下,
  // 同时记录上传文件原始名称和文件大小
  for (const fileKey of fileKeys) {
    // 获取一个上传文件
    const file = uploadFiles[fileKey] as File;

    // 判断上传文件对象是否具备原始文件名, 如不具备, 则返回错误
    if (!file.originalFilename) {
      ctx.status = 400;
      ctx.body = JSON.stringify({
        status: 'error',
        message: 'Upload file has no filename',
      });
      return;
    }

    // 判断上传文件大小是否超过 10MB, 超过则返回错误
    if (file.size > 1024 * 1024 * 10) {
      ctx.status = 400;
      ctx.body = JSON.stringify({
        status: 'error',
        message: 'File size exceeds 10MB',
      });
      return;
    }

    // 将上传文件进行改名, 从随机文件名改为其原始文件名
    await fsp.rename(file.filepath, path.join(UPLOAD_PATH, file.originalFilename));

    // 记录上传文件原始名称和文件大小
    uploadedFiles.push(file.originalFilename);
    totalFileSize += file.size;
  }

  // 返回上传成功信息
  ctx.body = JSON.stringify({
    status: 'success',
    filenames: uploadedFiles,
    totalSize: totalFileSize,
  });
});

/**
 * 添加 `/res/download` 路由, 下载文件
 *
 * 下载文件, 即服务端相应内容为文件内容, 并通过响应头中的
 * `Content-Disposition` 值来向客户端传递所下载的文件名
 *
 * 一般服务端都可以通过 "块" 方式和 "流" 方式两种方法下载文件,
 * 而流方式对大文件的下载尤其有效, 可以将文件内容分部分,
 * 逐步传输到客户端
 */
resources.get('/download/:filename', async (ctx) => {
  // 从请求参数中获取要下载的文件名
  const { filename } = ctx.params;

  // 如果没有提供文件名, 返回错误信息
  if (!filename) {
    ctx.status = 400;
    ctx.body = JSON.stringify({
      status: 'error',
      message: 'No filename provided',
    });
    return;
  }

  // 获取要下载的文件路径
  const filePath = path.join(__dirname, filename);

  // 如果文件在服务器端不存在, 返回错误信息
  if (!fs.existsSync(filePath)) {
    ctx.status = 404;
    ctx.body = JSON.stringify({
      status: 'error',
      message: 'File not found',
    });
    return;
  }

  // 创建文件的读取流, 用于向客户端传输文件
  const stream = fs.createReadStream(filePath);

  // 设置响应头, 告诉客户端所下载的文件名
  ctx.set('Content-Type', 'application/octet-stream');
  ctx.set('Content-Disposition', encodeAttachment(filename));

  // 将响应体设置为文件读取流, 即可将文件传输到客户端
  ctx.body = stream;
});


// 实例化总路由, 并为其添加各个分路由
export const router = new Router();
router.use('/', home.routes(), home.allowedMethods());
router.use('/res', resources.routes(), resources.allowedMethods());
