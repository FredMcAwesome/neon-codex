// Split the imports even though its more boiler plate
// to prevent needlessly passing the types in production
export { RatingLiteralSchema } from "./types.js";
export type { RatingLiteralType } from "./types.js";

export {
  ThreadListSchema,
  JwtTokenSchema,
  GearListSchema,
} from "./serverResponse.js";
export type {
  ThreadListType,
  JwtTokenType,
  OtherGearListType,
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
  damageAnnotationEnum,
  ammoSourceEnum as reloadMethodEnum,
  firearmAccessoryMountLocationEnum,
  ammunitionTypeEnum,
  mathOperatorEnum,
  blastTypeEnum,
  explosiveTypeEnum,
  weaponAccessoryTypeEnum,
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

export type { RatingType, CapacityType } from "./schemas/commonSchemas.js";

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

export type { SkillType } from "./schemas/skillSchemas.js";
