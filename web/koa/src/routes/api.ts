import Router from "@koa/router";
import { Context } from "koa";
import { router } from "./router";

const apiRouter = new Router();

/**
 * 定义 `/` 路由, 渲染 HTML 模板文件
 */
apiRouter.get("/question", async (ctx: Context) => {
  console.log(ctx.url);
  ctx.body = {
    answer: "Hello"
  };
});

router.use("/api", apiRouter.routes(), apiRouter.allowedMethods());
