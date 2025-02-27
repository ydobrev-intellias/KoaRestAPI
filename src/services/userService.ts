import { readData, writeData } from "./fileService";
import bcrypt from "bcrypt";
import User from "../types/User";
import { Context } from "koa";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET ?? "";

export const getUsers = async (ctx: Context) => {
  try {
    const users = await readData();
    ctx.status = 200;
    ctx.body = users.map((user: User) => ({
      id: user.id,
      username: user.username,
    }));
  } catch (error) {
    console.error("Error reading users:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch users" };
  }
};

export const deleteUser = async (ctx: Context) => {
  const { userId } = ctx.params;

  try {
    const users = await readData();
    const userIndex = users.findIndex((user: User) => user.id === userId);

    if (userIndex === -1) {
      ctx.status = 404;
      ctx.body = { error: "User not found" };
      return;
    }

    users.splice(userIndex, 1);
    await writeData(users);

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
    const users = await readData();
    const userIndex = users.findIndex((user: User) => user.id === userId);

    if (userIndex === -1) {
      ctx.status = 404;
      ctx.body = { error: "User not found" };
      return;
    }

    const user = users[userIndex];
    let userDataChanged = false;

    if (username && username !== user.username) {
      user.username = username;
      userDataChanged = true;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    users[userIndex] = user;
    await writeData(users);

    if (userDataChanged) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
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
      user: users[userIndex],
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
    const users = await readData();
    const user = users.find((user: User) => user.id === id);

    if (!user) {
      ctx.status = 404;
      ctx.body = { error: "User not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = user;
  } catch (error) {
    console.error("Error fetching user:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch user" };
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const users = await readData();
    const user = users.find((user: User) => user.username === username);

    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
