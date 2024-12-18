import { Context } from 'koa';
import Router from '@koa/router';

import * as loginForm from '../model/login-form';
import validate from 'koa2-validation';

// 导出路由对象, 该路由的相对路径为 `/routing`
export const router = new Router();

/**
 * 设定当前 URL 下所有控制器的拦截器
 */
router.use(async (ctx, next) => {
  ctx.state.title = 'Routing Demo';
  await next();
});

/**
 * 处理 "/" 路径的 `GET` 请求, 返回 `cookie` 中存储的用户登录信息
 */
router.get('/', async (ctx: Context) => {
  await ctx.render('routing/index.html', {
    loginAccount: ctx.cookies.get('loginAccount'),
    account: ctx.cookies.get('account'),
    password: ctx.cookies.get('password'),
  });
});


/**
 * 处理 "/login" 路径的 POST 请求
 *
 * 处理 POST 请求依赖于 `koa-body` 中间件模块
 */
router.post('/login', validate(loginForm.V), async (ctx: Context) => {
  const form = ctx.request.body as loginForm.F;

  if (form.password.localeCompare('123456') !== 0) {
    await ctx.render('routing/index.html', {});
    return;
  }

  // 如果表单中选择记录用户信息, 则将用户登录信息在 cookie 中进行存储
  if (form.remember) {
    ctx.cookies.set('account', form.account, { path: 'routing', maxAge: 900000 });
    ctx.cookies.set('password', form.password, { path: 'routing', maxAge: 900000 });
  }

  // 在 cookie 中存储用户身份信息
  ctx.cookies.set('login-account', form.account, { maxAge: 900000 });

  // 重定向
  ctx.redirect('/routing');
});

// /**
//  * 处理退出登录请求
//  */
// router.post('/logout', (req: Request, res: Response) => {
//   // 删除 cookie 中存储的登录信息
//   res.cookie('login-account', null, { maxAge: 0 });
//   res.redirect('/routing');
// });

// /**
//  * 处理 ajax 的 GET 请求
//  */
// router.get('/question', [
//   check('question', 'Question is require').notEmpty(),
// ], (req: Request, res: Response) => {
//   // 对请求信息进行验证
//   const r = validationResult(req);
//   if (!r.isEmpty()) {
//     res.status(400).json(r.array({ onlyFirstError: true }));
//     return;
//   }

//   let { question } = req.query;
//   question = Array.isArray(question) ? question[0] : question;
//   question = typeof question === 'string' ? question : '';

//   // 返回 JSON 结果
//   const good = Math.floor(Math.random() * 2);
//   res.jsonp({ answer: `${question} is a ${good ? 'good question' : 'bad question'}` });
// });
