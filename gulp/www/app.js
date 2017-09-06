'use strict';

let express = require('express');
let path = require('path');

let conf = require('./conf/conf');
let routes = require('./controller/route');

let app = express();

conf.config(app, {
	'views': path.join(__dirname, 'view'),
	'static': path.join(__dirname, 'asset')
});

routes.routes(app);
routes.errors(app);

module.exports = app;
