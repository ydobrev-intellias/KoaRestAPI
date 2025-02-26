import Router from "koa-router";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../services/userService";
import authMiddleware from "../middlewares/authMiddleware";
import { Context } from "koa";

const router = new Router({ prefix: "/users" });

// Get users
router.get("/", authMiddleware, async (ctx) => {
  try {
    const users = await getUsers();
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch users" };
    console.error("Error in /users route:", error);
  }
});

// Delete user
router.delete("/:userId", authMiddleware, async (ctx) => {
  const { userId } = ctx.params;

  try {
    const result = await deleteUser(userId);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    if (error instanceof Error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
  }
});

// Update user
router.put("/:userId", authMiddleware, async (ctx) => {
  const { userId } = ctx.params;
  const { username, password } = ctx.request.body;
  try {
    const result = await updateUser(userId, { username, password });
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    if (error instanceof Error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
  }
});

// Get user by id
router.get("/:id", authMiddleware, async (ctx: Context) => {
  const { id } = ctx.params;

  try {
    const user = await getUserById(id);

    if (!user) {
      ctx.status = 404;
      ctx.body = { error: "User not found" };
    } else {
      ctx.body = user;
    }
  } catch (error) {
    if (error instanceof Error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
    console.error("Error in /users/:id route:", error);
  }
});

export default router;
