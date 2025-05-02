import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

import fse from 'fs-extra';
import fsp from 'fs/promises';

import { decodeAttachment } from '@/utils/attachment';
import { start } from '@/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 设置下载路径
const _downloadPath = (() => {
  const pathname = path.join(__dirname, './.download');
  if (!fs.existsSync(pathname)) {
    fs.mkdirSync(pathname);
  }
  return pathname;
})();

const baseUrl = new URL('http://localhost:9000');

/**
 * 测试 'res' 路由, 用于通过 Axios 上传和下载文件
 */
describe("test 'res' router", () => {
  let closeFn: (() => void) | undefined;

  // 测试前执行, 启动服务器
  beforeAll(() => {
    closeFn = start();
  });

  // 测试后执行, 关闭服务器
  afterAll(() => {
    if (closeFn) {
      closeFn();
      closeFn = undefined;
    };
  });

  /**
   * 测试通过 Fetch API 上传文件
   *
   * 通过 Node 原生的 Fetch API 上传文件, 一般需配合 `FormData` 类对象
   * (注意, 是 NodeJS 原生 `FormData` 类, 而非第三方 `form-data`
   * 模块中的 `FormData` 类)
   *
   * `FormData` 类对象表示一个从客户端上传的表单 (`multi-part/form-data`
   * 类型表单), 可以通过其 `append` 方法为表单添加表单项
   *
   * `FormData` 类对象的 `append` 具备三个参数, 分别为:
   * - `name`: 第一个参数, 表示表单项的名称, 即表单域的名称;
   * - `value`: 第二个参数, 表示表单项的值, 即表单域的值, 如果该值为一个
   *            `Blob` 对象, 则表示该表单项为一个上传文件;
   * - `fileName`: 第三个参数, 表示上传文件的原始文件名, 该参数可选;
   */
  it('should upload file success', async () => {
    // 清空服务端上传文件目录
    await fse.emptyDir(path.join(__dirname, '../server/.upload'));

    // 通过待上传文件, 创建一个 `Blob` 对象
    const blob = await fs.openAsBlob(__filename);

    // 创建 `multi-part/form-data` 类型表单对象
    const formData = new FormData();

    // 向表单对象中添加待上传的文件
    // 表单项名称为 `file`, 值为 `Blob` 对象, 并附加原始文件名
    formData.append('file', blob, path.basename(__filename));

    // 使用 Axios 发送上传文件请求, 等待服务器返回上传结果
    const resp = await fetch(new URL('/res/upload', baseUrl), {
      method: 'POST',
      body: formData,
    });

    // 确认服务端返回的响应状态码为 200, 表示上传成功
    expect(resp.status).toEqual(200);

    // 定义服务端返回上传结果类型
    type UploadResult = {
      status: string
      message?: string
      filenames?: string[]
      totalSize?: number
    };

    // 确认服务端返回的响应数据为上传成功, 并且上传的文件名为 'cookie.ts'
    const data = await resp.json() as UploadResult;
    expect(data.status).toEqual('success');
    expect(data.filenames).toEqual([path.basename(__filename)]);
    expect(data.totalSize).toEqual(fs.statSync(__filename).size);
  });

  /**
   * 测试通过 Fetch API 下载文件
   *
   * Axios 支持多种方式的响应类型, 包括:
   * - 'arraybuffer': 返回一个 ArrayBuffer 对象, 包含下载文件的内容;
   * - 'blob': 创建一个 Blob 对象, 用于一次性下载文件;
   * - 'document': 创建一个 Document 对象, 用于下载 HTML 文件;
   * - 'json': 创建一个 JSON 对象, 用于下载 JSON 文件;
   * - 'text': 创建一个文本对象, 用于下载文本文件;
   * - 'stream': 返回一个可读流对象, 以流式方式逐步下载文件;
   * - 'formdata': 创建一个 FormData 对象, 用于下载文件;
   */
  it('should GET download file success', async () => {
    // 清空客户端下载文件目录
    await fse.emptyDir(path.join(__dirname, '.download'));

    // 向服务端发送下载文件请求, 等待服务器返回下载结果
    const resp = await fetch(new URL('/res/download/index.ts', baseUrl));

    // 确认服务端返回的响应状态码为 200, 响应头为 `application/octet-stream`, 响应头中包含 `Content-Disposition`
    expect(resp.status).toEqual(200);
    expect(resp.headers.get('Content-Type')).toEqual('application/octet-stream');
    expect(resp.headers.get('Content-Disposition')).toEqual('attachment; filename="index.ts"; filename*=UTF-8\'\'index.ts');

    // 解析响应头中的 `Content-Disposition` 内容, 获取下载文件名
    const filename = decodeAttachment(resp.headers.get('Content-Disposition')!);
    expect(filename).toEqual('index.ts');

    // 创建一个可写流对象, 用于写入下载文件
    const downloadFileName = path.join(_downloadPath, `${filename}.download`);

    // 从响应对象中获取 `Blob` 对象
    const blob = await resp.blob();

    // 从 `Blob` 对象中获取缓冲数据
    const buffer = await blob.arrayBuffer();

    // 将缓冲数据写入文件
    await fsp.writeFile(downloadFileName, Buffer.from(buffer));
  });

  /**
   * 通过 Fetch API 分段下载文件
   *
   * 除了等待客户端一次性将文件下载完毕, Fetch API 还支持分段下载文件,
   * 这种情况针对于下载文件较大的情况, 可以一部分一部分的下载内容,
   * 并合并为最终的完整文件
   */
  it('should GET download file success by reader', async () => {
    // 清空客户端下载文件目录
    await fse.emptyDir(path.join(__dirname, '.download'));

    // 向服务端发送下载文件请求, 等待服务器返回下载结果
    const resp = await fetch(new URL('/res/download/index.ts', baseUrl));

    // 解析响应头中的 `Content-Disposition` 内容, 获取下载文件名
    const filename = decodeAttachment(resp.headers.get('Content-Disposition')!);
    expect(filename).toEqual('index.ts');

    // 生成保存下载内容的文件路径
    const downloadFileName = path.join(_downloadPath, `${filename}.download`);

    // 获取响应数据流读取器对象
    const reader = resp.body!.getReader();

    // 定义文本解码器对象, 将字节解码为 `utf-8` 编码字符串
    const decoder = new TextDecoder('utf-8');

    // 保存每一段相应内容的数组
    const chunks: string[] = [];

    // 创建文件对象, 用于写入下载文件
    const file = await fsp.open(downloadFileName, 'w');

    try {
      // 循环直到响应数据流数据读取完毕
      while (true) {
        // 读取响应数据流数据, 返回两个值, `done` 为 `true` 表示数据读取完毕,
        // `value` 为读取到的数据
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        // 将读取的数据片段写入文件
        fsp.writeFile(file, value);

        // 将读取到的数据片段解码为字符串, 并保存到数组中
        chunks.push(decoder.decode(value));
      }
    }
    finally {
      // 关闭文件
      await file.close();
    }

    // 确认读取内容符合预期
    expect(chunks.join('')).toEqual(fs.readFileSync(downloadFileName, 'utf-8'));
  });
});
