import { Context } from "koa";
import { db } from "../db/db";
import { posts } from "../db/schema";
import { eq } from "drizzle-orm";

export const getPosts = async (ctx: Context) => {
  try {
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        userId: posts.userId,
      })
      .from(posts);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    console.error("Error reading posts:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch posts" };
  }
};

export const getPostById = async (ctx: Context) => {
  const { postId } = ctx.params;

  try {
    const result = (
      await db
        .select({
          id: posts.id,
          title: posts.title,
          content: posts.content,
          userId: posts.userId,
        })
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1)
    )[0];

    if (!result) {
      ctx.status = 404;
      ctx.body = { error: "Post not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    console.error("Error fetching post:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch post" };
  }
};

export const createPost = async (ctx: Context) => {
  const { title, content } = ctx.request.body;

  try {
    const result = await db
      .insert(posts)
      .values({
        title,
        content,
        userId: ctx.state.user.id,
      })
      .returning();

    ctx.status = 201;
    ctx.body = { message: "Post created successfully", post: result[0] };
  } catch (error) {
    console.error("Error creating post:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to create post" };
  }
};

export const updatePost = async (ctx: Context) => {
  const { postId } = ctx.params;
  const { title, content } = ctx.request.body;

  try {
    const post = (
      await db
        .select({
          userId: posts.userId,
          title: posts.title,
          content: posts.content,
        })
        .from(posts)
        .where(eq(posts.id, postId))
    )[0];

    if (!post) {
      ctx.status = 404;
      ctx.body = { error: "Post not found" };
      return;
    }

    if (post.userId !== ctx.state.user.id) {
      ctx.status = 403;
      ctx.body = { error: "Forbidden: You are not the owner of this post" };
      return;
    }

    await db.update(posts).set({ title, content }).where(eq(posts.id, postId));

    const updatedPost = (
      await db
        .select({
          id: posts.id,
          userId: posts.userId,
          title: posts.title,
          content: posts.content,
        })
        .from(posts)
        .where(eq(posts.id, postId))
    )[0];

    ctx.status = 200;
    ctx.body = {
      message: "Post updated successfully",
      post: updatedPost,
    };
  } catch (error) {
    console.error("Error updating post:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to update post" };
  }
};

export const deletePost = async (ctx: Context) => {
  const { postId } = ctx.params;

  try {
    const post = (
      await db
        .select({ userId: posts.userId })
        .from(posts)
        .where(eq(posts.id, postId))
    )[0];

    if (!post) {
      ctx.status = 404;
      ctx.body = { error: "Post not found" };
      return;
    }

    if (post.userId !== ctx.state.user.id) {
      ctx.status = 403;
      ctx.body = { error: "Forbidden: You are not the owner of this post" };
      return;
    }

    await db.delete(posts).where(eq(posts.id, postId));

    ctx.status = 200;
    ctx.body = { message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to delete post" };
  }
};
