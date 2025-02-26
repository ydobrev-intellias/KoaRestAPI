import Koa from "koa";

import "dotenv/config";
import koaBody from "koa-body";
import router from "./routes";

const PORT = process.env.PORT ?? 3001;

const app = new Koa();

app.use(koaBody());

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
