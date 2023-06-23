const cookieParser = require("cookie-parser");
const nunjucks = require("nunjucks");
const path = require("path");
const express = require("express");
const http = require("http");
const favicon = require("serve-favicon");
const minifyHTML = require("express-minify-html");
const Logger = require("log4js");
const sanitizer = require("express-sanitizer");

const assets = require("./assets");
const conf = require("../conf");

// 初始化日志组件
Logger.configure(path.join(__dirname, "../conf/log4js.json"));

// 实例化日志组件
const logger = Logger.getLogger("core/bootstrap");

// 获取端口号
const port = process.env.PORT || "3000";

/**
 * 初始化 Express 应用程序
 * 
 * @param {express.Express} app Express 应用程序对象
 */
function setupExpress(app) {
  // 设置监听端口号
  app.set("port", port);

  // 设置连接日志
  app.use(Logger.connectLogger(Logger.getLogger(), {
    level: Logger.levels.DEBUG,
    format: ":method :url :status"
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
      minifyJS: true
    }
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
  app.use(express.static(path.join(__dirname, "../public")));

  // 增加 favicon 中间件, 用于处理网站图标
  app.use(favicon(path.join(__dirname, "../public/images", "favicon.ico")));

  // view engine setup
  // app.set("view", setting.view);
  // app.set("view engine", "jade");

  // 设置 nunjucks 视图模板引擎, 指定模板存储路径以及配置项
  nunjucks.configure(path.join(__dirname, "../view"), {
    autoescape: true,
    watch: true,
    express: app,
    noCache: false
  });
}

/**
 * 实例化 Express HTTP 服务
 * 
 * @param {express.Express} app Express 应用对象
 */
function setupHttpServer(app) {
  // 创建 HTTP 服务对象
  const server = http.createServer(app);

  // 监听指定端口号
  server.listen(port);

  // 监听服务器 error 事件, 即发生错误后的回调
  server.on("error", error => {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
      default:
        throw error;
    }
  });

  /**
   * 监听服务器 listening 事件, 即服务器完成端口监听后的回调
   */
  server.on("listening", () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

    logger.debug("Listening on " + bind);
  });
}

/**
 * 初始化控制器路由
 * 
 * @param {express.Express} app Express 应用程序对象
 */
function setupControllerRoute(app) {
  // 加入拦截器函数, 在所有请求前执行拦截
  app.use((req, res, next) => {
    // 复制菜单项
    const menu = [...conf.routeMap.menu];

    // 在本地变量中存储当前URL路径
    res.locals["menu"] = menu;

    // 为菜单标记当前选中项
    for (const val of menu) {
      val.active = req.path.indexOf(val.url) === 0;
    }

    // 存储静态资源表
    res.locals["assets"] = assets;

    // 执行下一个处理
    next();
  });

  // 设置 "/" 路径的路由, 渲染主页
  app.get("/", (_req, res) => {
    res.render("home/index.html");
  });

  // 遍历路由表, 为每个路径设置路由处理对象
  for (const path in conf.routeMap.routes) {
    app.use(path, conf.routeMap.routes[path]);
  }

  // 设置错误处理回调

  // 获取是否为开发环境
  const isDevMode = app.get("env") === "development";

  // 如果能到达这个拦截器, 说明之前没有路由对请求进行处理, 所以返回 404 错误
  // 对于开发环境, 将错误信息报告给客户端
  app.use((_req, res, _next) => {
    const err = new Error("Not Found");
    err.status = 404;

    res.render("error-page.html", {
      message: err.message,
      error: isDevMode ? err : null,
    });
  });

  // 处理错误, 对于开发环境, 将错误信息报告给客户端
  app.use((_req, resp, err) => {
    resp.status(err.status || 500);
    resp.render("error-page.html", {
      message: err.message,
      error: isDevMode ? err : null,
    });
  });
}

// 导出初始化函数
module.exports = function initialize(app) {
  setupExpress(app);
  setupHttpServer(app);
  setupControllerRoute(app);
};
