import Router from '@koa/router';

import { router as homeRouter } from './home';
import { router as routingRoute } from './routing';

// 创建 KOA 路由对象
export const router = new Router();

// 在路由对象中增加有声明
router.use('', homeRouter.routes(), homeRouter.allowedMethods());
router.use('/routing', routingRoute.routes(), routingRoute.allowedMethods());
