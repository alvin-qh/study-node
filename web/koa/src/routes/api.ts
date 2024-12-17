import { type Context } from 'koa';
import Router from '@koa/router';

export const router = new Router();

/**
 * 定义 `/` 路由, 渲染 HTML 模板文件
 */
router.get('/question', async (ctx: Context) => {
  console.log(ctx.url);
  ctx.body = { answer: 'Hello' };
});
