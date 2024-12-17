import { type Context } from 'koa';
import Router from '@koa/router';

export const router = new Router();

/**
 * 定义 `/` 路由, 渲染 HTML 模板文件code
 */
router.get('/', async (ctx: Context) => {
  await ctx.render('home/index', {});
});
