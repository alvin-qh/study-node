/**
 * 定义函数测试模块导出
 * @returns 返回字符串
 */
export async function version(): Promise<string> {
  const conf = await import('../package.json', { with: { type: 'json' } });
  return `${conf.default['name']}@${conf.default['version']}`;
}
