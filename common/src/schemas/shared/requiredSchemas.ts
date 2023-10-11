import { z as zod } from "zod";
import {
  firearmModeEnum,
  ammoSourceEnum,
  firearmWeaponTypeEnum,
  projectileWeaponTypeEnum,
  weaponTypeEnum,
  firearmAccessoryMountLocationEnum,
  damageAnnotationEnum,
  damageTypeEnum,
} from "../../enums.js";

export const WeaponDamageRequirementsSchema = zod
  .object({
    type: zod.nativeEnum(damageTypeEnum),
    annotation: zod.optional(zod.nativeEnum(damageAnnotationEnum)),
  })
  .strict();
export type WeaponDamageRequirementsType = zod.infer<
  typeof WeaponDamageRequirementsSchema
>;
export const RequirementsSchema = zod
  .object({
    weaponNames: zod.optional(zod.array(zod.string())),
    minimumHostConcealment: zod.optional(zod.number()),
    maximumHostConcealment: zod.optional(zod.number()),
    skills: zod.optional(zod.array(zod.string())),
    accessories: zod.optional(zod.array(zod.string())),
    specialModificationLimit: zod.optional(zod.number()),
    mode: zod.optional(zod.nativeEnum(firearmModeEnum)),
    ammunitionDetails: zod.optional(
      zod.array(
        zod.union([
          zod.nativeEnum(ammoSourceEnum),
          zod.nativeEnum(firearmWeaponTypeEnum),
          zod.nativeEnum(projectileWeaponTypeEnum),
        ])
      )
    ),
    categories: zod.optional(
      zod.array(
        zod.union([
          zod.literal(weaponTypeEnum.Melee),
          zod.nativeEnum(firearmWeaponTypeEnum),
          zod.nativeEnum(projectileWeaponTypeEnum),
        ])
      )
    ),
    accessoryMounts: zod.optional(
      zod.array(zod.nativeEnum(firearmAccessoryMountLocationEnum))
    ),
    requiredDamage: zod.optional(WeaponDamageRequirementsSchema),
    hostArmour: zod.optional(zod.string()),
    requiredMod: zod.optional(zod.string()),
  })
  .strict();
export type RequirementsType = zod.infer<typeof RequirementsSchema>;
