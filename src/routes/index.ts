import Router from "koa-router";
import userRouter from "./userRoutes";
import authRouter from "./authRoutes";
import profileRouter from "./profileRoutes";

const router = new Router();

router.use(authRouter.routes());
router.use(userRouter.routes());
router.use(profileRouter.routes());

export default router;
