import { Context, Middleware, Next } from 'koa';
import { fileURLToPath } from 'node:url';

import fs from 'node:fs';
import path from 'node:path';

import Logger from 'log4js';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const __assetDir = path.join(__dirname, '../../assets');

// 实例化日志对象
const log = Logger.getLogger('core/assets');

/**
 * 资源管理器对象
 *
 * 该对象用于管理静态资源的获取, 根据环境不同, 返回不同的资源获取函数
 */
interface Assets {
  js(name: string): string;
  css(name: string): string;
  image(name: string): string;
}

async function makeAssets(): Promise<Assets | null> {
  // 静态文件散列缓存
  const _file_hash_map: Record<string, string> = {};

  /**
   * 计算静态文件的散列值
   *
   * @param file 要计算散列值的文件名
   * @returns 指定文件的散列值
   */
  function calculateHash(file: string): string {
  // 尝试从映射表中获取散列值
    let hash = _file_hash_map[file];

    // 如果映射表中不存在, 则读取文件, 计算散列值
    if (!hash) {
    // 生成静态文件存储路径
      const staticPath = path.join(__assetDir, file);

      // 创建 MD5 散列值计算对象, 计算文件散列值
      const md5 = crypto.createHash('md5');
      hash = md5.update(fs.readFileSync(staticPath)).digest('hex');

      // 将散列值保存到文件映射表中
      _file_hash_map[file] = hash;
    }
    return hash;
  }

  // 计算静态文件的散列值
  const _manifest: Record<string, string> = {};

  /**
   * 查找静态资源
   *
   * 该函数用于 `manifest` 不为 `null` 的情况, 即正式环境下, 查找指定资源的路径
   *
   * @param prefix 静态资源前缀, 可以为 "css", "image", "js" 等
   * @param name 静态资源名称
   * @returns 静态资源路径
   */
  function findAsset(prefix: string, name: string): string {
  // 生成资源 key
    const key = path.join(prefix, name);

    // 从 manifest 中根据资源 key 查找资源路径, 如果不存在, 则临时生成资源路径
    if (key in _manifest) {
      return path.join('/', _manifest[key] ?? '');
    }
    return `${path.join('/', key)}?__v=${calculateHash(key)}`;
  }

  /**
   * 查找静态资源
   *
   * 该函数用于 `manifest` 为 `null` 的情况, 即测试环境下, 查找指定资源的路径
   *
   * @param prefix 静态资源前缀, 可以为 "css", "image", "js" 等
   * @param name 静态资源名称
   * @returns 静态资源路径
   */
  function makeAssetsPath(prefix: string, name: string): string {
    const file = path.join(prefix, name);
    return `${path.join('/', file)}?__v=${calculateHash(file)}`;
  }

  async function importManifestFile(): Promise<Record<string, string> | null> {
    try {
    // 尝试加载静态资源的 manifest 文件, 如果未能加载, 说明为测试环境
      return (await import(path.join(__assetDir, 'manifest.json'), { with: { type: 'json' } })).default;
    } catch {
      log.warn('cannot load manifest.json file, make sure this is in dev env');
      return null;
    }
  }

  // 导入 manifest 文件
  const manifest = await importManifestFile();

  if (!manifest) {
    // 返回通过路径拼接的资源获取函数
    return {
      js(name: string): string {
        return makeAssetsPath('js', name);
      },
      css(name: string): string {
        return makeAssetsPath('css', name);
      },
      image(name: string): string {
        return makeAssetsPath('images', name);
      },
    };
  }

  // 将静态资源合并到 `manifest` 变量中
  Object.assign(_manifest, manifest);

  // 返回通过 Manifest 文件的资源获取函数
  return {
    js(name: string): string {
      return findAsset('js', name);
    },
    css(name: string): string {
      return findAsset('css', name);
    },
    image(name: string): string {
      return findAsset('images', name);
    },
  };
}

// 创建资源管理器对象
const _assets = await makeAssets();

/**
 * 资源管理器中间件工厂方法
 *
 * @returns 资源管理器中间件对象
 */
export function assets(): Middleware {
  return async (ctx: Context, next: Next) => {
    ctx.state.assets = _assets;
    await next();
  };
}
