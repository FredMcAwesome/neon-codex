// Split the imports even though its more boiler plate
// to prevent needlessly passing the types in production
export { ExampleSchema } from "./types.js";
export type { Example } from "./types.js";

export {
  ThreadListSchema,
  JwtTokenSchema,
  WeaponListSchema,
  AugmentationListSchema,
  GearListSchema,
} from "./serverResponse.js";
export type {
  ThreadListType,
  JwtTokenType,
  WeaponListType,
  OtherGearListType,
  AugmentationListType,
  GearListType,
} from "./serverResponse.js";

export { LoginSchema } from "./clientRequest.js";
export type { LoginType } from "./clientRequest.js";

export {
  getThreadListAPI,
  postLoginAPI,
  getLoginStatusAPI,
  getWeaponListAPI,
  getGearListAPI,
} from "./api.js";

export {
  skillsEnum,
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
  firearmAccessoryMountLocationEnum,
  ammunitionTypeEnum,
  mathOperatorEnum,
  blastTypeEnum,
  explosiveTypeEnum,
  weaponAccessoryTypeEnum,
  armourAccessoryTypeEnum,
  matrixWareTypeEnum,
  matrixWareAccessoryTypeEnum,
  otherWareTypeEnum,
  augmentationTypeEnum,
  augmentationAccessoryTypeEnum,
  magicalGearTypeEnum,
  focusTypeEnum,
  spellCategoryEnum,
  formulaTypeEnum,
  vehicleDroneTypeEnum,
  groundcraftSubtypeEnum,
  watercraftSubtypeEnum,
  aircraftSubtypeEnum,
  droneSubtypeEnum,
} from "./enums.js";

export type {
  RatingType,
  AvailabilityType,
  CostType,
  CapacityType,
} from "./schemas/commonSchema.js";
export { AvailabilitySchema } from "./schemas/commonSchema.js";

export {
  AccuracySchema,
  DamageSchema,
  FirearmAmmoSchema,
  BlastSchema,
} from "./schemas/weaponSchemas.js";
export type {
  AccuracyType,
  ArmourPenetrationType,
  DamageType,
  FirearmAmmoType,
  RecoilCompensationType,
  WeaponSummaryType,
  BlastType,
} from "./schemas/weaponSchemas.js";

export type {
  CyberdeckAttributeArrayType,
  MatrixType,
} from "./schemas/electronicSchemas.js";

export type { EssenceType } from "./schemas/augmentationSchemas.js";
