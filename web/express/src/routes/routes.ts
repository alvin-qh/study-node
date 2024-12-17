import { router as databaseRouter } from './database';
import { router as debugRouter } from './debug';
import { router as errorHandingRouter } from './error-handing';
import { router as homeRouter } from './home';
import { router as middleRouter } from './middleware';
import { router as routingRouter } from './routing';

export const routes = {
  '/': homeRouter,
  '/routing': routingRouter,
  '/middleware': middleRouter,
  '/error-handing': errorHandingRouter,
  '/debug': debugRouter,
  '/database': databaseRouter,
};

declare interface MenuItem {
  text: string
  url: string
  active?: boolean
}

export const menu: MenuItem[] = [
  { text: 'Routing', url: '/routing' },
  { text: 'Middleware', url: '/middleware' },
  { text: 'Error Handing', url: '/error-handing' },
  { text: 'Debug', url: '/debug' },
  { text: 'Database', url: '/database' },
];
