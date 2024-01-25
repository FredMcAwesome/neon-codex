import type { Options } from "@mikro-orm/postgresql";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import Users from "./models/accounts/userModel.js";
import Comments from "./models/forum/commentModel.js";
import Threads from "./models/forum/threadModel.js";
import { Skills } from "./models/rpg/abilities/skillModel.js";
import { Spells } from "./models/rpg/abilities/spellModel.js";
import {
  ActiveArmourModifications,
  IncludedArmourModifications,
  CustomisedArmourModifications,
} from "./models/rpg/activeTables/activeArmourModificationModel.js";
import {
  ActiveGears,
  WeaponAccessoryIncludedGears,
  ActiveWeaponAccessoryGears,
  ArmourIncludedGears,
  ArmourModificationIncludedGears,
  AugmentationIncludedGears,
  VehicleIncludedGears,
  GearIncludedGears,
} from "./models/rpg/activeTables/activeGearModel.js";
import {
  ActiveVehicleModifications,
  IncludedVehicleModifications,
  CustomisedVehicleModifications,
} from "./models/rpg/activeTables/activeVehicleModificationModel.js";
import {
  ActiveWeaponAccessories,
  IncludedWeaponAccessories,
  CustomisedWeaponAccessories,
} from "./models/rpg/activeTables/activeWeaponAccessoryModel.js";
import {
  ActiveWeaponMounts,
  IncludedWeaponMounts,
  CustomisedWeaponMounts,
} from "./models/rpg/activeTables/activeWeaponMountModel.js";
import { CustomisedArmours } from "./models/rpg/activeTables/customisedArmourModel.js";
import { CustomisedSkills } from "./models/rpg/activeTables/customisedSkillModel.js";
import { CustomisedVehicles } from "./models/rpg/activeTables/customisedVehicleModel.js";
import { CustomisedWeapons } from "./models/rpg/activeTables/customisedWeaponModel.js";
import {
  Augmentations,
  Biowares,
  Cyberwares,
} from "./models/rpg/gear/augmentationGear/augmentationModel.js";
import { Armours } from "./models/rpg/gear/combatGear/armourModel.js";
import { ArmourModifications } from "./models/rpg/gear/combatGear/armourModificationModel.js";
import { WeaponRanges } from "./models/rpg/gear/combatGear/helperTables/weaponRangeModel.js";
import { WeaponAccessories } from "./models/rpg/gear/combatGear/weaponAccessoryModel.js";
import {
  Weapons,
  MeleeWeapons,
  RangedWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
} from "./models/rpg/gear/combatGear/weaponModel.js";
import { DrugComponents } from "./models/rpg/gear/otherGear/drugComponentModel.js";
import { Drugs } from "./models/rpg/gear/otherGear/drugModel.js";
import { Gears } from "./models/rpg/gear/otherGear/gearModel.js";
import {
  Vehicles,
  MannedVehicles,
  Groundcrafts,
  Watercrafts,
  Aircrafts,
  Drones,
} from "./models/rpg/gear/riggerGear/vehicleModel.js";
import {
  VehicleModifications,
  VehicleChasisModifications,
  WeaponMountModifications,
} from "./models/rpg/gear/riggerGear/vehicleModificationModel.js";
import { WeaponMounts } from "./models/rpg/gear/riggerGear/weaponMountModel.js";
import {
  HOST,
  DATABASE_PORT,
  DB_NAME,
  PASSWORD,
} from "./utils/databaseConfig.js";

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
  driver: PostgreSqlDriver,
};

export default dbOptions;
