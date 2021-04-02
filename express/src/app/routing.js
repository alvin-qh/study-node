const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router({});

/**
 * 设定当前URL下所有控制器的拦截器
 */
router.use((req, res, next) => {
  Object.assign(res.locals, {
    title: 'Routing Demo'
  });
  next();
});


/**
 * 读取cookie需要'cookie-parser'模块, 并通过'app'对象加载该模块: app.use(cookieParser());
 */
router.get('/', (req, res) => {
  res.render('routing/index.html', {
    'loginAccount': req.cookies.loginAccount,
    'account': req.cookies.account,
    'password': req.cookies.password
  });
});

/**
 * 处理Post请求
 * express处理post请求依赖于'body-parser'模块, 并且要通过'app'对象加载该模块: app.use(bodyParser.urlencoded({extended: false}));
 * 参见'conf/conf.js'
 */
router.post('/login', [
  check('account', 'Account is require').notEmpty(),
  check('password', 'Password is invalid').isAscii().isLength({ min: 6, max: 30 }).equals('123456'),
  check('remember').toBoolean()
], (req, res) => {
  let r = validationResult(req);
  if (!r.isEmpty()) {
    res.status(400).render('routing/index.html', {
      'errors': r.array({ onlyFirstError: true }),
      'account': req.body.account
    });
    return;
  }

  if (req.body.remember) {
    res.cookie('account', req.body.account, { 'path': 'routing', 'maxAge': 900000 });
    res.cookie('password', req.body.password, { 'path': 'routing', 'maxAge': 900000 });
  }

  res.cookie('loginAccount', req.body.account, { 'maxAge': 900000 });
  res.redirect('/routing');
});

/**
 * 处理退出登录请求
 */
router.post('/logout', (req, res) => {
  res.cookie('loginAccount', null, { 'maxAge': 0 });
  res.redirect('/routing');
});


/**
 * 处理Ajax的GET请求
 */
router.get('/question', [
  check('question', 'Question is require').notEmpty()
], (req, res) => {
  let r = validationResult(req);
  if (!r.isEmpty()) {
    res.status(400).json(r.array({ onlyFirstError: true }));
    return;
  }
  let good = Math.floor(Math.random() * 2);
  // 返回JSON结果
  res.jsonp({ 'answer': req.query.question + (good ? ' is a good question' : ' is a bad question') });
});

module.exports = router;
