import { fileURLToPath } from 'node:url';
import path from 'node:path';

import env from 'dotenv';

import Koa from 'koa';
import koaBody from 'koa-body';
import koaStatic from 'koa-static';
import koaViews from '@ladjs/koa-views';

import nunjucks from 'nunjucks';

import { router } from './routes';
import { useCustomizeMiddlewares } from './core/middleware';

env.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const __publicPath = path.join(__dirname, '../public');
export const __assetsPath = path.join(__dirname, '../assets');

/**
 *  初始化 `nunjucks` 模板引擎环境
 */
const nunjucksEnv = new nunjucks.Environment(
  // 指定读取模板文件的位置
  new nunjucks.FileSystemLoader(__publicPath)
);

// 实例化 Koa 对象
export const app = new Koa();

// 增加自定义中间件
useCustomizeMiddlewares(app);

// 设置 Koa 中间件
app
  .use(koaStatic(__assetsPath))
  .use((ctx, next) => { })
  .use(koaViews( // 设置模板引擎中间件
    __publicPath,
    {
      options: { nunjucksEnv },
      map: { html: 'nunjucks' },
    }
  ))
  .use(koaBody({
    multipart: true,
    formidable: {
      allowEmptyFiles: false,
      maxTotalFileSize: 10 * 10 * 1024,
    },
  }))
  .use(router.allowedMethods())
  .use(router.routes()); // 设置路由中间件, 需放在最后

/**
 * 入口函数
 */
export function main(): void {
  // 启动服务
  app.listen(parseInt(process.env.PORT!), '0.0.0.0');
}

main();
