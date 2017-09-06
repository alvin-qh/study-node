'use strict';

let express = require('express');
let validator = require('express-validator');
// let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let nunjucks = require('nunjucks');

function config(app, setting) {

    app.use(logger('dev'));

    // 使用验证器对提交的数据进行验证
    app.use(validator());

    // 自动解析请求中包含的json数据
    app.use(bodyParser.json());

    // 自动解析请求中包含的表单数据
    app.use(bodyParser.urlencoded({extended: false}));

    // 对请求中包含的cookie数据进行解析
    app.use(cookieParser());

    // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    // view engine setup
    //app.set('view', setting.view);
    //app.set('view engine', 'jade');
    nunjucks.configure(setting.views, {
        'autoescape': true,
        'watch': true,
        'express': app
    });

    app.use(express.static(setting.static));
}

module.exports = {
    config: config
};
