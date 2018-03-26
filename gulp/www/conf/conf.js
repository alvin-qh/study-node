import express from 'express';
import validator from 'express-validator';
// import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import nunjucks from 'nunjucks';

export default function (app, setting) {

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

    app.use(express.static(setting.static, {
        etag: true,
        maxAge: '3600000',
        redirect: true
    }));

    /**
     * dotfiles (String)
     *      Option for serving dotfiles. Possible values are “allow”, “deny”, and “ignore”
     *      default: "ignore"
     * etag    (Boolean)
     *      Enable or disable etag generation
     *      default: true
     * extensions (Boolean)
     *      Sets file extension fallbacks.
     *      default: false
     * index (Mixed)
     *      Sends directory index file. Set false to disable directory indexing.
     *      default: "index.html"
     * lastModified (Boolean)
     *      Set the Last-Modified header to the last modified date of the file on the OS. Possible values are true or false.
     *      default: true
     * maxAge (Number)
     *      Set the max-age property of the Cache-Control header in milliseconds or a string in ms format
     *      default: 0
     * redirect (Boolean)
     *      Redirect to trailing “/” when the pathname is a directory.
     *      default: true
     * setHeaders (Function)
     *      Function for setting HTTP headers to serve with the file.
     */
}