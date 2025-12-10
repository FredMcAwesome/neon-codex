import { type } from "arktype";
import {
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
} from "../../../enums.js";
import {
  CustomisedWeaponSchema,
  CustomisedWeaponLoadedSchema,
} from "../combat/weaponSchemas.js";

export const CustomisedWeaponMountSchema = type({
  "+": "reject",
  control: type.valueOf(weaponMountControlEnum),
  flexibility: type.valueOf(weaponMountFlexibilityEnum),
  size: type.valueOf(weaponMountSizeEnum),
  visibility: type.valueOf(weaponMountVisibilityEnum),
  "weaponMounted?": CustomisedWeaponSchema,
  "weaponExchangeable?": "false",
  "weaponMountModList?": "string[]",
});
export type CustomisedWeaponMountType =
  typeof CustomisedWeaponMountSchema.infer;

export const CustomisedWeaponMountListSchema = type(
  CustomisedWeaponMountSchema.array()
);
export type CustomisedWeaponMountListType =
  typeof CustomisedWeaponMountListSchema.infer;

export const CustomisedWeaponMountLoadedSchema = type({
  "+": "reject",
  control: type.valueOf(weaponMountControlEnum),
  flexibility: type.valueOf(weaponMountFlexibilityEnum),
  size: type.valueOf(weaponMountSizeEnum),
  visibility: type.valueOf(weaponMountVisibilityEnum),
  "weaponMounted?": CustomisedWeaponLoadedSchema,
  "weaponExchangeable?": "false",
  "weaponMountModList?": "string[]",
});
export type CustomisedWeaponMountLoadedType =
  typeof CustomisedWeaponMountLoadedSchema.infer;

export const CustomisedWeaponMountLoadedListSchema = type(
  CustomisedWeaponMountLoadedSchema.array()
);
export type CustomisedWeaponMountLoadedListType =
  typeof CustomisedWeaponMountLoadedListSchema.infer;
