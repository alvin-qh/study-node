const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const Logger = require("log4js");

// 实例化日志对象
const log = Logger.getLogger("core/assets");

// 尝试加载静态资源的 manifest 文件, 如果未能加载, 说明为测试环境
let manifest = null;
try {
  manifest = require("../public/manifest.json");
} catch (e) {
  log.warn("cannot load manifest.json file, make sure this is in dev env");
}

// 静态文件映射表
const FILE_HASH_MAP = {};

/**
 * 计算静态文件的散列值
 * 
 * @param {string} file 要计算散列值的文件名
 * @returns {string} 指定文件的散列值
 */
function calculateHash(file) {
  // 尝试从映射表中获取散列值
  let hash = FILE_HASH_MAP[file];

  // 如果映射表中不存在, 则读取文件, 计算散列值
  if (!hash) {
    // 生成静态文件存储路径
    const static_path = path.join(__dirname, "../public", file);

    // 创建 MD5 散列值计算对象, 计算文件散列值
    const md5 = crypto.createHash("md5");
    hash = md5.update(fs.readFileSync(static_path)).digest("hex");

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
 * @param {string} prefix 静态资源前缀, 可以为 "css", "image", "js" 等
 * @param {string} name 静态资源名称
 * @returns {string} 静态资源路径
 */
function findAsset(prefix, name) {
  // 生成资源 key
  const key = path.join(prefix, name);

  // 从 manifest 中根据资源 key 查找资源路径, 如果不存在, 则临时生成资源路径
  if (key in manifest) {
    return path.join("/", manifest[key]);
  }
  return `${path.join("/", key)}?__v=${calculateHash(key)}`;
}

/**
 * 查找静态资源
 * 
 * 该函数用于 `manifest` 为 `null` 的情况, 即测试环境下, 查找指定资源的路径
 * 
 * @param {string} prefix 静态资源前缀, 可以为 "css", "image", "js" 等
 * @param {string} name 静态资源名称
 * @returns {string} 静态资源路径
 */
function makeAssetsPath(prefix, name) {
  const file = path.join(prefix, name);
  return `${path.join("/", file)}?__v=${calculateHash(file)}`;
}

// 根据是否具备 manifest, 返回不同的资源获取函数
module.exports = manifest
  ? {
    js(name) {
      return findAsset("js", name);
    },
    css(name) {
      return findAsset("css", name);
    },
    image(name) {
      return findAsset("images", name);
    }
  }
  : {
    js(name) {
      return makeAssetsPath("js", name);
    },
    css(name) {
      return makeAssetsPath("css", name);
    },
    image(name) {
      return makeAssetsPath("images", name);
    }
  };
