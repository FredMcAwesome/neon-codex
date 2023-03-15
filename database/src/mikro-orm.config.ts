import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import {
  ActiveWeaponAccessories,
  IncludedWeaponAccessories,
  CustomisedWeaponAccessories,
} from "./models/chummerdb/customTables/activeWeaponAccessoryModel.js";
import { CustomisedWeapons } from "./models/chummerdb/customTables/customisedWeaponModel.js";
import { Skills } from "./models/chummerdb/skillModel.js";
import {
  AugmentationAccessories,
  CyberlimbAccessories,
  ImplantWeapons,
} from "./models/gear/augmentationGear/augmentationAccessoryModel.js";
import {
  Augmentations,
  Headwares,
  Eyewares,
  Earwares,
  Bodywares,
  Cyberlimbs,
  Biowares,
  CulturedBiowares,
} from "./models/gear/augmentationGear/augmentationModel.js";
import {
  Ammunitions,
  Ammos,
  ProjectilesAmmos,
  Grenades,
  RocketsMissiles,
} from "./models/gear/combatGear/ammunitionModel.js";
import {
  ArmourAccessories,
  ArmourModifications,
} from "./models/gear/combatGear/armourAccessoryModel.js";
import { Armours } from "./models/gear/combatGear/armourModel.js";
import { WeaponAccessories } from "./models/gear/combatGear/weaponAccessoryModel.js";
import {
  MeleeWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
} from "./models/gear/combatGear/weaponModel.js";
import {
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
} from "./models/gear/electronicsGear/matrixWareAccessoryModel.js";
import {
  MatrixWares,
  Commlinks,
  Cyberdecks,
  RFIDTags,
  CommunicationCountermeasures,
  Softwares,
  Skillsofts,
} from "./models/gear/electronicsGear/matrixWareModel.js";
import {
  MagicalEquipment,
  Foci,
  Formulae,
  MagicalSupplies,
} from "./models/gear/magicGear/magicalGearEquipment.js";
import {
  OtherWares,
  IndustrialChemicals,
  SurvivalGear,
  GrappleGun,
  Biotech,
  DocWagonContract,
  SlapPatches,
} from "./models/gear/otherGear/otherWareModel.js";
import {
  VehiclesAndDrones,
  Groundcrafts,
  Watercrafts,
  Aircrafts,
  Drones,
} from "./models/gear/riggerGear/vehicleAndDroneModel.js";
import { Comments, Weapons } from "./models/models.js";
import Threads from "./models/threadModel.js";
import Users from "./models/userModel.js";
import {
  DB_NAME,
  HOST,
  DATABASE_PORT,
  PASSWORD,
} from "./utils/databaseConfig.js";

const dbOptions: Options<PostgreSqlDriver> = {
  entities: [
    Users,
    Threads,
    Comments,
    Weapons,
    Skills,
    MeleeWeapons,
    ProjectileWeapons,
    FirearmWeapons,
    Explosives,
    WeaponAccessories,
    Ammunitions,
    Ammos,
    ProjectilesAmmos,
    Grenades,
    RocketsMissiles,

    CustomisedWeapons,
    ActiveWeaponAccessories,
    IncludedWeaponAccessories,
    CustomisedWeaponAccessories,

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
    OtherWares,
    IndustrialChemicals,
    SurvivalGear,
    GrappleGun,
    Biotech,
    DocWagonContract,
    SlapPatches,
    Augmentations,
    Headwares,
    Eyewares,
    Earwares,
    Bodywares,
    Cyberlimbs,
    Biowares,
    CulturedBiowares,
    AugmentationAccessories,
    CyberlimbAccessories,
    ImplantWeapons,
    MagicalEquipment,
    Foci,
    Formulae,
    MagicalSupplies,
    VehiclesAndDrones,
    Groundcrafts,
    Watercrafts,
    Aircrafts,
    Drones,
  ],
  type: "postgresql",
  host: HOST,
  port: DATABASE_PORT,
  dbName: DB_NAME,
  password: PASSWORD,
  forceUndefined: true,
};

export default dbOptions;
