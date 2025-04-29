import Router from '@koa/router';

// 实例化主页路由
const home = new Router();

/**
 * 添加 `/` 路由
 */
home.get('', async (ctx) => {
  const username = ctx.cookies.get('username');
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
    return ctx.render('home', { error: 'invalid password' });
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


// 实例化总路由, 并为其添加各个分路由
export const router = new Router();
router.use('/', home.routes(), home.allowedMethods());
