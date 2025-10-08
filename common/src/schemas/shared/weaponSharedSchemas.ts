import { type } from "arktype";
import {
  damageCalculationOptionEnum,
  mathOperatorEnum,
  damageTypeEnum,
  damageAnnotationEnum,
  blastTypeEnum,
  weaponAccessoryMountLocationEnum,
  ammoSourceEnum,
} from "../../enums.js";

export const BlastSchema = type({
  "+": "reject",
  type: type.valueOf(blastTypeEnum),
  value: "number",
});
export type BlastType = typeof BlastSchema.infer;

// damage is a recursive type
export const DamageSubnumberSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: type.valueOf(damageCalculationOptionEnum),
  }),
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  })
);
export type DamageAmountType = Array<
  | typeof DamageSubnumberSchema.infer
  | {
      subnumbers: DamageAmountType;
    }
>;
export const { DamageAmountSchema } = type.module({
  DamageAmountSchema: [
    [
      DamageSubnumberSchema,
      "|",
      {
        subnumbers: "DamageAmountSchema",
      },
    ],
    "[]",
  ],
});

export const DamageSchema = type({
  "+": "reject",
  damageAmount: DamageAmountSchema,
  type: type.valueOf(damageTypeEnum),
  "annotation?": type.valueOf(damageAnnotationEnum),
  "blast?": BlastSchema,
  "barrels?": "number",
}).array();
export type DamageType = typeof DamageSchema.infer;

export const WeaponBonusSchema = type({
  "+": "reject",
  "ap?": "number",
  "apReplace?": "number",
  "damage?": DamageSchema,
  "damageReplace?": "string",
  "damageType?": "string",
  "modeReplace?": "string",
  "useRange?": "string",
  "accuracy?": "number",
  "accuracyReplace?": "number",
  "extraDiceIfSmartlinkEnabled?": "number",
});
export type WeaponBonusType = typeof WeaponBonusSchema.infer;

export const MountSchema = type.valueOf(weaponAccessoryMountLocationEnum);
export type MountType = typeof MountSchema.infer;
export const AccessoryMountSchema = type(MountSchema.array());
export type AccessoryMountType = typeof AccessoryMountSchema.infer;

export const AmmunitionSingleSchema = type({
  "+": "reject",
  "capacity?": "number",
  "numberOfAmmunitionHolders?": "number",
  reloadMethod: type.valueOf(ammoSourceEnum),
});
export type AmmunitionSingleType = typeof AmmunitionSingleSchema.infer;
export const AmmunitionSchema = type(AmmunitionSingleSchema.array());
export type AmmunitionType = typeof AmmunitionSchema.infer;
