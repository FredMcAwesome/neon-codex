import { z as zod } from "zod";
import {
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
} from "../../../enums.js";
import { CustomisedWeaponSchema } from "../combat/weaponSchemas.js";

export const CustomisedWeaponMountSchema = zod
  .object({
    control: zod.nativeEnum(weaponMountControlEnum),
    flexibility: zod.nativeEnum(weaponMountFlexibilityEnum),
    size: zod.nativeEnum(weaponMountSizeEnum),
    visibility: zod.nativeEnum(weaponMountVisibilityEnum),
    weaponMounted: zod.optional(CustomisedWeaponSchema),
    weaponExchangeable: zod.boolean(),
    weaponMountModList: zod.optional(zod.array(zod.string())),
  })
  .strict();
export type CustomisedWeaponMountType = zod.infer<
  typeof CustomisedWeaponMountSchema
>;
export const CustomisedWeaponMountListSchema = zod.array(
  CustomisedWeaponMountSchema
);
export type CustomisedWeaponMountListType = zod.infer<
  typeof CustomisedWeaponMountListSchema
>;
