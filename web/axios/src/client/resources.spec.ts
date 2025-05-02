import axios from 'axios';

import FormData from 'form-data';

import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import fse from 'fs-extra';
import path from 'node:path';

import { start } from '@/server';

import { decodeAttachment } from '@/utils/attachment';

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

  // 创建一个 axios 实例
  const client = axios.create({
    baseURL: 'http://localhost:9000', // 服务器地址
    headers: { 'Content-Type': 'text/html' }, // 响应类型
    timeout: 3000, // 超时时间
    withCredentials: true,
    validateStatus: () => true,
  });

  /**
   * 测试通过 Axios 上传文件
   */
  it('should upload file success', async () => {
    // 清空服务端上传文件目录
    await fse.emptyDir(path.join(__dirname, '../server/.upload'));

    // 创建一个读文件流, 为待上传文件, 上传文件为当前文件
    const stream = fs.createReadStream(__filename);

    let sended = false;

    // 监听文件流读取结束事件, 表示客户端已将文件上传完毕
    stream.on('end', () => {
      sended = true;
    });

    // 创建表单对象, 用于上传文件
    const formData = new FormData();

    // 向表单对象中添加待上传的文件
    formData.append('file', stream, {
      contentType: 'application/typescript',
      filename: 'cookie.ts',
      // knownLength: fs.statSync(uploadFileName).size,
    });

    // 定义服务端返回上传结果类型
    type UploadResult = {
      status: string
      message?: string
      filenames?: string[]
      totalSize?: number
    };

    // 使用 Axios 发送上传文件请求, 等待服务器返回上传结果
    const resp = await client.post<UploadResult>('/res/upload', formData, {
      headers: {
        // 将表单对象的表头添加到请求头中
        ...formData.getHeaders(),
      },
    });

    // 确认响应返回后, 客户端一定将文件上传完毕
    expect(sended).toBeTruthy();

    // 确认服务端返回的响应状态码为 200, 表示上传成功
    expect(resp.status).toEqual(200);

    // 确认服务端返回的响应数据为上传成功, 并且上传的文件名为 'cookie.ts'
    expect(resp.data.status).toEqual('success');
    expect(resp.data.filenames).toEqual(['cookie.ts']);
    expect(resp.data.totalSize).toEqual(fs.statSync(__filename).size);
  });

  /**
   * 测试通过 Axios 下载文件
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

    // 使用 Axios 发送下载文件请求, 等待服务器返回下载结果
    const resp = await client.get('/res/download/index.ts', {
      responseType: 'stream',
    });

    // 确认服务端返回的响应状态码为 200, 响应头为 `application/octet-stream`, 响应头中包含 `Content-Disposition`
    expect(resp.status).toEqual(200);
    expect(resp.headers['content-type']).toEqual('application/octet-stream');
    expect(resp.headers['content-disposition']).toEqual('attachment; filename="index.ts"; filename*=UTF-8\'\'index.ts');

    // 解析响应头中的 `Content-Disposition` 内容, 获取下载文件名
    const filename = decodeAttachment(resp.headers['content-disposition']);
    expect(filename).toEqual('index.ts');

    // 创建一个可写流对象, 用于写入下载文件
    const downloadFileName = path.join(_downloadPath, `${filename}.download`);

    // 使用可写流对象, 将响应数据写入下载文件
    await new Promise<void>((resolve, reject) => {
      // 监听可写流对象的错误事件, 如果发生错误, 返回 `Reject` 结果
      resp.data.on('error', reject);

      // 监听可写流对象的结束事件, 表示下载文件完成, 返回 `Resolve` 结果
      resp.data.on('end', () => {
        resolve();
      });

      // 使用可写流对象, 将响应数据写入下载文件
      const ws = fs.createWriteStream(downloadFileName);

      // 监听可写流对象的错误事件, 如果发生错误, 返回 `Reject` 结果
      ws.on('error', reject);

      // 使用可写流对象, 将响应数据写入下载文件
      resp.data.pipe(ws);
    });
  });
});
