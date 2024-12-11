import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { expect } from 'chai';
import FormData from 'form-data';
import qs from 'querystring';
import { Stream } from 'stream';

/**
 * 测试 Http 服务端
 */
describe('test `axios` http client', () => {
  /**
   * 测试 `axios` 基本操作
   */
  it('should `GET` success response', async () => {
    // 定义 axios 调用配置
    const conf: AxiosRequestConfig = {
      method: 'get',
      timeout: 5000,
      url: 'http://localhost:3030/users/1',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    // 发起请求
    const resp = await axios(conf).catch(e => expect.fail(e));
    expect(resp).is.not.null;

    // 确认响应结果
    expect(resp!.status).is.eq(200);
    expect(resp!.data).is.deep.eq({ id: 1, name: "Alvin", gender: "M", birthday: "1981-03-17" });
  });

  /**
   * 测试 axios 返回错误响应
   */
  it('should `GET` error response', async () => {
    // 定义 axios 调用配置
    const conf: AxiosRequestConfig = {
      method: 'get',
      url: 'http://localhost:3030/users/3',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    try {
      // 发起请求
      await axios(conf);
      expect.fail();
    } catch (err) {
      expect(err).is.instanceOf(AxiosError);
      expect(err.code).is.eq('ERR_BAD_REQUEST');
      expect(err.response?.status).is.eq(404);
    }
  });

  /**
   * 测试获取字节数据
   */
  it('should `GET` response as binary data', async () => {
    // 定义 axios 调用配置
    const conf: AxiosRequestConfig = {
      method: 'get',
      url: 'http://localhost:3030/users/2',
      responseType: 'arraybuffer', // 返回二进制数据结果
      headers: { Accept: 'text/plain' },
    };

    const resp = await axios(conf).catch(e => expect.fail(e));
    expect(resp.status).is.eq(200);

    // 确认返回结果为 ArrayBuffer 类型, 且长度不为 0
    expect(resp.data).is.instanceOf(Buffer);
    expect((resp.data as Buffer).byteLength).is.eq(59);

    // 对读取的字节数组进行文本解码
    const dec = new TextDecoder('utf-8');
    const s = dec.decode(resp.data);

    // 确认获取到的内容
    const lines = s.split('\r\n');
    expect(lines).has.length(1);
    expect(lines[0]).is.eq('{"id":2,"name":"Emma","gender":"F","birthday":"1985-03-29"}');
  });

  /**
   * 测试流式读取数据
   */
  it('should `GET` response as stream', async () => {
    // 定义 axios 调用配置
    const conf: AxiosRequestConfig = {
      method: 'get',
      url: 'http://localhost:3030/users/1',
      responseType: 'stream', // 返回数据流结果
      headers: { Accept: 'text/plain' },
    };

    const resp = await axios(conf).catch(e => expect.fail(e));
    expect(resp.status).is.eq(200);

    // 确认返回结果为 ArrayBuffer 类型, 且长度不为 0
    expect(resp.data).is.instanceof(Stream);

    // 将流读取包装为一个 Promise 对象并进行 await
    const s = await new Promise<string>((resolve, reject) => {
      const buffers: Buffer[] = [];

      // 设置回调函数处理流
      (resp.data as Stream)
        .on('error', err => { reject(err); }) // 错误处理
        .on('data', (chunk) => { buffers.push(Buffer.from(chunk)); }) // 读取分段数据
        .on('end', () => { // 处理读取结束
          const dec = new TextDecoder('utf-8');
          resolve(dec.decode(Buffer.concat(buffers)));
        });
    });

    // 确认获取到的内容
    const lines = s.split('\r\n');
    expect(lines).has.length(1);
    expect(lines[0]).is.eq('{"id":1,"name":"Alvin","gender":"M","birthday":"1981-03-17"}');
  });

  /**
   * 测试 POST urlencoded 格式提交
   */
  it('should post form data', async () => {
    // 将数据编码为 urlencoded 格式
    const form = qs.stringify({
      id: 100,
      name: 'Alvin',
      gender: 'M',
    });

    // 创建请求配置对象
    const conf: AxiosRequestConfig = {
      url: 'https://getman.cn/echo',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/plain',
      },
      data: form,
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
        Accept: 'text/plain',
      },
      data: form,
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
          Accept: 'application/json',
        },
      },
    });

    // 通过创建的对象发送请求并确认
    const resp = await http.post('/echo');
    expect(resp.status).is.eq(200);
  });
});
