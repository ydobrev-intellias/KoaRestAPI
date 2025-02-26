import Router from "koa-router";
import authMiddleware from "../middlewares/authMiddleware";

const router = new Router({
  prefix: "/profile",
});

router.get("/", authMiddleware, (ctx) => {
  ctx.body = "profile";
});

export default router;
