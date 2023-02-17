import { z as zod } from "zod";
import {
  damageAnnotationEnum,
  damageTypeEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  reloadMethodEnum,
  weaponTypeEnum,
  blastTypeEnum,
  explosiveTypeEnum,
  accuracyTypeEnum,
  mathOperatorEnum,
  damageCalculationOptionEnum,
  armourPenetrationEnum,
  standardCalculationEnum,
  gearCategoryEnum,
  firearmAccessoryMountLocationEnum,
} from "../enums.js";
import {
  AvailabilitySchema,
  CostSchema,
  RatingSchema,
} from "./commonSchema.js";

export const GenericCalculationSchema = zod.array(
  zod.union([
    zod.number(),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
    zod.object({ option: zod.nativeEnum(standardCalculationEnum) }),
  ])
);
export type GenericCalculationType = zod.infer<typeof GenericCalculationSchema>;

export const AccuracySchema = zod.array(
  zod.union([
    zod.number(),
    zod.object({ option: zod.nativeEnum(accuracyTypeEnum) }),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
  ])
);
export type AccuracyType = zod.infer<typeof AccuracySchema>;

export const BlastSchema = zod.object({
  type: zod.nativeEnum(blastTypeEnum),
  value: zod.number(),
});
export type BlastType = zod.infer<typeof BlastSchema>;

export const DamageSubnumberSchema = zod.array(
  zod.union([
    zod.number(),
    zod.object({ option: zod.nativeEnum(damageCalculationOptionEnum) }),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
  ])
);
export type DamageSubtypeType = zod.infer<typeof DamageSubnumberSchema>;

export const DamageAmountSchema = zod.array(
  zod.union([
    zod.number(),
    zod.object({ option: zod.nativeEnum(damageCalculationOptionEnum) }),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
    DamageSubnumberSchema,
  ])
);
export type DamageAmountType = zod.infer<typeof DamageAmountSchema>;
export const DamageSchema = zod.array(
  zod.object({
    damageAmount: DamageAmountSchema,
    type: zod.nativeEnum(damageTypeEnum),
    annotation: zod.optional(zod.nativeEnum(damageAnnotationEnum)),
    blast: zod.optional(BlastSchema),
  })
);
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

export const MeleeOptionsSchema = zod.object({
  reach: zod.optional(zod.number()),
});
export const FirearmOptionsSchema = zod.object({
  mode: zod.array(zod.nativeEnum(firearmModeEnum)),
  recoilCompensation: RecoilCompensationSchema,
  ammo: zod.array(FirearmAmmoSchema),
});

export const Mode = zod.array(
  zod.union([
    zod.object({ option: zod.nativeEnum(firearmModeEnum) }),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
    zod.number(),
  ])
);
export type ModeType = zod.infer<typeof Mode>;

export const ArmourPenetrationSchema = zod.array(
  zod.union([
    zod.object({ option: zod.nativeEnum(armourPenetrationEnum) }),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
    zod.number(),
  ])
);
export type ArmourPenetrationType = zod.infer<typeof ArmourPenetrationSchema>;

const typeInformation = zod.discriminatedUnion("type", [
  zod.object({
    type: zod.literal(weaponTypeEnum.Melee),
    meleeOptions: MeleeOptionsSchema,
  }),
  zod.object({ type: zod.literal(weaponTypeEnum.Projectile) }),
  zod.object({
    type: zod.literal(weaponTypeEnum.Firearm),
    firearmOptions: FirearmOptionsSchema,
  }),
  zod.object({ type: zod.literal(weaponTypeEnum.Explosive) }),
]);

export const WeaponSummarySchema = zod.object({
  name: zod.string(),
  typeInformation: typeInformation,
  subtype: zod.union([
    zod.nativeEnum(meleeWeaponTypeEnum),
    zod.nativeEnum(projectileWeaponTypeEnum),
    zod.nativeEnum(firearmWeaponTypeEnum),
    zod.nativeEnum(explosiveTypeEnum),
  ]),
  rating: zod.optional(RatingSchema),
  accuracy: AccuracySchema,
  damage: DamageSchema,
  armourPenetration: ArmourPenetrationSchema,
  availability: AvailabilitySchema,
  cost: CostSchema,
  description: zod.string(),
  wireless: zod.optional(zod.string()),
  relatedSkill: zod.string(),
});
export type WeaponSummaryType = zod.infer<typeof WeaponSummarySchema>;

const UseGearSchema = zod.object({
  name: zod.string(),
  category: zod.optional(zod.nativeEnum(gearCategoryEnum)),
  rating: zod.optional(zod.number()),
});

export const MountSchema = zod.nativeEnum(firearmAccessoryMountLocationEnum);
export type MountType = zod.infer<typeof MountSchema>;
const AccessorySchema = zod.object({
  name: zod.string(),
  mount: zod.optional(zod.array(MountSchema)),
  rating: zod.optional(zod.number()),
  gears: zod.optional(zod.array(UseGearSchema)),
});
export type AccessoryType = zod.infer<typeof AccessorySchema>;

export const AmmunitionSchema = zod.array(
  zod.object({
    capacity: zod.optional(zod.number()),
    numberOfAmmunitionHolders: zod.optional(zod.number()),
    reloadMethod: zod.nativeEnum(reloadMethodEnum),
  })
);
export type AmmunitionType = zod.infer<typeof AmmunitionSchema>;
