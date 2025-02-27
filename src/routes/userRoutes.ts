import Router from "koa-router";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../services/userService";
import authMiddleware from "../middlewares/authMiddleware";
import { Context } from "koa";
import { validateBody } from "../middlewares/validationMiddleware";
import { updateUserSchema } from "../schemas";

const router = new Router({ prefix: "/users" });

// Get all users
router.get("/", authMiddleware, async (ctx: Context) => {
  await getUsers(ctx);
});

// Delete user
router.delete("/:userId", authMiddleware, async (ctx: Context) => {
  await deleteUser(ctx);
});

// Update user
router.put(
  "/:userId",
  authMiddleware,
  validateBody(updateUserSchema),
  async (ctx: Context) => {
    await updateUser(ctx);
  }
);

// Get user by ID
router.get("/:id", authMiddleware, async (ctx: Context) => {
  await getUserById(ctx);
});

export default router;
