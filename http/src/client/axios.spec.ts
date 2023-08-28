import { fail } from "assert";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { expect } from "chai";

/**
 * 测试 Http 服务端
 */
describe("Test http server", () => {
  /**
   * 测试 `axios` 基本操作
   */
  it("should axios send GET request and fetch success response", async () => {
    // 定义 axios 调用配置
    const conf: AxiosRequestConfig = {
      method: "post",
      url: "https://getman.cn/echo",
      data: {
        id: 100,
        name: "Alvin",
        gender: "M",
      },
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    };

    // 发起请求
    const resp = await axios(conf);

    // 确认响应结果
    expect(resp.status).is.eq(200);
    expect(resp.data as string).is.contains("{\"id\":100,\"name\":\"Alvin\",\"gender\":\"M\"}");
  });

  /**
   * 测试 axios 返回错误响应
   */
  it("should axios send GET request and fetch error response", async () => {
    // 定义 axios 调用配置
    const conf: AxiosRequestConfig = {
      method: "post",
      url: "https://getman.cn/echo/1",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
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
      expect(err.code).is.eq("ERR_BAD_REQUEST");
      expect(err.response?.status).is.eq(404);
    }
  });
});
