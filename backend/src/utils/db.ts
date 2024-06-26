import "dotenv/config";
// import * as logger from "./logger.js";
// import { DATABASE_URL } from "./config.js";
import MikroORMConfig from "@neon-codex/database/build/mikro-orm.config.js";
import { MikroORM } from "@mikro-orm/postgresql";

// Create a singleton equivilant orm creator
let cache: MikroORM;
export const init = async function () {
  if (cache !== undefined) {
    return cache;
  }
  const orm = await MikroORM.init(MikroORMConfig);
  cache = orm;
  return cache;
};
