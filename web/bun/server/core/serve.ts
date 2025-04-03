import { type Server } from 'bun';

import {routes} from './route';

export interface ServeOption {
  hostname?: string;
  port?: number;
  development?: boolean;
}

const server: {
  instance?: Server;
} = {};

export function serve(opt?: ServeOption) {
  opt = {
    ...{
      hostname: '0.0.0.0',
      port: 3000,
      development: false,
    },
    ...opt,
  };

  if (server.instance) {
    console.log('Server already running');
    return;
  }

  server.instance = Bun.serve({
    port: opt.port,
    hostname: opt.hostname,
    development: opt.development,

    fetch(request) {
      const url = new URL(request.url);
      const route = routes.find((route) => {
        return route.method === request.method && route.path.match(url.pathname);
      });

      if (route) {
        return route.route(request);
      } else {
        if (url.pathname === '/'){
          return new Response('Home page');
        }

        if (url.pathname === '/blog') {
          return new Response('Blog');
        }

        return new Response('404', {status: 404});
      }
    },
  });

  console.log(`Server is running, address is: http://localhost:${opt.port}`);
}

export function stop() {
  if (!server.instance) {
    console.log('Server not running');
    return;
  }

  server.instance.stop();
  console.log('Server was stop');
}
