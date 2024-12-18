declare interface MenuItem {
  text: string
  url: string
  active?: boolean
}

export const menus: MenuItem[] = [
  { text: 'Routing', url: '/routing' },
  { text: 'Middleware', url: '/middleware' },
  { text: 'Error Handing', url: '/error-handing' },
  { text: 'Debug', url: '/debug' },
  { text: 'Database', url: '/database' },
];
