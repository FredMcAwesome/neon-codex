import "dotenv/config";
const DB_NAME = process.env.DB || "shadowrun";
const USERNAME = process.env.username || "postgres";
const PASSWORD = process.env.password || "postgres";
const HOST = process.env.HOST || "localhost";

const DATABASE_URL =
  "postgres://" + USERNAME + ":" + PASSWORD + "@" + HOST + "/" + DB_NAME;
const PORT = process.env.PORT || 3000;

export { DATABASE_URL, HOST, PORT };
