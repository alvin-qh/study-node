// 定义 Cookie 类型
export type Cookies = Array<{ [key: string]: any }>;

/**
 * 解析 cookie 字符串
 *
 * @param cookies cookie 字符串
 * @returns cookie 键值对
 */
export function parseCookie(cookieValues?: Array<string>): Cookies {
  if (!cookieValues) {
    return [];
  }

  const cookies: Cookies = [];
  cookieValues.forEach((value) => {
    const regex = /([^=;]+)(=([^;]*))?/g;

    const cookie: Cookies[number] = {};

    let m: RegExpExecArray | null;
    while ((m = regex.exec(value))) {
      const key = m[1].trim().toLowerCase();
      let val: any = m[3] ? m[3].trim() : undefined;

      if (val === undefined) {
        switch (key) {
          case 'secure':
          case 'httponly':
            val = true;
            break;
        }
      }

      if (val !== undefined) {
        cookie[key] = val;
      }
    }

    if (Object.keys(cookie).length > 0) {
      cookies.push(cookie);
    }
  });
  return cookies;
}
