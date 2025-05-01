import axios from 'axios';

import FormData from 'form-data';

import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import fse from 'fs-extra';
import path from 'node:path';

import { start } from '@/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("test 'upload' router", () => {
  let closeFn: (() => void) | undefined;

  // 测试前执行, 启动服务器
  beforeAll(() => {
    closeFn = start();
  });

  // 测试后执行, 关闭服务器
  afterAll(() => {
    if (closeFn) {
      closeFn();
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

  it('should upload file success', async () => {
    await fse.emptyDir(path.join(__dirname, '../server/.upload'));

    const uploadFileName = path.join(__dirname, 'cookie.ts');
    const stream = fs.createReadStream(uploadFileName);

    let sended = false;

    stream.on('end', () => {
      sended = true;
    });

    try {
      const formData = new FormData();

      formData.append('file', stream, {
        contentType: 'application/typescript',
        filename: 'cookie.ts',
        // knownLength: fs.statSync(uploadFileName).size,
      });

      type UploadResult = {
        status: string
        message?: string
        filenames?: string[]
        totalSize?: number
      };

      const resp = await client.post<UploadResult>('/upload', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      expect(sended).toBeTruthy();

      expect(resp.status).toEqual(200);
      expect(resp.data.status).toEqual('success');
      expect(resp.data.filenames).toEqual(['cookie.ts']);
      expect(resp.data.totalSize).toEqual(958);
    }
    finally {
      stream.close();
    }
  });
});
