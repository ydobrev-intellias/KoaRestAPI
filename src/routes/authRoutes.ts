import { Context } from "koa";
import { signIn, signOut, signUp } from "../services/authService";
import Router from "koa-router";
import authMiddleware from "../middlewares/authMiddleware";
import { createUserSchema } from "../schemas";
import { validateBody } from "../middlewares/validationMiddleware";

const router = new Router({
  prefix: "/auth",
});

// Sign out
router.post("/signup", validateBody(createUserSchema), async (ctx: Context) => {
  await signUp(ctx);
});

// Sign in
router.post("/signin", validateBody(createUserSchema), async (ctx: Context) => {
  await signIn(ctx);
});

// Sign out
router.post("/signout", authMiddleware, async (ctx: Context) => {
  await signOut(ctx);
});

export default router;
