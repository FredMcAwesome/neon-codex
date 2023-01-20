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
  skillsEnum,
  weaponTypeEnum,
  mathOperatorEnum,
  blastTypeEnum,
  explosiveTypeEnum,
} from "../enums.js";

const GearCalculation = zod.optional(
  zod.array(
    zod.union([
      zod.number(),
      zod.enum(["Rating", "Weapon", "Chemical", "Sensor", "Capacity"]),
      zod.nativeEnum(mathOperatorEnum),
    ])
  )
);

const BaseOrSpecial = zod.union([zod.number(), zod.enum(["Calculation"])]);

export const AvailabilitySchema = zod.object({
  rating: BaseOrSpecial,
  specialCalculation: GearCalculation,
  restriction: zod.nativeEnum(restrictionEnum),
});
export type AvailabilityType = zod.infer<typeof AvailabilitySchema>;

export const ValueRangeSchema = zod.union([
  zod.object({
    minimum: zod.number(),
    maximum: zod.number(),
  }),
  zod.object({
    base: BaseOrSpecial,
    specialCalculation: GearCalculation,
  }),
]);
export const RatingSchema = ValueRangeSchema;
export type RatingType = zod.infer<typeof RatingSchema>;

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
  base: BaseOrSpecial,
  specialCalculation: GearCalculation,
});
export type ArmourPenetrationType = zod.infer<typeof ArmourPenetrationSchema>;

export const CostSchema = zod.object({
  base: BaseOrSpecial,
  specialCalculation: GearCalculation,
});
export type CostType = zod.infer<typeof CostSchema>;

export const WeaponSummarySchema = zod.object({
  type: zod.nativeEnum(weaponTypeEnum),
  subtype: zod.union([
    zod.nativeEnum(meleeWeaponTypeEnum),
    zod.nativeEnum(projectileWeaponTypeEnum),
    zod.nativeEnum(firearmWeaponTypeEnum),
    zod.nativeEnum(explosiveTypeEnum),
  ]),
  name: zod.string(),
  accuracy: AccuracySchema,
  damage: DamageSchema,
  armourPenetration: ArmourPenetrationSchema,
  availability: AvailabilitySchema,
  rating: zod.optional(RatingSchema),
  cost: CostSchema,
  meleeOptions: zod.optional(MeleeOptionsSchema),
  firearmOptions: zod.optional(FirearmOptionsSchema),
  description: zod.string(),
  wireless: zod.optional(zod.string()),
  relatedSkill: zod.nativeEnum(skillsEnum),
});

export const BlastSchema = zod.object({
  type: zod.nativeEnum(blastTypeEnum),
  value: zod.number(),
});
export type BlastType = zod.infer<typeof BlastSchema>;
