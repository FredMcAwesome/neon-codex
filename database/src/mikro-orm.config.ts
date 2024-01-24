import type { Options } from "@mikro-orm/postgresql";
import {
  ActiveWeaponAccessories,
  IncludedWeaponAccessories,
  CustomisedWeaponAccessories,
} from "./models/chummerdb/customTables/activeWeaponAccessoryModel.js";
import { CustomisedWeapons } from "./models/chummerdb/customTables/customisedWeaponModel.js";
import { Skills } from "./models/chummerdb/skillModel.js";
import {
  Augmentations,
  Cyberwares,
  Biowares,
} from "./models/gear/augmentationGear/augmentationModel.js";
import { ArmourModifications } from "./models/gear/combatGear/armourModificationModel.js";
import { Armours } from "./models/gear/combatGear/armourModel.js";
import { WeaponRanges } from "./models/gear/combatGear/helperTables/weaponRangeModel.js";
import { WeaponAccessories } from "./models/gear/combatGear/weaponAccessoryModel.js";
import {
  MeleeWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
  Weapons,
  RangedWeapons,
} from "./models/gear/combatGear/weaponModel.js";
import { Drugs } from "./models/gear/otherGear/drugModel.js";
import {
  Vehicles,
  Groundcrafts,
  Watercrafts,
  Aircrafts,
  Drones,
  MannedVehicles,
} from "./models/gear/riggerGear/vehicleModel.js";
import Threads from "./models/threadModel.js";
import Users from "./models/userModel.js";
import {
  DB_NAME,
  HOST,
  DATABASE_PORT,
  PASSWORD,
} from "./utils/databaseConfig.js";
import { Spells } from "./models/abilities/spellModel.js";
import { DrugComponents } from "./models/gear/otherGear/drugComponentModel.js";
import {
  VehicleChasisModifications,
  VehicleModifications,
  WeaponMountModifications,
} from "./models/gear/riggerGear/vehicleModificationModel.js";
import { Gears } from "./models/gear/otherGear/gearModel.js";
import Comments from "./models/commentModel.js";
import { CustomisedArmours } from "./models/chummerdb/customTables/customisedArmourModel.js";
import {
  ActiveArmourModifications,
  CustomisedArmourModifications,
  IncludedArmourModifications,
} from "./models/chummerdb/customTables/activeArmourModificationModel.js";
import { CustomisedSkills } from "./models/chummerdb/customTables/customisedSkillModel.js";
import { CustomisedVehicles } from "./models/chummerdb/customTables/customisedVehicleModel.js";
import {
  ActiveVehicleModifications,
  CustomisedVehicleModifications,
  IncludedVehicleModifications,
} from "./models/chummerdb/customTables/activeVehicleModificationModel.js";
import {
  ActiveGears,
  ActiveWeaponAccessoryGears,
  ArmourIncludedGears,
  ArmourModificationIncludedGears,
  AugmentationIncludedGears,
  GearIncludedGears,
  VehicleIncludedGears,
  WeaponAccessoryIncludedGears,
} from "./models/chummerdb/customTables/activeGearModel.js";
import {
  ActiveWeaponMounts,
  IncludedWeaponMounts,
  CustomisedWeaponMounts,
} from "./models/chummerdb/customTables/activeWeaponMountModel.js";
import { WeaponMounts } from "./models/gear/riggerGear/weaponMountModel.js";

const dbOptions: Options = {
  entities: [
    Users,
    Threads,
    Comments,

    Skills,

    CustomisedSkills,

    WeaponRanges,

    Weapons,
    MeleeWeapons,
    RangedWeapons,
    ProjectileWeapons,
    FirearmWeapons,
    Explosives,
    WeaponAccessories,

    CustomisedWeapons,
    ActiveWeaponAccessories,
    IncludedWeaponAccessories,
    CustomisedWeaponAccessories,

    Armours,
    ArmourModifications,

    CustomisedArmours,
    ActiveArmourModifications,
    IncludedArmourModifications,
    CustomisedArmourModifications,

    Drugs,
    DrugComponents,

    Augmentations,
    Biowares,
    Cyberwares,

    Vehicles,
    MannedVehicles,
    Groundcrafts,
    Watercrafts,
    Aircrafts,
    Drones,

    WeaponMounts,

    ActiveWeaponMounts,
    IncludedWeaponMounts,
    CustomisedWeaponMounts,

    VehicleModifications,
    VehicleChasisModifications,
    WeaponMountModifications,

    CustomisedVehicles,
    ActiveVehicleModifications,
    IncludedVehicleModifications,
    CustomisedVehicleModifications,

    Gears,

    ActiveGears,
    WeaponAccessoryIncludedGears,
    ActiveWeaponAccessoryGears,
    ArmourIncludedGears,
    ArmourModificationIncludedGears,
    AugmentationIncludedGears,
    VehicleIncludedGears,
    GearIncludedGears,

    Spells,
  ],
  host: HOST,
  port: DATABASE_PORT,
  dbName: DB_NAME,
  password: PASSWORD,
  forceUndefined: true,
};

export default dbOptions;
