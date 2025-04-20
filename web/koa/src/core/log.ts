import log4js from 'koa-log4';

/**
 * 配置日志组件
 */
export function configure(): void {
  log4js.configure({
    appenders: { console: { type: 'console' }},
    categories: { default: { appenders: ['console'], level: 'debug' } },
  });
}
