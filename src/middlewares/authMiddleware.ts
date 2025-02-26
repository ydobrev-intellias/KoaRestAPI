import { Context, Next } from "koa";

const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET ?? "";

const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get("token");
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  try {
    ctx.state.user = jwt.verify(token, SECRET);
    await next();
  } catch (error) {
    ctx.status = 403;
    ctx.body = { error: "Forbidden" };
  }
};

export default authMiddleware;
