import { MikroORM } from "@mikro-orm/postgresql";
import { DB_NAME, PASSWORD } from "./utils/databaseConfig.js";

(async () => {
  const orm = await MikroORM.init({
    discovery: {
      // we need to disable validation for no entities
      warnWhenNoEntities: false,
    },
    host: "localhost",
    port: 5432,
    dbName: DB_NAME,
    password: PASSWORD,
  });
  const generator = orm.getEntityGenerator();
  const dump = await generator.generate({
    save: true,
  });
  console.log(dump);
  await orm.close(true);
})();
