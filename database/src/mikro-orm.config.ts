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
} from "./models/rpg/equipment/bodyModification/augmentationModel.js";
import { Armours } from "./models/rpg/equipment/combat/armourModel.js";
import { ArmourModifications } from "./models/rpg/equipment/combat/armourModificationModel.js";
import { WeaponRanges } from "./models/rpg/equipment/combat/helperTables/weaponRangeModel.js";
import { WeaponAccessories } from "./models/rpg/equipment/combat/weaponAccessoryModel.js";
import {
  Weapons,
  MeleeWeapons,
  RangedWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
} from "./models/rpg/equipment/combat/weaponModel.js";
import { DrugComponents } from "./models/rpg/equipment/other/drugComponentModel.js";
import { Drugs } from "./models/rpg/equipment/other/drugModel.js";
import { Gears } from "./models/rpg/equipment/other/gearModel.js";
import {
  Vehicles,
  MannedVehicles,
  Groundcrafts,
  Watercrafts,
  Aircrafts,
  Drones,
} from "./models/rpg/equipment/rigger/vehicleModel.js";
import {
  VehicleModifications,
  VehicleChasisModifications,
  WeaponMountModifications,
} from "./models/rpg/equipment/rigger/vehicleModificationModel.js";
import { WeaponMounts } from "./models/rpg/equipment/rigger/weaponMountModel.js";
import {
  HOST,
  DATABASE_PORT,
  DB_NAME,
  PASSWORD,
} from "./utils/databaseConfig.js";
import { Characters } from "./models/rpg/characters/characterModel.js";
import { Qualities } from "./models/rpg/traits/qualityModel.js";
import {
  Metahumans,
  Metasapients,
  Metatypes,
  Metavariants,
  Shapeshifters,
} from "./models/rpg/traits/metatypeModel.js";
import { HeritagePriorityDetails } from "./models/rpg/otherData/heritagePriorityDetailModel.js";
import {
  Priorities,
  HeritagePriorities,
  TalentPriorities,
  AttributePriorities,
  SkillPriorities,
  ResourcePriorities,
} from "./models/rpg/otherData/priorityModel.js";
import {
  SkillBasePriorityDetails,
  SkillSpecificityPriorityDetails,
  SkillPriorityDetails,
  SkillSourcePriorityDetails,
  SkillGroupPriorityDetails,
} from "./models/rpg/otherData/skillPriorityDetailModel.js";
import {
  TalentPriorityDetails,
  MagicTalentPriorityDetails,
  ResonanceTalentPriorityDetails,
  DepthTalentPriorityDetails,
  MundaneTalentPriorityDetails,
} from "./models/rpg/otherData/talentPriorityDetailModel.js";
import { SkillGroups } from "./models/rpg/abilities/skillGroupModel.js";

const dbOptions: Options = {
  entities: [
    Users,
    Threads,
    Comments,

    Skills,
    SkillGroups,
    CustomisedSkills,
    Qualities,

    Metatypes,
    Metahumans,
    Metavariants,
    Metasapients,
    Shapeshifters,

    Priorities,
    HeritagePriorities,
    TalentPriorities,
    AttributePriorities,
    SkillPriorities,
    ResourcePriorities,

    HeritagePriorityDetails,
    TalentPriorityDetails,
    SkillBasePriorityDetails,
    SkillSpecificityPriorityDetails,
    SkillPriorityDetails,
    SkillSourcePriorityDetails,
    SkillGroupPriorityDetails,
    MagicTalentPriorityDetails,
    ResonanceTalentPriorityDetails,
    DepthTalentPriorityDetails,
    MundaneTalentPriorityDetails,

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

    Characters,
  ],
  host: HOST,
  port: DATABASE_PORT,
  dbName: DB_NAME,
  password: PASSWORD,
  forceUndefined: true,
  driver: PostgreSqlDriver,
};

export default dbOptions;
