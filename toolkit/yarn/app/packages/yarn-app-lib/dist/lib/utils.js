export async function version() {
  const conf = await import('../../package.json', { with: { type: 'json' } });
  return `${conf.default['name']}@${conf.default['version']}`;
}
//# sourceMappingURL=utils.js.map