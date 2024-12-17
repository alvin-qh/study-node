import * as qs from 'node:querystring';

import UrlPattern from "url-pattern";

/**
 * 表示一个路由处理器的类型
 */
export interface Router {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: UrlPattern;
  route: (request: Request) => Response;
}

export const routes: Router[] = [
  {
    method: 'GET',
    path: new UrlPattern('/'),
    route: (request) => {
      let message = 'Hello node.js';

      // check if name argument exist
      const param = qs.parse((new URL(request.url).search || '?').substring(1));
      if (param.name) {
        message = `${message}, have fun ${param.name}`;
      }
      return Response.json(
        { status: 'success', message },
        { headers: { auth: 'alvin' } },
      );
    },
  },
  {
    method: 'GET',
    path: new UrlPattern('/blog'),
    route: () => new Response('Blog'),
  },
];
