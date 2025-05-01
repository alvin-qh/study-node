/**
 * 将所给文件名进行编码, 返回 `Content-Disposition` 请求头内容
 *
 * @param filename 文件名
 * @returns `Content-Disposition` 请求头内容
 */
export function encodeAttachment(filename: string): string {
  // 将文件名进行编码
  filename = encodeURIComponent(filename);

  // 返回 `Content-Disposition` 请求头内容
  return `attachment; filename="${filename}"; filename*=UTF-8''${filename}`;
}

/**
 * 将 `Content-Disposition` 请求头内容进行解码, 返回文件名
 *
 * @param attachment `Content-Disposition` 请求头内容
 * @returns 文件名
 */
export function decodeAttachment(attachment: string): string | undefined {
  // 用于解析 `Content-Disposition` 请求头的正则表达式
  const regex = /attachment;\s*(filename="(.+?)")?;?(\s*filename\*=(.+?)''(.+))?/;

  // 匹配正则表达式, 返回匹配结果
  const m = regex.exec(attachment);
  if (!m) {
    return;
  }

  console.log(m);

  let filename: string | undefined;

  // 判断 `Content-Disposition` 请求头中是否包含 `filename*` 参数
  if (m[5]) {
    // 判断 `filename*` 参数的编码是否为 `UTF-8`
    if (m[4].toUpperCase() !== 'UTF-8') {
      return;
    }
    // 将 `filename*` 参数的值进行解码
    filename = decodeURIComponent(m[5]);
  }
  else if (m[2]) {
    // 如果 `filename*` 参数不存在, 则使用 `filename` 参数的值进行解码
    filename = decodeURIComponent(m[2]);
  }

  return filename;
}
