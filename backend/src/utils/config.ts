import "dotenv/config";
const DB_NAME = process.env.DB || "shadowrun";
const PASSWORD = process.env.password || "postgres";
const HOST = process.env.HOST || "localhost";
const PORT = parseInt(process.env.PORT || "3000");

const DATABASE_PORT = parseInt(process.env.PORT || "5432");

export { DB_NAME, HOST, PORT, DATABASE_PORT, PASSWORD };
