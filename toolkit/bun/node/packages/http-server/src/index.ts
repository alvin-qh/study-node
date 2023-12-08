import { type Errorlike, type Server } from 'bun';

export interface Context {
  request: Request
  response: Response
  params: Record<string, string>
  query: Record<string, string>
  cookies: Record<string, string>
  body: Record<string, string>
  headers: Record<string, string>
  ip: string
  method: string
  url: string
  path: string
  hostname: string
  port: number
  protocol: string
  search: string
  origin: string
  href: string
  referrer: string
  userAgent: string
  isSecure: boolean
  isLocal: boolean
  isAjax: boolean
  isWebsocket: boolean
}

export interface Route {
  path: string
  method: string
  handler: (ctx: Context) => Response
}

function requestToContext(request: Request): Context {
  return {
    request,
    response: new Response(),
    params: ,
    query: {},
    cookies: {},
    body: {},
    headers: {},
    ip: '',
    method: '',
    url: '',
    path: '',
    hostname: '',
    port: 0,
    protocol: '',
    search: '',
    origin: '',
    href: '',
    referrer: '',
    userAgent: '',
    isSecure: false,
    isLocal: false,
    isAjax: false,
    isWebsocket: false
  };
}

export function startServer(routes: Route[], port: number = 5001, hostname: string = '0.0.0.0'): Server {
  return Bun.serve({
    port,
    hostname,
    development: true,
    fetch(request: Request) {
      switch (request.url) {
      case '/':
        return;
      case '/hello':
        return new Response('Hello World!');
      case '/goodbye':
        return new Response('Goodbye World!');
      }
      return new Response('404!');
    },
    error(error: Errorlike) {
      return new Response(`<pre>${error}\n${error.stack}</pre>`, {
        headers: {
          'Content-Type': 'text/html'
        }
      });
    },
    websocket: {
      message() { }
    }
  });
}
