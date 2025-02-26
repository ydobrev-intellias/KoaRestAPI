import { readData, writeData } from "./fileService";
import bcrypt from "bcrypt";
import User from "../types/User";

export const getUsers = async () => {
  try {
    const users = await readData();
    return users.map((user: User) => ({
      username: user.username,
      id: user.id,
    }));
  } catch (error) {
    console.error("Error reading users:", error);
    throw new Error("Failed to read users from file");
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const users = await readData();
    const user = users.find((user: User) => user.username === username);

    if (!user) {
      return false;
    }
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user by username");
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const users = await readData();

    const userIndex = users.findIndex((user: User) => user.id === userId);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    users.splice(userIndex, 1);

    await writeData(users);

    return { message: "User deleted successfully" };
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error.message || "Failed to delete user");
  }
};

export const updateUser = async (
  userId: string,
  updatedData: Omit<User, "id">
) => {
  try {
    const users = await readData();

    const userIndex = users.findIndex((user: User) => user.id === userId);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const user = users[userIndex];

    if (updatedData.username && updatedData.username !== user.username) {
      user.username = updatedData.username;
    }

    if (updatedData.password) {
      user.password = await bcrypt.hash(updatedData.password, 10);
    }

    users[userIndex] = user;
    await writeData(users);

    return { message: "User updated successfully" };
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error.message || "Failed to update user");
  }
};

export const getUserById = async (userId: string) => {
  try {
    const users = await readData();
    const userIndex = users.findIndex((user: User) => user.id === userId);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    return users[userIndex];
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error.message || "Failed to fetch user by id");
  }
};
