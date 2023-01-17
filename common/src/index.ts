// Split the imports even though its more boiler plate
// to prevent needlessly passing the types in production
export { ExampleSchema } from "./types.js";
export type { Example } from "./types.js";

export {
  ThreadListSchema,
  JwtTokenSchema,
  WeaponListSchema,
} from "./serverResponse.js";
export type {
  ThreadListType,
  JwtTokenType,
  WeaponListType,
} from "./serverResponse.js";

export { LoginSchema } from "./clientRequest.js";
export type { LoginType } from "./clientRequest.js";

export {
  getThreadListAPI,
  postLoginAPI,
  getLoginStatusAPI,
  getWeaponListAPI,
} from "./api.js";

export {
  weaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  firearmWeaponTypeEnum,
  firearmModeEnum,
  damageCalculationMethodEnum,
  damageTypeEnum,
  restrictionEnum,
  damageAnnoationEnum,
  reloadMethodEnum,
} from "./enums.js";

export {
  AccuracySchema,
  AvailabilitySchema,
  DamageSchema,
  FirearmAmmoSchema,
} from "./schemas/weaponSchemas.js";
export type {
  AccuracyType,
  ArmourPenetrationType,
  AvailabilityType,
  CostType,
  DamageType,
  FirearmAmmoType,
  RecoilCompensationType,
} from "./schemas/weaponSchemas.js";
