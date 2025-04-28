import Router from '@koa/router';

const home = new Router();

home.get('', async (ctx) => {
  const { name } = ctx.query;
  return ctx.render('home', { name });
});

home.post('login', async (ctx) => {
  const form = ctx.request.body as {
    username: string
    password: string
  };

  if (form.password !== '123456') {
    ctx.status = 400;
    return ctx.render('home', { error: 'invalid password' });
  }

  return ctx.redirect(`/?name=${form.username}`);
});

export const router = new Router();
router.use('/', home.routes(), home.allowedMethods());
