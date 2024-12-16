import { Server } from 'bun';

export interface ServeOption {
  hostname?: string;
  port?: number;
  development?: boolean;
}

const _context: {
  server?: Server;
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

  if (_context.server) {
    console.log('Server already running');
    return;
  }

  _context.server = Bun.serve({
    port: opt.port,
    hostname: opt.hostname,
    development: opt.development,

    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === '/') return new Response('Home page');
      if (url.pathname === '/blog') return new Response('Blog');
      return new Response('404');
    },
  });

  console.log(`Server is running, address is: http://localhost:${opt.port}`);
}

export function stop() {
  if (!_context.server) {
    console.log('Server not running');
    return;
  }

  _context.server.stop();
  console.log('Server was stop');
}
