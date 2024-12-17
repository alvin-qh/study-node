import { fileURLToPath } from 'node:url';
import path from 'node:path';

import env from 'dotenv';

import Koa from 'koa';
import serve from 'koa-static';
import views from '@ladjs/koa-views';

import nunjucks from 'nunjucks';

import { router } from './routes';

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

// 设置 Koa 中间件
app
  .use(serve(__assetsPath))
  .use( // 设置模板引擎中间件
    views(
      __publicPath,
      {
        options: { nunjucksEnv },
        map: { html: 'nunjucks' },
      }
    )
  )
  .use(router.routes()) // 设置路由中间件
  .use(router.allowedMethods());

/**
 * 入口函数
 */
export function main(): void {
  // 启动服务
  app.listen(parseInt(process.env.PORT!), '0.0.0.0');
}

main();
