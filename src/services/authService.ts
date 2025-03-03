import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Context } from "koa";
import { getUserByUsername } from "./userService";
import { db } from "../db/db";
import { users } from "../db/schema";

const SECRET_KEY = process.env.SECRET ?? "your-secret-key";

export const signUp = async (ctx: Context) => {
  const { username, password } = ctx.request.body;
  try {
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      ctx.status = 400;
      ctx.body = { error: "User already exists" };
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hashedPassword,
    };

    const result = (
      await db
        .insert(users)
        .values(newUser)
        .returning({ id: users.id, username: users.username })
    )[0];

    const token = jwt.sign({ id: result, username }, SECRET_KEY, {
      expiresIn: "30m",
    });

    ctx.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 1800000,
    });

    ctx.status = 201;
    ctx.body = { message: "User registered successfully", user: newUser };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Failed to register user" };
    console.error(error);
  }
};

export const signIn = async (ctx: Context) => {
  const { username, password } = ctx.request.body;
  try {
    const user = await getUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      ctx.status = 401;
      ctx.body = { error: "Invalid credentials" };
      return;
    }
    const token = jwt.sign({ id: user.id, username }, SECRET_KEY, {
      expiresIn: "30m",
    });
    ctx.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 1800000,
    });
    ctx.body = { message: "Login successful", user };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Failed to sign in" };
    console.error(error);
  }
};

export const signOut = async (ctx: Context) => {
  try {
    ctx.cookies.set("token", null);
    ctx.body = { message: "Logged out successfully" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Failed to log out" };
    console.error(error);
  }
};
