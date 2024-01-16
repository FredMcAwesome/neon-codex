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
import { DrugComponents } from "./models/gear/otherGear/drugComponentModel.js";
import {
  VehicleChasisMods,
  VehicleMods,
  WeaponMountMods,
} from "./models/gear/riggerGear/vehicleModificationModel.js";
import { Gears } from "./models/gear/otherGear/gearModel.js";

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

    CustomisedWeapons,
    ActiveWeaponAccessories,
    IncludedWeaponAccessories,
    CustomisedWeaponAccessories,

    WeaponRanges,
    WeaponRangeLinks,

    Armours,
    ArmourModifications,

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
    VehicleMods,
    VehicleChasisMods,
    WeaponMountMods,

    Gears,

    Spells,
  ],
  host: HOST,
  port: DATABASE_PORT,
  dbName: DB_NAME,
  password: PASSWORD,
  forceUndefined: true,
};

export default dbOptions;
