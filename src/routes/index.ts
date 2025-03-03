import Router from "koa-router";
import userRouter from "./userRoutes";
import authRouter from "./authRoutes";
import postRouter from "./postRoutes";

const router = new Router();

router.use(authRouter.routes());
router.use(userRouter.routes());
router.use(postRouter.routes());

export default router;
