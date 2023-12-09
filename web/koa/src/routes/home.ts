import { type Context } from 'koa';

import { router } from './router';

/**
 * 定义 `/` 路由, 渲染 HTML 模板文件code
 */
router.get('/', async (ctx: Context) => {
  await ctx.render('index', {
    title: 'Hello Koa'
  });
});
