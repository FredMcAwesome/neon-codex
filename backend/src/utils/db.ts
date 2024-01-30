import "dotenv/config";
// import * as logger from "./logger.js";
// import { DATABASE_URL } from "./config.js";
import MikroORMConfig from "@shadowrun/database/build/mikro-orm.config.js";
import { MikroORM } from "@mikro-orm/postgresql";

// Create a singleton equivilant orm creator
let cache: MikroORM;
export const init = async () => {
  if (cache !== undefined) {
    return cache;
  }
  const orm = await MikroORM.init(MikroORMConfig);
  cache = orm;
  return cache;
};
