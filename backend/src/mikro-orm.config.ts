import { HOST, DATABASE_PORT, PASSWORD } from "./utils/config.js";
import { Users, Threads, Comments } from "./models/models.js";
import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

const dbOptions: Options<PostgreSqlDriver> = {
  entities: [Users, Threads, Comments],
  type: "postgresql",
  host: HOST,
  port: DATABASE_PORT,
  dbName: "shadowrun",
  password: PASSWORD,
};

export default dbOptions;
