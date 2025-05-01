import Router from '@koa/router';

import { File } from 'formidable';

import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

// 实例化主页路由
const home = new Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 上传文件路径
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

const upload = new Router();

/**
 * 添加 `/upload` 路由, 上传文件
 */
upload.post('/', async (ctx) => {
  const uploadFiles = ctx.request.files ?? {};
  const fileKeys = Object.keys(uploadFiles);

  if (fileKeys.length === 0) {
    ctx.status = 400;
    ctx.body = JSON.stringify({
      status: 'error',
      message: 'No file uploaded',
    });
    return;
  }

  const uploadedFiles: Array<string> = [];
  let totalFileSize = 0;

  for (const fileKey of fileKeys) {
    const file = uploadFiles[fileKey] as File;
    if (!file.originalFilename) {
      ctx.status = 400;
      ctx.body = JSON.stringify({
        status: 'error',
        message: 'Upload file has no filename',
      });
      return;
    }

    if (file.size > 1024 * 1024 * 10) {
      ctx.status = 400;
      ctx.body = JSON.stringify({
        status: 'error',
        message: 'File size exceeds 10MB',
      });
      return;
    }

    await fsp.rename(file.filepath, path.join(UPLOAD_PATH, file.originalFilename));
    uploadedFiles.push(file.originalFilename);
    totalFileSize += file.size;
  }

  ctx.body = JSON.stringify({
    status: 'success',
    filenames: uploadedFiles,
    totalSize: totalFileSize,
  });
});


// 实例化总路由, 并为其添加各个分路由
export const router = new Router();
router.use('/', home.routes(), home.allowedMethods());
router.use('/upload', upload.routes(), upload.allowedMethods());
