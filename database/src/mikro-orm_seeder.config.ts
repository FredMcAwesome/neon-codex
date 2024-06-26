import { SeedManager } from "@mikro-orm/seeder";
import { defineConfig } from "@mikro-orm/postgresql";
import dbOptions from "./mikro-orm.config.js";
dbOptions.seeder = {
  path: "./build/seeders", // path to the folder with seeders
  pathTs: "./src/seeders", // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
  defaultSeeder: "SourcebookSeeder", // default seeder class name
  glob: "!(*.d).{js,ts}", // how to match seeder files (all .js and .ts files, but not .d.ts)
  emit: "ts", // seeder generation mode
  fileName: (className: string) => className, // seeder file naming convention
};
dbOptions.extensions = [SeedManager];
export default defineConfig(dbOptions);
