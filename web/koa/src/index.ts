import env from "dotenv";
import Koa from "koa";
import { router } from "./routes";

env.config();

const app = new Koa();
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(parseInt(process.env.PORT!), "0.0.0.0");
