import { type Server } from 'bun';

import { routes } from './route';

/**
 * 服务器配置选项
 */
export interface ServeOption {
  hostname?: string
  port?: number
  development?: boolean
}

/**
 * 定义服务器实例
 */
const server: {
  // 服务器实例对象
  instance: Server | null
} = { instance: null };

/**
 * 启动服务器
 *
 * @param opt 服务器配置选项
 */
export function serve(opt?: ServeOption) {
  // 合并配置, 设置默认值
  opt = {
    hostname: '0.0.0.0',
    port: 3000,
    development: false,
    ...opt,
  };

  // 如果服务器已经启动，则不启动
  if (server.instance) {
    console.log('Server already running');
    return;
  }

  // 启动服务器
  server.instance = Bun.serve({
    ...opt,

    /**
     * 请求处理函数
     *
     * @param request 请求对象
     * @returns 响应对象
     */
    fetch(request) {
      // 获取请求路径
      const url = new URL(request.url);

      // 匹配路由
      const route = routes.find((route) => {
        // 路由匹配性判断
        return route.method === request.method && route.path.match(url.pathname);
      });

      // 如果匹配到路由，则执行路由处理函数
      if (route) {
        return route.route(request);
      }
      else {
        // 如果路径是根路径，则返回首页
        if (url.pathname === '/') {
          return new Response('Home page');
        }

        // 匹配不到路由，则返回 404
        return new Response('404', { status: 404 });
      }
    },
  });

  console.log(`Server is running, address is: http://localhost:${opt.port}`);
}

/**
 * 停止服务器
 */
export function stop() {
  // 如果服务器实例不存在, 则不执行任何操作
  if (!server.instance) {
    console.log('Server not running');
    return;
  }

  // 停止服务器实例
  server.instance.stop();
  server.instance = null;

  console.log('Server was stop');
}
