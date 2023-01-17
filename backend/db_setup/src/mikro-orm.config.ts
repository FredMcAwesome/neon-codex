import dbOptions from "../../src/mikro-orm.config.js";
dbOptions.seeder = {
  path: "./seeders", // path to the folder with seeders
  pathTs: undefined, // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
  defaultSeeder: "DatabaseTestSeeder", // default seeder class name
  glob: "!(*.d).{js,ts}", // how to match seeder files (all .js and .ts files, but not .d.ts)
  emit: "ts", // seeder generation mode
  fileName: (className: string) => className, // seeder file naming convention
};
export default dbOptions;
