import { MikroORM } from "@mikro-orm/core";
import { DB_NAME } from "../../src/utils/config.js";

(async () => {
  const orm = await MikroORM.init({
    discovery: {
      // we need to disable validation for no entities
      warnWhenNoEntities: false,
    },

    type: "postgresql",
    host: "localhost",
    port: 5432,
    dbName: DB_NAME,
    password: "postgres",
  });
  const generator = orm.getEntityGenerator();
  const dump = await generator.generate({
    save: true,
    baseDir: process.cwd() + "/my-entities",
  });
  console.log(dump);
  await orm.close(true);
})();
