import { fail } from 'assert';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { expect } from 'chai';
import FormData from 'form-data';
import qs from 'querystring';
import { Stream } from 'stream';

/**
 * 测试 Http 服务端
 */
describe('Test http server', () => {
  /**
   * 测试 `axios` 基本操作
   */
  it('should axios send GET request and fetch success response', async () => {
    // 定义 axios 调用配置
    const conf: AxiosRequestConfig = {
      method: 'post',
      url: 'https://getman.cn/echo',
      responseType: 'text',
      data: {
        id: 100,
        name: 'Alvin',
        gender: 'M'
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain'
      }
    };

    // 发起请求
    const resp = await axios(conf);

    // 确认响应结果
    expect(resp.status).is.eq(200);
    expect(resp.data as string).is.contains('{"id":100,"name":"Alvin","gender":"M"}');
  });

  /**
   * 测试 axios 返回错误响应
   */
  it('should axios send GET request and fetch error response', async () => {
    // 定义 axios 调用配置
    const conf: AxiosRequestConfig = {
      method: 'post',
      url: 'https://getman.cn/echo/1',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    };

    try {
      // 发起请求
      await axios(conf);
      fail();
    } catch (err) {
      expect(err).is.instanceOf(AxiosError);
      if (!(err instanceof AxiosError)) {
        fail();
      }
      expect(err.code).is.eq('ERR_BAD_REQUEST');
      expect(err.response?.status).is.eq(404);
    }
  });

  /**
   * 测试获取字节数据
   */
  it('should get data as bytes', async () => {
    // 定义 axios 调用配置
    const conf: AxiosRequestConfig = {
      method: 'post',
      url: 'https://getman.cn/echo',
      // 返回二进制数据结果
      responseType: 'arraybuffer',
      headers: {
        Accept: 'text/plain'
      }
    };

    const resp = await axios(conf);
    expect(resp.status).is.eq(200);

    // 确认返回结果为 ArrayBuffer 类型, 且长度不为 0
    expect(resp.data).is.instanceOf(Buffer);
    expect((resp.data as Buffer).byteLength).is.greaterThan(0);

    // 对读取的字节数组进行文本解码
    const dec = new TextDecoder('utf-8');
    const s = dec.decode(resp.data);

    // 确认获取到的内容
    const lines = s.split('\r\n');
    expect(lines).has.length(12);
    expect(lines[0]).is.eq('POST /echo HTTP/1.1');
    expect(lines[11]).is.eq('');
  });

  /**
   * 测试流式读取数据
   */
  it('should get data as stream', async () => {
    // 定义 axios 调用配置
    const conf: AxiosRequestConfig = {
      method: 'post',
      url: 'https://getman.cn/echo',
      // 返回数据流结果
      responseType: 'stream',
      headers: {
        Accept: 'text/plain'
      }
    };

    const resp = await axios(conf);
    expect(resp.status).is.eq(200);

    // 确认返回结果为 ArrayBuffer 类型, 且长度不为 0
    expect(resp.data).is.instanceof(Stream);

    // 将流读取包装为一个 Promise 对象并进行 await
    const s = await new Promise<string>((resolve, reject) => {
      const buffers: Buffer[] = [];

      const stream = resp.data as Stream;

      // 错误处理
      stream.on('error', err => { reject(err); });

      // 读取分段数据
      stream.on('data', (chunk) => {
        buffers.push(Buffer.from(chunk));
      });

      // 处理读取结束
      stream.on('end', () => {
        const dec = new TextDecoder('utf-8');
        resolve(dec.decode(Buffer.concat(buffers)));
      });
    });

    // 确认获取到的内容
    const lines = s.split('\r\n');
    expect(lines).has.length(12);
    expect(lines[0]).is.eq('POST /echo HTTP/1.1');
    expect(lines[11]).is.eq('');
  });

  /**
   * 测试 POST urlencoded 格式提交
   */
  it('should post form data', async () => {
    // 将数据编码为 urlencoded 格式
    const form = qs.stringify({
      id: 100,
      name: 'Alvin',
      gender: 'M'
    });

    // 创建请求配置对象
    const conf: AxiosRequestConfig = {
      url: 'https://getman.cn/echo',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/plain'
      },
      data: form
    };

    // 发送请求并确认请求正确
    const resp = await axios(conf);
    expect(resp.status).is.eq(200);

    // 确认响应内容正确
    const lines = resp.data.split('\r\n');
    expect(lines[lines.length - 1]).is.eq('id=100&name=Alvin&gender=M');
  });

  /**
   * 测试发送 `multipart/form-data` 类型表单
   */
  it('should post multi-part form data', async () => {
    const enc = new TextEncoder();

    const form = new FormData();
    form.append('id', 100);
    form.append('name', 'Alvin');
    form.append('gender', 'M');
    form.append('content', Buffer.from(enc.encode('Hello World')), 'demo.txt');

    // 创建请求配置对象
    const conf: AxiosRequestConfig = {
      url: 'https://getman.cn/echo',
      method: 'post',
      headers: {
        ...form.getHeaders(),
        Accept: 'text/plain'
      },
      data: form
    };

    // 发送请求并确认请求正确
    const resp = await axios(conf);
    expect(resp.status).is.eq(200);
  });

  /**
   * 设置全局配置
   */
  it('should accept global configuration', async () => {
    axios.defaults.baseURL = 'https://getman.cn';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common.Accept = 'application/json';

    const resp = await axios.get('/echo');
    expect(resp.status).is.eq(200);
  });

  /**
   * 创建 Axios 对象并进行设置
   */
  it('should create axios object', async () => {
    // 通过默认配置创建 Axios 对象
    const http = axios.create({
      baseURL: 'https://getman.cn',
      headers: {
        common: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    });

    // 通过创建的对象发送请求并确认
    const resp = await http.post('/echo');
    expect(resp.status).is.eq(200);
  });
});
