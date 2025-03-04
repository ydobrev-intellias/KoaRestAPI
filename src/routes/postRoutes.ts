import Router from "koa-router";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../services/postService";
import authMiddleware from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validationMiddleware";
import {
  createPostSchema,
  updatePostSchema,
} from "../validationSchemas/postSchemas";

const router = new Router({ prefix: "/posts" });

// Get all posts
router.get("/", async (ctx) => {
  await getPosts(ctx);
});

// Create post
router.post(
  "/",
  authMiddleware,
  validateBody(createPostSchema),
  async (ctx) => {
    await createPost(ctx);
  }
);

// Update post (only the post owner can update their post)
router.patch(
  "/:postId",
  authMiddleware,
  validateBody(updatePostSchema),
  async (ctx) => {
    await updatePost(ctx);
  }
);

// Delete post (only the post owner can delete their post)
router.delete("/:postId", authMiddleware, async (ctx) => {
  await deletePost(ctx);
});

// Get post by ID
router.get("/:postId", async (ctx) => {
  await getPostById(ctx);
});

export default router;
