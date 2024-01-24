import { MikroORM } from "@mikro-orm/postgresql";
import MikroORMConfig from "./mikro-orm.config.js";

const orm = await MikroORM.init(MikroORMConfig);
const generator = orm.getSchemaGenerator();
// const dropDump = await generator.getDropSchemaSQL();
// console.log(dropDump);
const createDump = await generator.getCreateSchemaSQL();
console.log(createDump);
// const updateDump = await generator.getUpdateSchemaSQL();
// console.log(updateDump);

// run queries directly, but be sure to check the above first to ensure format is correct
await generator.dropSchema();
await generator.createSchema();
// await generator.updateSchema();

await orm.close(true);
