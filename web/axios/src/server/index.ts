import env from 'dotenv';

import Koa from 'koa';
import { koaBody } from 'koa-body';
import nunjucks from 'nunjucks';
import views from '@ladjs/koa-views';

import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { router } from './routes';

env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const _htmlPath = path.join(__dirname, 'html');

const nunjucksEnv = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(_htmlPath)
);

export const app = new Koa();

app
  .use(views(
    _htmlPath,
    {
      options: { nunjucksEnv },
      map: { html: 'nunjucks' },
    }
  ))
  .use(koaBody({
    multipart: true,
    formidable: {
      allowEmptyFiles: false,
      maxTotalFileSize: 10 * 10 * 1024,
    },
  }))
  .use(router.allowedMethods())
  .use(router.routes());

export function start(): () => void {
  const port = process.env.PORT || '9000';
  const bind = process.env.BIND || '0.0.0.0';

  const server = app.listen(parseInt(port), bind);
  return () => server.close();
}
