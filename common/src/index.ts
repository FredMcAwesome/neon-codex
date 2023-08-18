// Split the imports even though its more boiler plate
// to prevent needlessly passing the types in production
export { ExampleSchema } from "./types.js";
export type { Example } from "./types.js";

export {
  ThreadListSchema,
  JwtTokenSchema,
  AugmentationListSchema,
  GearListSchema,
} from "./serverResponse.js";
export type {
  ThreadListType,
  JwtTokenType,
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
  gearTypeEnum,
  weaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  firearmWeaponTypeEnum,
  firearmModeEnum,
  damageCalculationOptionEnum,
  damageTypeEnum,
  restrictionEnum,
  damageAnnotationEnum as damageAnnoationEnum,
  ammoSourceEnum as reloadMethodEnum,
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
  costEnum,
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
  WeaponUnlinkedSummaryType as WeaponPreDBSummaryType,
  BlastType,
} from "./schemas/weaponSchemas.js";

export type {
  CyberdeckAttributeArrayType,
  MatrixType,
  MatrixAccessoryType,
} from "./schemas/electronicSchemas.js";

export type {
  AugmentationType,
  EssenceType,
} from "./schemas/augmentationSchemas.js";

export type { SkillType } from "./schemas/skillSchema.js";
