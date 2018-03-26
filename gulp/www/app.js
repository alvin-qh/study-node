import express from 'express';
import path from 'path';

import config from './conf/conf';
import routes from './controller/route';

const app = express();

config(app, {
    'views': path.join(__dirname, 'view'),
    'static': path.join(__dirname, 'asset')
});

routes.routes(app);
routes.errors(app);

export default app;
