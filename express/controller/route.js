'use strict';

let routing = require('./route/routing');
let menu = require('./menu');

function routes(app) {
    /**
     * 拦截器, 在所有请求之前进行拦截
     */
    app.use((req, res, next) => {
        // 在本地变量中存储当前URL路径
        res.locals['menus'] = menu;

        menu.forEach(val => {
            val.active = req.path.indexOf(val.url) === 0;
        });

        // 执行下一个处理
        next();
    });

    /**
     * 基本路由, 通过'app.get'方法监听一个get请求
     */
    app.get('/', (req, res) => {
        res.render('root/index.html', {title: 'Express'});
    });

    app.use('/routing', routing);
}

function errors(app) {

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res) {
            res.status(err.status || 500);
            res.render('error.html', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: {}
        });
    });
}

module.exports = {
    'routes': routes,
    'errors': errors
};
