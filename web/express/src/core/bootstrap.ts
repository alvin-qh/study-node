import { fileURLToPath } from 'node:url';
import http from 'node:http';
import path from 'node:path';

import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import Logger from 'log4js';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import minifyHTML from 'express-minify-html';
import nunjucks from 'nunjucks';
import sanitizer from 'express-sanitizer';

import { __assetDir, assets } from './assets';
import { menu, routes } from '../routes';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __viewDir = path.join(__dirname, '../view');

// 实例化日志组件
const logger = Logger.getLogger('core/bootstrap');

/**
 * 初始化 Express 应用程序
 *
 * @param app Express 应用程序对象
 */
function setupExpress(app: Express): void {
  // 设置连接日志
  app.use(Logger.connectLogger(Logger.getLogger(), {
    level: 'DEBUG',
    format: ':method :url :status',
  }));

  // 设置 HTML 压缩方式
  app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: false,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  }));

  // 增加 sanitizer 中间件, 用于净化请求内容
  app.use(sanitizer());

  // 增加 json 中间件, 自动解析请求中包含的 json 数据
  app.use(express.json());

  // 增加 urlencoded 中间件, 自动解析请求中包含的表单数据
  app.use(express.urlencoded({ extended: false }));

  // 增加 cookie-parser 中间件, 对请求中包含的 cookie 数据进行解析
  app.use(cookieParser());

  // 增加 static 中间件, 用于对静态资源进行处理
  app.use(express.static(__assetDir));

  // 增加 favicon 中间件, 用于处理网站图标
  app.use(favicon(path.join(__assetDir, 'images', 'favicon.ico')));

  // view engine setup
  // app.set("view", setting.view);
  // app.set("view engine", "jade");

  // 设置 nunjucks 视图模板引擎, 指定模板存储路径以及配置项
  nunjucks.configure(__viewDir, {
    autoescape: true,
    watch: true,
    express: app,
    noCache: false,
  });
}

/**
 * 实例化 Express HTTP 服务
 *
 * @param app Express 应用对象
 */
function setupHttpServer(app: Express): void {
  // 创建 HTTP 服务对象
  const server = http.createServer(app);

  // 获取监听端口号
  const port = process.env.PORT ?? '3000';

  // 监听指定端口号
  server.listen(port);

  // 监听服务器 error 事件, 即发生错误后的回调
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server.on('error', (error: any) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    // handle specific listen errors with friendly messages
    if (error.code === 'EACCES') {
      logger.error(`${port} requires elevated privileges`);
      process.exit(1);
    } else if (error.code === 'EADDRINUSE') {
      logger.error(`${port} is already in use`);
      process.exit(1);
    } else {
      throw error;
    }
  });

  /**
   * 监听服务器 listening 事件, 即服务器完成端口监听后的回调
   */
  server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;

    logger.debug(`Listening on ${bind}`);
  });
}

/**
 * 初始化控制器路由
 *
 * @param {Express} app Express 应用程序对象
 */
function setupControllerRoute(app: Express): void {
  // 加入拦截器函数, 在所有请求前执行拦截
  app.use((req: Request, res: Response, next) => {
    // 复制菜单项
    const m = [...menu];

    // 在本地变量中存储当前URL路径
    res.locals.menu = m;

    // 为菜单标记当前选中项
    m.forEach((val) => {
      val.active = req.path.startsWith(val.url);
    });

    // 存储静态资源表
    res.locals.assets = assets;

    // 执行下一个处理
    next();
  });

  // 设置 "/" 路径的路由, 渲染主页
  // 通过 `app` 对象使用绝对 URL 路径创建路由
  // 推荐使用 `Router` 对象创建路由
  // app.get('/', (req: Request, res: Response) => {
  //   res.render('home/index.html');
  // });

  // 遍历路由表, 为每个路径设置路由处理对象
  Object.keys(routes).forEach((key) => {
    app.use(key, routes[key]);
  });

  // 设置错误处理回调

  // 获取是否为开发环境
  const isDevMode = app.get('env') === 'development';

  interface HttpError extends Error {
    status?: number
  }

  // 如果能到达这个拦截器, 说明之前没有路由对请求进行处理, 所以返回 404 错误
  // 对于开发环境, 将错误信息报告给客户端
  app.use((req: Request, res: Response/*, next */) => {
    const err: HttpError = new Error('Not Found');
    err.status = 404;

    res.render('error-page.html', {
      message: err.message,
      error: isDevMode ? err : null,
    });
  });

  // 处理错误, 对于开发环境, 将错误信息报告给客户端
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use((err: any, req: Request, resp: Response, next: NextFunction) => {
    resp.status(err.status || 500);
    resp.render('error-page.html', {
      message: err.message,
      error: isDevMode ? err : null,
    });
    next(err);
  });
}

// 导出初始化函数
export function bootstrap(app: Express): void {
  setupExpress(app);
  setupHttpServer(app);
  setupControllerRoute(app);
}
