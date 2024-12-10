export async function version() {
    const conf = await import('../../package.json', { with: { type: 'json' } });
    return `${conf['name']}@${conf['version']}`;
}
//# sourceMappingURL=utils.js.map