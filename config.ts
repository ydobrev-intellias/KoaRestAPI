import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  secretKey: process.env.SECRET || "secret",
  tokenExpiration: 1800,
  cookieMaxAge: 1800000,
  usersFile: process.env.USERS_FILE || "storage/users.json",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgres://user:secret-password@localhost:5432/koarestapi-db",
};
