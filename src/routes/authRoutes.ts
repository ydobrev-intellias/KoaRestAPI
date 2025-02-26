import { Context } from "koa";
import { signIn, signOut, signUp } from "../services/authService";
import Router from "koa-router";
import authMiddleware from "../middlewares/authMiddleware";

const router = new Router({
  prefix: "/auth",
});

router.post("/signup", async (ctx: Context) => {
  await signUp(ctx);
});

router.post("/signin", async (ctx: Context) => {
  await signIn(ctx);
});

router.post("/signout", authMiddleware, async (ctx: Context) => {
  await signOut(ctx);
});

export default router;
