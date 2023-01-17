import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { DB_NAME, HOST, DATABASE_PORT, PASSWORD } from "./utils/config.js";
import { Users, Threads, Comments, Weapons } from "./models/models.js";
import {
  MeleeWeapons,
  ProjectileWeapons,
  FirearmWeapons,
} from "./models/gear/weaponModel.js";

const dbOptions: Options<PostgreSqlDriver> = {
  entities: [
    Users,
    Threads,
    Comments,
    Weapons,
    MeleeWeapons,
    ProjectileWeapons,
    FirearmWeapons,
  ],
  type: "postgresql",
  host: HOST,
  port: DATABASE_PORT,
  dbName: DB_NAME,
  password: PASSWORD,
};

export default dbOptions;
