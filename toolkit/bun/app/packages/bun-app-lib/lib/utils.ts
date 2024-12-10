/**
 * 用于测试模块导出的函数
 * @returns 字符串结果
 */
export async function version(): Promise<string> {
  const conf = await import('../package.json', { assert: { type: 'json' } });
  return `${conf['name']}@${conf['version']}`;
}
