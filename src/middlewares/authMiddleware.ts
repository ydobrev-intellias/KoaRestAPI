import { Context, Next } from "koa";
import jwt from "jsonwebtoken";
import { db } from "../db/db";
import { posts } from "../db/schema";
import { eq } from "drizzle-orm";

const SECRET_KEY = process.env.SECRET ?? "secret";

const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get("token");
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    ctx.state.user = decoded;

    const { postId } = ctx.params;
    if (postId) {
      const post = await db
        .select({ userId: posts.userId })
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1);

      if (post.length === 0) {
        ctx.status = 404;
        ctx.body = { error: "Post not found" };
        return;
      }

      const postOwnerId = post[0].userId;

      if (postOwnerId !== ctx.state.user.id) {
        ctx.status = 403;
        ctx.body = { error: "Forbidden: You are not the owner of this post" };
        return;
      }
    }

    await next();
  } catch (error) {
    console.error(error);
    ctx.status = 403;
    ctx.body = { error: "Forbidden" };
  }
};

export default authMiddleware;
