import Router from "koa-router";
import authMiddleware from "../middlewares/authMiddleware";
import { Context } from "koa";

const router = new Router({
  prefix: "/profile",
});

router.get("/", authMiddleware, (ctx: Context) => {
  ctx.body = {
    username: ctx.state.user.username,
    id: ctx.state.user.id,
  };
});

export default router;
