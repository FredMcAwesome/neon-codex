import {
  bonusSourceEnum,
  explosiveTypeEnum,
  firearmWeaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  spellPowerRangeEnum,
  spellPowerTargetEnum,
  weaponCategoryEnum,
  weaponExtraClassificationEnum,
} from "../../enums.js";
import {
  availabilityEnum,
  mathOperatorEnum,
  ratingAugmentationEnum,
} from "../../enums.js";
import { type } from "arktype";

export const GearCalculation = type(
  type.or(
    "number",
    type({
      "+": "reject",
      option: type.enumerated(
        "Rating",
        "Weapon",
        "Chemical",
        "Sensor",
        "Capacity",
        "Force"
      ),
    }),
    type({
      "+": "reject",
      operator: type.valueOf(mathOperatorEnum),
    })
  )
).array();

export type GearCalculationType = typeof GearCalculation.infer;

export const BaseOrSpecialSchema = type.or("number", "'Calculation'");

// availability rating is a recursive type
export const AvailabilityRatingSubnumberSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: type.valueOf(availabilityEnum),
  }),
  type({ operator: type.valueOf(mathOperatorEnum) })
);

export const { AvailabilityRatingSchema } = type.module({
  AvailabilityRatingSchema: [
    [
      AvailabilityRatingSubnumberSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "AvailabilityRatingSchema",
      },
    ],
    "[]",
  ],
});
export type AvailabilityRatingType = typeof AvailabilityRatingSchema.infer;

const AbilityRatingCalculationSchema = type(
  type.or(
    "number",
    type({
      "+": "reject",
      option: type.valueOf(ratingAugmentationEnum),
    }),
    type({
      "+": "reject",
      operator: type.valueOf(mathOperatorEnum),
    })
  )
).array();

export const ValueRangeSchema = type.or(
  type({
    "+": "reject",
    "minimum?": AbilityRatingCalculationSchema,
    "maximum?": AbilityRatingCalculationSchema,
  }),
  type({
    "+": "reject",
    base: BaseOrSpecialSchema,
    specialCalculation: GearCalculation,
  })
);
export const RatingSchema = ValueRangeSchema;
export type RatingType = typeof RatingSchema.infer;

export const CapacitySchema = ValueRangeSchema;
export type CapacityType = typeof CapacitySchema.infer;

export const RangeCostSchema = type({
  "+": "reject",
  range: {
    min: "number",
    max: "number",
  },
});

export const DamageReductionArmourSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: type.valueOf(availabilityEnum),
  })
);
export type DamageReductionArmourType =
  typeof DamageReductionArmourSchema.infer;

// export type EssenceType = typeof EssenceSchema.infer;
// Essence Cost is a recursive type
export const EssenceSubnumberSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: "'Rating'",
  }),
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  })
);

export const { EssenceCostRecursiveSchema } = type.module({
  EssenceCostRecursiveSchema: [
    [
      EssenceSubnumberSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "EssenceCostRecursiveSchema",
      },
    ],
    "[]",
  ],
});

export const EssenceCostSchema = type.or(
  type({
    "+": "reject",
    ratingLinked: EssenceCostRecursiveSchema.array(),
  }),
  EssenceCostRecursiveSchema
);

export type EssenceCostType = typeof EssenceCostSchema.infer;

export const AttributeRangeSchema = type({
  "+": "reject",
  min: "number",
  max: "number",
  augmentedMax: "number",
});
export type AttributeRangeType = typeof AttributeRangeSchema.infer;

const MovementEnvironmentSchema = type({
  "+": "reject",
  ground: "number",
  water: "number",
  air: "number",
});
export const MovementStrideSchema = type({
  "+": "reject",
  walk: MovementEnvironmentSchema,
  run: MovementEnvironmentSchema,
  sprint: MovementEnvironmentSchema,
});
export type MovementStrideType = typeof MovementStrideSchema.infer;

const CharacterCreatorBonusSchema = type({
  "+": "reject",
  source: "string",
  "linkMentorSpirit?": "true",
  "linkParagon?": "true",
  sourceType: type.valueOf(bonusSourceEnum),
});
export type CharacterCreatorBonusType =
  typeof CharacterCreatorBonusSchema.infer;
export const CharacterCreatorBonusListSchema = type(
  CharacterCreatorBonusSchema
).array();
export type CharacterCreatorBonusListType =
  typeof CharacterCreatorBonusListSchema.infer;

export const spellRangeSchema = type({
  "+": "reject",
  value: type.valueOf(spellPowerRangeEnum),
  target: type.valueOf(spellPowerTargetEnum),
});
export type spellRangeType = typeof spellRangeSchema.infer;

export const AmmoForWeaponTypeSchema = type.or(
  type({
    "+": "reject",
    category: type.unit(weaponCategoryEnum.Projectile),
    subtype: type.valueOf(projectileWeaponTypeEnum),
  }),
  type({
    "+": "reject",
    category: type.unit(weaponCategoryEnum.Firearm),
    subtype: type.valueOf(firearmWeaponTypeEnum),
  }),
  type({
    "+": "reject",
    "extraClassification?": type.valueOf(weaponExtraClassificationEnum),
  })
);
export type AmmoForWeaponTypeType = typeof AmmoForWeaponTypeSchema.infer;

export const MeleeWeaponClassificationSchema = type({
  "+": "reject",
  category: type.unit(weaponCategoryEnum.Melee),
  subtype: type.valueOf(meleeWeaponTypeEnum),
});
export const ProjectileWeaponClassificationSchema = type({
  "+": "reject",
  category: type.unit(weaponCategoryEnum.Projectile),
  subtype: type.valueOf(projectileWeaponTypeEnum),
  "extraClassification?": type.valueOf(weaponExtraClassificationEnum),
});
export const FirearmWeaponClassificationSchema = type({
  "+": "reject",
  category: type.unit(weaponCategoryEnum.Firearm),
  subtype: type.valueOf(firearmWeaponTypeEnum),
  "extraClassification?": type.valueOf(weaponExtraClassificationEnum),
});
export const ExplosiveWeaponClassificationSchema = type({
  "+": "reject",
  category: type.unit(weaponCategoryEnum.Explosive),
  subtype: type.valueOf(explosiveTypeEnum),
});
export const WeaponClassificationSchema = type.or(
  MeleeWeaponClassificationSchema,
  ProjectileWeaponClassificationSchema,
  FirearmWeaponClassificationSchema,
  ExplosiveWeaponClassificationSchema
);
export type WeaponClassificationType = typeof WeaponClassificationSchema.infer;
