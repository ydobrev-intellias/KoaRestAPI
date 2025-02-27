import { Context } from "koa";

export const getProfile = (ctx: Context) => {
  ctx.body = {
    username: ctx.state.user.username,
    id: ctx.state.user.id,
  };
};
