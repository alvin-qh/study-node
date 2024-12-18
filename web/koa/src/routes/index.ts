import Router from '@koa/router';

import { router as homeRouter } from './home';
import { router as routingRoute } from './routing';


export const router = new Router();

router.use('/', homeRouter.routes(), homeRouter.allowedMethods());
router.use('/routing', routingRoute.routes(), homeRouter.allowedMethods());
