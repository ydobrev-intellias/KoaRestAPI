import Koa from "koa";

import "dotenv/config";
import koaBody from "koa-body";
import router from "./routes";
import { config } from "../config";

const app = new Koa();

app.use(koaBody());

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
