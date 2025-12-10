import { type } from "arktype";
import {
  firearmModeEnum,
  ammoSourceEnum,
  firearmWeaponTypeEnum,
  projectileWeaponTypeEnum,
  weaponCategoryEnum,
  weaponAccessoryMountLocationEnum,
  damageAnnotationEnum,
  damageTypeEnum,
} from "../../enums.js";

export const WeaponDamageRequirementsSchema = type({
  "+": "reject",
  type: type.valueOf(damageTypeEnum),
  "annotation?": type.valueOf(damageAnnotationEnum),
});
export type WeaponDamageRequirementsType =
  typeof WeaponDamageRequirementsSchema.infer;
export const RequirementsSchema = type({
  "+": "reject",
  "weaponNames?": "string[]",
  "minimumHostConcealment?": "number",
  "maximumHostConcealment?": "number",
  "skills?": "string[]",
  "accessories?": "string[]",
  "specialModificationLimit?": "number",
  "mode?": type.valueOf(firearmModeEnum),
  "ammunitionDetails?": type(
    type.or(
      type.valueOf(ammoSourceEnum),
      type.valueOf(firearmWeaponTypeEnum),
      type.valueOf(projectileWeaponTypeEnum)
    )
  ).array(),
  "categories?": type(
    type.or(
      type.unit(weaponCategoryEnum.Melee),
      type.valueOf(firearmWeaponTypeEnum),
      type.valueOf(projectileWeaponTypeEnum)
    )
  ).array(),
  "accessoryMounts?": type.valueOf(weaponAccessoryMountLocationEnum).array(),
  "requiredDamage?": WeaponDamageRequirementsSchema,
  "hostArmour?": "string",
  "requiredMod?": "string",
});
export type RequirementsType = typeof RequirementsSchema.infer;
