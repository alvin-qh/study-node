import views from "@ladjs/koa-views";
import env from "dotenv";
import Koa from "koa";
import serve from "koa-static";
import nunjucks from "nunjucks";
import path from "path";
import { router } from "./routes";

env.config();

/**
 *  初始化 `nunjucks` 模板引擎环境
 */
const nunjucksEnv = new nunjucks.Environment(
  // 指定读取模板文件的位置
  new nunjucks.FileSystemLoader(path.join(__dirname, "views"))
);

// 实例化 Koa 对象
export const app = new Koa();

// 设置 Koa 中间件
app
  .use(serve(path.join(__dirname, "assets")))
  .use(  // 设置模板引擎中间件
    views(
      path.join(__dirname, "views"),
      {
        options: {
          nunjucksEnv
        },
        map: { html: "nunjucks" }
      }
    )
  )
  .use(router.routes()) // 设置路由中间件
  .use(router.allowedMethods());

// 启动服务
app.listen(parseInt(process.env.PORT!), "0.0.0.0");
