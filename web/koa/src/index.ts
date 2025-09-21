// import { fileURLToPath } from 'node:url';
import path from 'node:path';

import env from 'dotenv';

import Koa from 'koa';
import { koaBody } from 'koa-body';
import koaStatic from 'koa-static';
import koaViews from '@ladjs/koa-views';
import log4js from 'koa-log4';

import nunjucks from 'nunjucks';

import { logging } from './core';

import { assets } from './middleware';
import { menuItems } from './model/menu';
import { router } from './routes';

// 读取环境变量
env.config();

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

const __viewPath = path.join(process.cwd(), 'template/view');
const __assetsPath = path.join(process.cwd(), 'assets');

// 配置日志
logging.configure();

// 获取名为 `app` 的日志
const log = log4js.getLogger('app');

/**
 *  初始化 `nunjucks` 模板引擎环境
 */
const nunjucksEnv = new nunjucks.Environment(
  // 指定读取模板文件的位置
  new nunjucks.FileSystemLoader(__viewPath)
);

// 实例化 Koa 对象
export const app = new Koa();

// 增加自定义中间件
app.use(assets());

// 设置 Koa 中间件
app
  .use(koaStatic(__assetsPath))
  .use(async (ctx, next) => { // 设置自定义中间件
    ctx.state.menusItems = menuItems;
    await next();
  })
  .use(koaViews( // 设置模板引擎中间件
    __viewPath,
    {
      options: { nunjucksEnv },
      map: { html: 'nunjucks' },
    }
  ))
  .use(koaBody({ // 设置请求体解析中间件
    multipart: true,
    formidable: {
      allowEmptyFiles: false,
      maxTotalFileSize: 10 * 10 * 1024,
    },
  }))
  .use(log4js.koaLogger(log4js.getLogger('access'), { level: 'auto' })) // 设置访问日志中间件
  .use(router.allowedMethods()) // 设置可访问 HTTP 请求方法中间件
  .use(router.routes()); // 设置路由中间件, 需放在最后

/**
 * 入口函数
 */
export function main(): void {
  const port = process.env.PORT || '9000';
  const bind = process.env.BIND || '0.0.0.0';

  // 启动服务
  app.listen(parseInt(port), bind);

  if (bind === '0.0.0.0') {
    log.info(`Koa service was startup on http://localhost:${port}`);
  } else {
    log.info(`Koa service was startup on ${bind}:${port}`);
  }
}

main();
