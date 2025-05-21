import { z as zod } from "zod";
import {
  damageCalculationOptionEnum,
  mathOperatorEnum,
  damageTypeEnum,
  damageAnnotationEnum,
  blastTypeEnum,
  weaponAccessoryMountLocationEnum,
  ammoSourceEnum,
} from "../../enums.js";

export const BlastSchema = zod
  .object({
    type: zod.nativeEnum(blastTypeEnum),
    value: zod.number(),
  })
  .strict();
export type BlastType = zod.infer<typeof BlastSchema>;

// damage is a recursive type
export const DamageSubnumberSchema = zod.union([
  zod.number(),
  zod.object({ option: zod.nativeEnum(damageCalculationOptionEnum) }).strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);
export type DamageAmountType = Array<
  | zod.infer<typeof DamageSubnumberSchema>
  | {
      subnumbers: DamageAmountType;
    }
>;
export const DamageAmountSchema: zod.ZodType<DamageAmountType> = zod.array(
  zod.union([
    DamageSubnumberSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => DamageAmountSchema),
      })
      .strict(),
  ])
);

export const DamageSchema = zod.array(
  zod
    .object({
      damageAmount: DamageAmountSchema,
      type: zod.nativeEnum(damageTypeEnum),
      annotation: zod.optional(zod.nativeEnum(damageAnnotationEnum)),
      blast: zod.optional(BlastSchema),
      barrels: zod.optional(zod.number()),
    })
    .strict()
);
export type DamageType = zod.infer<typeof DamageSchema>;

export const WeaponBonusSchema = zod
  .object({
    ap: zod.optional(zod.number()),
    apReplace: zod.optional(zod.number()),
    damage: zod.optional(DamageSchema),
    damageReplace: zod.optional(zod.string()),
    damageType: zod.optional(zod.string()),
    modeReplace: zod.optional(zod.string()),
    useRange: zod.optional(zod.string()),
    accuracy: zod.optional(zod.number()),
    accuracyReplace: zod.optional(zod.number()),
    extraDiceIfSmartlinkEnabled: zod.optional(zod.number()),
  })
  .strict();
export type WeaponBonusType = zod.infer<typeof WeaponBonusSchema>;

export const MountSchema = zod.nativeEnum(weaponAccessoryMountLocationEnum);
export type MountType = zod.infer<typeof MountSchema>;
export const AccessoryMountSchema = zod.array(MountSchema);
export type AccessoryMountType = zod.infer<typeof AccessoryMountSchema>;

export const AmmunitionSingleSchema = zod
  .object({
    capacity: zod.optional(zod.number()),
    numberOfAmmunitionHolders: zod.optional(zod.number()),
    reloadMethod: zod.nativeEnum(ammoSourceEnum),
  })
  .strict();
export type AmmunitionSingleType = zod.infer<typeof AmmunitionSingleSchema>;
export const AmmunitionSchema = zod.array(AmmunitionSingleSchema);
export type AmmunitionType = zod.infer<typeof AmmunitionSchema>;
