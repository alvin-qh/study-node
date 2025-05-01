import env from 'dotenv';

import Koa from 'koa';
import { koaBody } from 'koa-body';
import nunjucks from 'nunjucks';
import views from '@ladjs/koa-views';

import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { UPLOAD_PATH, router } from './routes';

env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 拼装 HTML 模板存储路径
const _htmlPath = path.join(__dirname, 'html');

// 初始化 nunjucks 模板引擎
const nunjucksEnv = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(_htmlPath)
);

// 创建 Koa 实例
export const app = new Koa();

// 设置 Koa 中间件
app
  .use(views(
    _htmlPath,
    {
      options: { nunjucksEnv },
      map: { html: 'nunjucks' },
    }
  ))
  .use(koaBody({
    multipart: true,
    formidable: {
      uploadDir: UPLOAD_PATH,
      keepExtensions: true,
      allowEmptyFiles: false,
      maxTotalFileSize: 10 * 10 * 1024,
    },
  }))
  .use(async (ctx, next) => {
    // 自定义中间件, 用于未捕获异常处理
    try {
      await next();
    }
    catch (err) {
      if (ctx.headers.accept?.includes('text/html')) {
        ctx.body = nunjucksEnv.render('error.html', {
          error: err.message,
        });
        return ctx.render('error', {
          error: err.message,
        });
      }
      else {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
          status: 'error',
          message: err.message,
        };
      }
    }
  });

// 设置 Koa 路由
app
  .use(router.allowedMethods())
  .use(router.routes());

/**
 * 启动服务器
 *
 * @returns {() => void} 返回关闭服务器函数
 */
export function start(): () => void {
  const port = process.env.PORT || '9000';
  const bind = process.env.BIND || '0.0.0.0';

  const server = app.listen(parseInt(port), bind);
  return () => server.close();
}
