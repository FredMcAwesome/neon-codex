import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const currentPath = import.meta.url;
dotenv.config({
  // environment files are in root (3 levels up)
  path: fileURLToPath(
    path.dirname(currentPath) +
      `../../../../.env_${process.env.NODE_ENV || "production"}`
  ),
});
const DB_NAME = process.env.DB_NAME || "shadowrun";
const PASSWORD = process.env.PASSWORD || "postgres";
const HOST = process.env.HOST || "localhost";
const PORT = parseInt(process.env.PORT || "3000");
const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

const DATABASE_PORT = parseInt(process.env.PORT || "5432");

export { DB_NAME, HOST, PORT, DATABASE_PORT, PASSWORD, TOKEN_SECRET };
