import { type NextFunction, type Request, type Response, Router } from 'express';
import { check, validationResult } from 'express-validator';

// 导出路由对象, 该路由的相对路径为 `/routing`
export const router = Router();

/**
 * 设定当前 URL 下所有控制器的拦截器
 */
router.use((req: Request, res: Response, next: NextFunction) => {
  Object.assign(res.locals, { title: 'Routing Demo' });

  next();
});

/**
 * 处理 "/" 路径的 GET 请求, 返回 cookie 中存储的用户登录信息
 *
 * 读取 cookie 依赖于 `cookie-parser` 模块, 并通过 `app` 对象加载该模块
 *
 * ```
 * app.use(cookieParser());
 * ```
 */
router.get('/', (req: Request, res: Response) => {
  res.render('routing/index.html', {
    loginAccount: req.cookies.loginAccount,
    account: req.cookies.account,
    password: req.cookies.password,
  });
});

/**
 * 处理 "/login" 路径的 POST 请求
 *
 * 处理 POST 请求依赖于 `body-parser` 模块, 并通过 `app` 对象加载该模块
 *
 * ```
 * app.use(bodyParser.urlencoded({ extended: false }));
 * ```
 *
 * 参见 `conf/conf.js`
 */
router.post('/login', [
  check('account', 'Account is require').notEmpty(),
  check('password', 'Password is invalid').isAscii().isLength({ min: 6, max: 30 }).equals('123456'),
  check('remember').toBoolean(),
], (req: Request, res: Response) => {
  // 对请求信息进行验证
  const r = validationResult(req);
  if (!r.isEmpty()) {
    // 验证失败, 返回 400 错误信息
    res.status(400).render('routing/index.html', {
      errors: r.array({ onlyFirstError: true }),
      account: req.body.account,
    });
    return;
  }

  // 如果表单中选择记录用户信息, 则将用户登录信息在 cookie 中进行存储
  if (req.body.remember) {
    res.cookie('account', req.body.account, { path: 'routing', maxAge: 900000 });
    res.cookie('password', req.body.password, { path: 'routing', maxAge: 900000 });
  }

  // 在 cookie 中存储用户身份信息
  res.cookie('login-account', req.body.account, { maxAge: 900000 });

  // 重定向
  res.redirect('/routing');
});

/**
 * 处理退出登录请求
 */
router.post('/logout', (req: Request, res: Response) => {
  // 删除 cookie 中存储的登录信息
  res.cookie('login-account', null, { maxAge: 0 });
  res.redirect('/routing');
});

/**
 * 处理 ajax 的 GET 请求
 */
router.get('/question', [
  check('question', 'Question is require').notEmpty(),
], (req: Request, res: Response) => {
  // 对请求信息进行验证
  const r = validationResult(req);
  if (!r.isEmpty()) {
    res.status(400).json(r.array({ onlyFirstError: true }));
    return;
  }

  let { question } = req.query;
  question = Array.isArray(question) ? question[0] : question;
  question = typeof question === 'string' ? question : '';

  // 返回 JSON 结果
  const good = Math.floor(Math.random() * 2);
  res.jsonp({ answer: `${question} is a ${good ? 'good question' : 'bad question'}` });
});
