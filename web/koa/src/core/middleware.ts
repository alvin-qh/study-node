import Koa, {
  type DefaultContext,
  type DefaultState,
  type Next,
  type ParameterizedContext,
} from 'koa';
import Router from '@koa/router';

import { assets } from './assets';

type MiddlewareContext = ParameterizedContext<DefaultState, DefaultContext & Router.RouterParamContext<DefaultState, DefaultContext>, unknown>;

async function assetsMiddleware(ctx: MiddlewareContext, next: Next) {
  ctx.state.assets = assets;
  await next();
}

export function useCustomizeMiddlewares(app: Koa) {
  app.use(
    assetsMiddleware
  );
}
