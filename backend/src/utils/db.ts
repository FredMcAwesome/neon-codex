import { MikroORMConfig } from "@neon-codex/database";
import { MikroORM, type Options } from "@mikro-orm/postgresql";

let cache: MikroORM;

export const init = async function (options?: Options) {
  if (cache !== undefined && options === undefined) {
    return cache;
  }
  const orm = await MikroORM.init({
    ...MikroORMConfig,
    allowGlobalContext: true,
    ...options,
  });
  if (options === undefined) {
    cache = orm;
  }
  return orm;
};
