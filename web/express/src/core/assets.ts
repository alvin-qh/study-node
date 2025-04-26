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
 * 声明静态资源列表类型
 */
type Manifest = Record<string, string>;

// 尝试加载静态资源的 manifest 文件, 如果未能加载, 说明为测试环境
let manifest: Manifest = {};

try {
  // 加载静态资源列表
  manifest = (await import(path.join(__assetDir, 'manifest.json'), { with: { type: 'json' } })).default;
}
catch {
  log.warn('cannot load manifest.json file, make sure this is in dev env');
}

// 静态文件映射表
const FILE_HASH_MAP: Record<string, any> = {};

/**
 * 计算静态文件的散列值
 *
 * @param file 要计算散列值的文件名
 * @returns 指定文件的散列值
 */
function calculateHash(file: string): string {
  // 尝试从映射表中获取散列值
  let hash = FILE_HASH_MAP[file];

  // 如果映射表中不存在, 则读取文件, 计算散列值
  if (!hash) {
    // 生成静态文件存储路径
    const staticPath = path.join(__assetDir, file);

    // 创建 MD5 散列值计算对象, 计算文件散列值
    const md5 = crypto.createHash('md5');
    hash = md5.update(fs.readFileSync(staticPath)).digest('hex');

    // 将散列值保存到文件映射表中
    FILE_HASH_MAP[file] = hash;
  }
  return hash;
}

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
  if (key in manifest) {
    return path.join('/', manifest?.[key] ?? '');
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

// 根据是否具备 manifest, 返回不同的资源获取函数
export const assets = manifest
  ? {
    js(name: string): string {
      return findAsset('js', name);
    },
    css(name: string): string {
      return findAsset('css', name);
    },
    image(name: string): string {
      return findAsset('images', name);
    },
  }
  : {
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
