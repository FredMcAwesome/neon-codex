import type { Options } from "@mikro-orm/postgresql";
import {
  ActiveWeaponAccessories,
  IncludedWeaponAccessories,
  CustomisedWeaponAccessories,
} from "./models/chummerdb/customTables/activeWeaponAccessoryModel.js";
import { CustomisedWeapons } from "./models/chummerdb/customTables/customisedWeaponModel.js";
import { WeaponRangeLinks } from "./models/chummerdb/customTables/weaponRangeLinkModel.js";
import { Skills } from "./models/chummerdb/skillModel.js";
import {
  AugmentationAccessories,
  CyberlimbAccessories,
  ImplantWeapons,
} from "./models/gear/augmentationGear/augmentationAccessoryModel.js";
import {
  Augmentations,
  Cyberwares,
  Biowares,
} from "./models/gear/augmentationGear/augmentationModel.js";
import {
  Ammunitions,
  Ammos,
  ProjectilesAmmos,
  GrenadesTorpedoes,
  RocketsMissiles,
} from "./models/gear/combatGear/ammunitionModel.js";
import { ArmourModifications } from "./models/gear/combatGear/armourModificationModel.js";
import { Armours } from "./models/gear/combatGear/armourModel.js";
import { WeaponRanges } from "./models/gear/combatGear/helperTables/weaponRangeModel.js";
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
import { Comments, Weapons, RangedWeapons } from "./models/models.js";
import Threads from "./models/threadModel.js";
import Users from "./models/userModel.js";
import {
  DB_NAME,
  HOST,
  DATABASE_PORT,
  PASSWORD,
} from "./utils/databaseConfig.js";
import { Spells } from "./models/abilities/spellModel.js";

const dbOptions: Options = {
  entities: [
    Users,
    Threads,
    Comments,
    Skills,

    Weapons,
    MeleeWeapons,
    RangedWeapons,
    ProjectileWeapons,
    FirearmWeapons,
    Explosives,
    WeaponAccessories,
    Ammunitions,
    Ammos,
    ProjectilesAmmos,
    GrenadesTorpedoes,
    RocketsMissiles,

    CustomisedWeapons,
    ActiveWeaponAccessories,
    IncludedWeaponAccessories,
    CustomisedWeaponAccessories,

    WeaponRanges,
    WeaponRangeLinks,

    Spells,

    Armours,
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
    Biowares,
    Cyberwares,
    AugmentationAccessories,
    CyberlimbAccessories,
    ImplantWeapons,
    VehiclesAndDrones,
    Groundcrafts,
    Watercrafts,
    Aircrafts,
    Drones,
  ],
  host: HOST,
  port: DATABASE_PORT,
  dbName: DB_NAME,
  password: PASSWORD,
  forceUndefined: true,
};

export default dbOptions;
