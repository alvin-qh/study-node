"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = version;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * 用于测试模块导出的函数
 * @returns 字符串内容
 */
async function version() {
  let conf = await Promise.resolve().then(() => _interopRequireWildcard(require('../../package.json')));
  conf = conf.default ?? conf;
  return `${conf['name']}@${conf['version']}`;
}
//# sourceMappingURL=utils.js.map