import { type } from "arktype";
import {
  damageCalculationOptionEnum,
  mathOperatorEnum,
  damageTypeEnum,
  damageAnnotationEnum,
  blastTypeEnum,
  weaponAccessoryMountLocationEnum,
  ammoSourceEnum,
  accuracyEnum,
  sourceBookEnum,
  armourPenetrationEnum,
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

export const AccuracySubnumberSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: type.valueOf(accuracyEnum),
  }),
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  })
);

export type AccuracyType = Array<
  | typeof AccuracySubnumberSchema.infer
  | {
      subnumbers: AccuracyType;
    }
>;
export const { AccuracySchema } = type.module({
  AccuracySchema: [
    [
      AccuracySubnumberSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "AccuracySchema",
      },
    ],
    "[]",
  ],
});

// outer array is different ap values, inner is calculation for one ap value
export const ArmourPenetrationSubnumberSchema = type.or(
  type({
    "+": "reject",
    option: type.valueOf(armourPenetrationEnum),
  }),
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  }),
  "number"
);
export type SingleArmourPenetrationType = Array<
  | typeof ArmourPenetrationSubnumberSchema.infer
  | {
      subnumbers: SingleArmourPenetrationType;
    }
>;
export const { SingleArmourPenetrationSchema } = type.module({
  SingleArmourPenetrationSchema: [
    [
      ArmourPenetrationSubnumberSchema,
      "|",
      {
        subnumbers: "SingleArmourPenetrationSchema",
      },
    ],
    "[]",
  ],
});
export const ArmourPenetrationSchema = type(
  SingleArmourPenetrationSchema.array()
);
export type ArmourPenetrationType = typeof ArmourPenetrationSchema.infer;

export const NaturalWeaponSchema = type({
  "+": "reject",
  name: "string",
  accuracy: AccuracySchema,
  damage: DamageSchema,
  armourPenetration: ArmourPenetrationSchema,
  reach: "number",
  relatedSkill: "string",
  "relatedSkillSpecialisationList?": "string[]",
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type NaturalWeaponType = typeof NaturalWeaponSchema.infer;
