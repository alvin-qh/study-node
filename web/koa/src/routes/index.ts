import Router from '@koa/router';

import { router as apiRoute } from './api';
import { router as homeRouter } from './home';


export const router = new Router();

router.use('/', homeRouter.routes(), homeRouter.allowedMethods());
router.use('/api', apiRoute.routes(), homeRouter.allowedMethods());
