import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { DB_NAME, HOST, DATABASE_PORT, PASSWORD } from "./utils/config.js";
import { Users, Threads, Comments, Weapons } from "./models/models.js";
import {
  MeleeWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
} from "./models/gear/combatGear/weaponModel.js";
import {
  FirearmAccessories,
  WeaponAccessories,
} from "./models/gear/combatGear/weaponAccessoryModel.js";
import {
  Ammunitions,
  Ammos,
  Grenades,
  RocketsMissiles,
  ProjectilesAmmos,
} from "./models/gear/combatGear/ammunitionModel.js";
import { Armours } from "./models/gear/combatGear/armourModel.js";
import {
  ArmourAccessories,
  ArmourModifications,
} from "./models/gear/combatGear/armourAccessoryModel.js";
import {
  Commlinks,
  CommunicationCountermeasures,
  Cyberdecks,
  MatrixWares,
  RFIDTags,
  Skillsofts,
  Softwares,
} from "./models/gear/electronicsGear/matrixWareModel.js";
import {
  AudioDevices,
  AudioEnhancements,
  BreakingAndEnteringDevices,
  CredSticks,
  Identifications,
  MatrixWareAccessories,
  OpticalDevices,
  SecurityDevices,
  Sensors,
  Tools,
  VisionEnhancements,
} from "./models/gear/electronicsGear/matrixWareAccessoryModel.js";

const dbOptions: Options<PostgreSqlDriver> = {
  entities: [
    Users,
    Threads,
    Comments,
    Weapons,
    MeleeWeapons,
    ProjectileWeapons,
    FirearmWeapons,
    Explosives,
    WeaponAccessories,
    FirearmAccessories,
    Ammunitions,
    Ammos,
    ProjectilesAmmos,
    Grenades,
    RocketsMissiles,
    Armours,
    ArmourAccessories,
    ArmourModifications,
    MatrixWares,
    Commlinks,
    Cyberdecks,
    RFIDTags,
    CommunicationCountermeasures,
    Softwares,
    Skillsofts,
    MatrixWareAccessories,
    CredSticks,
    Identifications,
    Tools,
    OpticalDevices,
    VisionEnhancements,
    AudioDevices,
    AudioEnhancements,
    Sensors,
    SecurityDevices,
    BreakingAndEnteringDevices,
  ],
  type: "postgresql",
  host: HOST,
  port: DATABASE_PORT,
  dbName: DB_NAME,
  password: PASSWORD,
};

export default dbOptions;
