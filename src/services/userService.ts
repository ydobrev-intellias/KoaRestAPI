import bcrypt from "bcrypt";
import { Context } from "koa";
import jwt from "jsonwebtoken";
import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const SECRET_KEY = process.env.SECRET ?? "";

export const getUsers = async (ctx: Context) => {
  try {
    const result = await db
      .select({ id: users.id, username: users.username })
      .from(users);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    console.error("Error reading users:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch users" };
  }
};

export const deleteUser = async (ctx: Context) => {
  const { userId } = ctx.params;

  try {
    await db.delete(users).where(eq(users.id, userId));

    ctx.status = 200;
    ctx.body = { message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to delete user" };
  }
};

export const updateUser = async (ctx: Context) => {
  const { userId } = ctx.params;
  const { username, password } = ctx.request.body;

  try {
    const result = (
      await db.select().from(users).where(eq(users.id, userId))
    )[0];

    let userDataChanged = false;
    const updatedData: { username?: string; password?: string } = {};

    if (username && username !== result.username) {
      updatedData.username = username;
      userDataChanged = true;
    }

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
      userDataChanged = true;
    }

    if (userDataChanged) {
      await db.update(users).set(updatedData).where(eq(users.id, userId));

      const token = jwt.sign(
        {
          id: userId,
          username: updatedData.username || result.username,
        },
        SECRET_KEY,
        { expiresIn: "30m" }
      );

      ctx.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 1800000,
      });
    }

    ctx.status = 200;
    ctx.body = {
      message: "User updated successfully",
      user: { ...result, ...updatedData },
    };
  } catch (error) {
    console.error("Error updating user:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to update user" };
  }
};

export const getUserById = async (ctx: Context) => {
  const { id } = ctx.params;

  try {
    const result = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(eq(users.id, id));

    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    console.error("Error fetching user:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch user" };
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const result = (
      await db.select().from(users).where(eq(users.username, username)).limit(1)
    )[0];

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
