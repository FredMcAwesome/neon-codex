import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { DB_NAME, HOST, DATABASE_PORT, PASSWORD } from "./utils/config.js";
import { Users, Threads, Comments, Weapons } from "./models/models.js";
import {
  MeleeWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
} from "./models/gear/weaponModel.js";
import {
  FirearmAccessories,
  WeaponAccessories,
} from "./models/gear/weaponAccessoryModel.js";
import {
  Ammunitions,
  Ammos,
  Grenades,
  RocketsMissiles,
  ProjectilesAmmos,
} from "./models/gear/ammunitionModel.js";
import { Armours } from "./models/gear/armourModel.js";
import {
  ArmourAccessories,
  ArmourModifications,
} from "./models/gear/armourAccessoryModel.js";

const dbOptions: Options<PostgreSqlDriver> = {
  entities: [
    Users,
    Threads,
    Comments,
    Weapons,
    MeleeWeapons,
    ProjectileWeapons,
    FirearmWeapons,
    WeaponAccessories,
    FirearmAccessories,
    Ammunitions,
    Ammos,
    Grenades,
    RocketsMissiles,
    ProjectilesAmmos,
    Explosives,
    Armours,
    ArmourAccessories,
    ArmourModifications,
  ],
  type: "postgresql",
  host: HOST,
  port: DATABASE_PORT,
  dbName: DB_NAME,
  password: PASSWORD,
};

export default dbOptions;
