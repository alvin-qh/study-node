// 对于生产环境或 CI 环境, 不初始化 Husky
if (process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
  process.exit(0);
}

// 其它环境, 初始化 Husky, 安装 Git Hook
const husky = (await import('husky')).default;
console.log(husky());