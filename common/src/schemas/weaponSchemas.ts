import { z as zod } from "zod";
import {
  damageAnnoationEnum,
  damageCalculationMethodEnum,
  damageTypeEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  reloadMethodEnum,
  restrictionEnum,
  weaponTypeEnum,
} from "../enums.js";

export const AvailabilitySchema = zod.object({
  rating: zod.union([zod.number(), zod.enum(["Rating"])]),
  restriction: zod.nativeEnum(restrictionEnum),
});
export type AvailabilityType = zod.infer<typeof AvailabilitySchema>;

export const AccuracySchema = zod.object({
  base: zod.union([zod.number(), zod.enum(["Inherent"])]),
  equipment: zod.optional(zod.number()),
});
export type AccuracyType = zod.infer<typeof AccuracySchema>;

const DamageCalculationSchema = zod.object({
  calculationType: zod.nativeEnum(damageCalculationMethodEnum),
  base: zod.number(),
});

export const DamageSchema = zod.object({
  damageAmount: DamageCalculationSchema,
  type: zod.nativeEnum(damageTypeEnum),
  annotation: zod.optional(zod.nativeEnum(damageAnnoationEnum)),
});
export type DamageType = zod.infer<typeof DamageSchema>;

export const RecoilCompensationSchema = zod.object({
  base: zod.number(),
  equipment: zod.optional(zod.number()),
});
export type RecoilCompensationType = zod.infer<typeof RecoilCompensationSchema>;

export const FirearmAmmoSchema = zod.object({
  amount: zod.number(),
  reloadMethod: zod.nativeEnum(reloadMethodEnum),
});
export type FirearmAmmoType = zod.infer<typeof FirearmAmmoSchema>;

export const MeleeOptionsSchema = zod.object({ reach: zod.number() });
export const FirearmOptionsSchema = zod.object({
  mode: zod.array(zod.nativeEnum(firearmModeEnum)),
  recoilCompensation: RecoilCompensationSchema,
  ammo: zod.array(FirearmAmmoSchema),
});

export const ArmourPenetrationSchema = zod.object({
  base: zod.number(),
  special: zod.optional(zod.enum(["Rating"])),
});
export type ArmourPenetrationType = zod.infer<typeof ArmourPenetrationSchema>;

export const CostSchema = zod.object({
  base: zod.number(),
  modifier: zod.optional(zod.enum(["Rating"])),
});
export type CostType = zod.infer<typeof CostSchema>;

export const WeaponSummarySchema = zod.object({
  type: zod.nativeEnum(weaponTypeEnum),
  subtype: zod.union([
    zod.nativeEnum(meleeWeaponTypeEnum),
    zod.nativeEnum(projectileWeaponTypeEnum),
    zod.nativeEnum(firearmWeaponTypeEnum),
  ]),
  name: zod.string(),
  accuracy: AccuracySchema,
  damage: DamageSchema,
  armourPenetration: ArmourPenetrationSchema,
  availability: AvailabilitySchema,
  cost: CostSchema,
  meleeOptions: zod.optional(MeleeOptionsSchema),
  firearmOptions: zod.optional(FirearmOptionsSchema),
});
