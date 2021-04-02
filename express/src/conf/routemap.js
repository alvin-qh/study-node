const Routing = require('../app/routing');

const routes = {
  '/routing': Routing
};

const menu = [
  { text: 'Routing', url: '/routing' },
  { text: 'Middleware', url: '/middleware' },
  { text: 'Error Handing', url: '/error-handing' },
  { text: 'Debug', url: '/debug' },
  { text: 'Database', url: '/database' }
];

module.exports = { menu, routes };
