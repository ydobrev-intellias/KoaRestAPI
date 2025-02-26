import { readData } from "./fileService";
import User from "../types/User";

export const getProfile = async () => {
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
