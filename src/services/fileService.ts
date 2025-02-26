import fs from "fs";
import path from "path";

const FILE_PATH = path.join(__dirname, "../", String(process.env.USERS_FILE));

const ensureFileExists = () => {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify([]));
    }
  } catch (error) {
    console.error("Error checking file existence:", error);
    throw new Error("Failed to ensure file exists");
  }
};

export const readData = async () => {
  try {
    ensureFileExists();
    const data = await fs.promises.readFile(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    throw new Error("Failed to read data from file");
  }
};

export const writeData = async (data: any) => {
  try {
    ensureFileExists();
    await fs.promises.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data:", error);
    throw new Error("Failed to write data to file");
  }
};
