import Router from "koa-router";
import authMiddleware from "../middlewares/authMiddleware";
import { Context } from "koa";
import { getProfile } from "../services/profileService";

const router = new Router({
  prefix: "/profile",
});

// Get profile
router.get("/", authMiddleware, async (ctx: Context) => {
  await getProfile(ctx);
});

export default router;
