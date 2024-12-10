/**
 * 用于测试模块导出的函数
 * @returns 字符串内容
 */
export async function version() {
  const conf = await import('../../package.json', { with: { type: 'json' } });
  return `${conf['name']}@${conf['version']}`;
}
