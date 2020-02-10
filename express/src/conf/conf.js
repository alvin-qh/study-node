const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const path = require('path');
const express = require('express');
const http = require('http');
const favicon = require('serve-favicon');
const minifyHTML = require('express-minify-html');
const Logger = require('log4js');
const sanitizer = require('express-sanitizer');

const assets = require('./assets');
const {menu, routes} = require('./routemap');

const port = process.env.PORT || '3000';

Logger.configure(path.join(__dirname, './log4js.json'));

const logger = Logger.getLogger("conf");

function _expressConfig(app) {
    app.set('port', port);

    app.use(Logger.connectLogger(Logger.getLogger(), {
        level: Logger.levels.DEBUG,
        format: ':method :url :status'
    }));

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

    app.use(sanitizer());

    // 自动解析请求中包含的json数据
    app.use(express.json());

    // 自动解析请求中包含的表单数据
    app.use(express.urlencoded({extended: false}));

    // 对请求中包含的cookie数据进行解析
    app.use(cookieParser());

    app.use(express.static(path.join(__dirname, '../public')));

    app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));

    //view engine setup
    //app.set('view', setting.view);
    //app.set('view engine', 'jade');
    nunjucks.configure(path.join(__dirname, '../view'), {
        autoescape: true,
        watch: true,
        express: app,
        noCache: false
    });
}

function _httpConfig(app) {
    const server = http.createServer(app);
    server.listen(port);

    /**
     * Event listener for HTTP server "error" event.
     */
    server.on('error', error => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });

    /**
     * Event listener for HTTP server "listening" event.
     */
    server.on('listening', () => {
        let addr = server.address();

        const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        logger.debug('Listening on ' + bind);
    });
}

function _routeConfig(app) {

    /**
     * 拦截器, 在所有请求之前进行拦截
     */
    app.use((req, res, next) => {
        // 在本地变量中存储当前URL路径
        res.locals['menus'] = menu;

        for (const val of menu) {
            val.active = req.path.indexOf(val.url) === 0;
        }

        res.locals['assets'] = assets;

        // 执行下一个处理
        next();
    });

    /**
     * 基本路由, 通过'app.get'方法监听一个get请求
     */
    app.get('/', (req, res) => {
        res.render('home/index.html');
    });

    for (const path in routes) {
        if (routes.hasOwnProperty(path)) {
            app.use(path, routes[path]);
        }
    }

    // error handlers
    if (app.get('env') === 'development') {

        // catch 404 and forward to error handler
        app.use((req, res, next) => {
            const err = new Error('Not Found');
            err.status = 404;
            res.render('error-page.html', {
                message: err.message,
                error: err
            });
        });

        // development error handler
        // will print stacktrace
        app.use((err, req, res) => {
            res.status(err.status || 500);
            res.render('error-page.html', {
                message: err.message,
                error: err
            });
        });

    } else {

        // catch 404 and forward to error handler
        app.use((req, res, next) => {
            err.status = 404;
            res.render('error-page.html', {
                message: err.message,
                error: null
            });
        });

        // production error handler
        // no stacktraces leaked to user
        app.use((err, req, res) => {
            res.status(err.status || 500);
            res.render('error-page.html', {
                message: err.message,
                error: null
            });
        });
    }
}

module.exports = function (app) {
    _expressConfig(app);
    _httpConfig(app);
    _routeConfig(app);
};
