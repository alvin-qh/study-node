/**
 * 解析 cookie 字符串
 *
 * @param cookies cookie 字符串
 * @returns cookie 键值对
 */
export function parseCookie(cookies?: Array<string>): Record<string, any> {
  if (!cookies) {
    return {};
  }

  const result = {};
  cookies.forEach((cookie) => {
    const regex = /([^=;]+)(=([^;]*))?/g;

    let m: RegExpExecArray | null;
    while ((m = regex.exec(cookie))) {
      result[m[1].trim()] = m[3] ? m[3].trim() : true;
    }
  });
  return result;
}
