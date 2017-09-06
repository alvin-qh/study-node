'use strict';

let express = require('express');
let path = require('path');

let conf = require('./conf/conf');
let route = require('./controller/route');

let app = express();

conf.config(app, {
    'views': path.join(__dirname, 'view'),
    'static': path.join(__dirname, 'public')
});

route.routes(app);
route.errors(app);

module.exports = app;
