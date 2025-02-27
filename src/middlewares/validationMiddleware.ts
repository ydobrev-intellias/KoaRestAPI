import { Context, Next } from "koa";
import Ajv from "ajv";

const ajv = new Ajv();

export const validateBody = (schema: Object) => (ctx: Context, next: Next) => {
  const validate = ajv.compile(schema);
  const valid = validate(ctx.request.body);

  if (!valid) {
    ctx.status = 400;
    ctx.body = {
      error: "Validation failed",
    };
    return;
  }

  return next();
};
