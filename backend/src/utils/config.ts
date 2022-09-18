import dotenv from "dotenv";
import path from "path";
dotenv.config({
  // environment files are in root (2 levels up)
  path: path.resolve(`.env_${process.env.NODE_ENV}`),
});
const DB_NAME = process.env.DB_NAME || "shadowrun";
const PASSWORD = process.env.PASSWORD || "postgres";
const HOST = process.env.HOST || "localhost";
const PORT = parseInt(process.env.PORT || "3000");

const DATABASE_PORT = parseInt(process.env.PORT || "5432");

export { DB_NAME, HOST, PORT, DATABASE_PORT, PASSWORD };
