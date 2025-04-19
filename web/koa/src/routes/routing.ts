import { Context } from 'koa';
import Router from '@koa/router';

import Joi from 'joi';

import { LoginForm } from '@/model';
import { validator } from '../middleware';

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

const LoginFormValidator = {
  account: Joi.string().min(1).max(20).required(),
  password: Joi.string().min(6).max(25).required(),
  remember: Joi.bool(),
};

/**
 * 处理 "/login" 路径的 POST 请求
 *
 * 处理 POST 请求依赖于 `koa-body` 中间件模块
 */
router.post('/login', validator(LoginFormValidator), async (ctx: Context) => {
  // 获取请求表单对象
  const form = ctx.request.body as LoginForm;

  if (ctx.validateError) {
    // 渲染当前页面, 显式表单验证错误
    await ctx.render('routing/index.html', {
      ...form,
      ...ctx.validateError,
    });
    return;
  }

  // 确认密码是否匹配
  if (form.password.localeCompare('123456') !== 0) {
    // 渲染当前页面, 显式密码不匹配错误
    await ctx.render('routing/index.html', {
      ...form,
      errors: [
        {
          type: 'field',
          msg: '"password" not match',
          path: 'password',
          key: '',
        },
      ],
    });
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

/**
 * 处理退出登录请求
 */
router.post('/logout', async (ctx: Context) => {
  // 删除 cookie 中存储的登录信息
  ctx.cookies.set('login-account', null, { maxAge: 0 });
  ctx.redirect('/routing');
});

/**
 * 处理 ajax 的 GET 请求
 */
router.get('/question', async (ctx: Context) => {
  let { question } = ctx.query;
  question = Array.isArray(question) ? question[0] : question;
  question = typeof question === 'string' ? question : '';

  const good = Math.floor(Math.random() * 2);

  ctx.type = 'text/javascript';
  ctx.body = { answer: `${question} is a ${good ? 'good question' : 'bad question'}` };
});
