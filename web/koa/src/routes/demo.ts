import { Context, Next } from "koa";
import { router } from "./router";

router.get("/", async (ctx: Context, next: Next) => {
  ctx.body = "Hello World";
  await next();
});
