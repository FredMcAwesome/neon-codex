import { z as zod } from "zod";
import { bonusSourceEnum } from "../../enums.js";
import {
  availabilityEnum,
  gearCategoryEnum,
  mathOperatorEnum,
  ratingAugmentationEnum,
} from "../../enums.js";

export const GearCalculation = zod.array(
  zod.union([
    zod.number(),
    zod
      .object({
        option: zod.enum([
          "Rating",
          "Weapon",
          "Chemical",
          "Sensor",
          "Capacity",
          "Force",
        ]),
      })
      .strict(),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
  ])
);

export type GearCalculationType = zod.infer<typeof GearCalculation>;

export const BaseOrSpecialSchema = zod.union([
  zod.number(),
  zod.enum(["Calculation"]),
]);

// availability rating is a recursive type
export const AvailabilityRatingSubnumberSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(availabilityEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);
export type AvailabilityRatingType = Array<
  | zod.infer<typeof AvailabilityRatingSubnumberSchema>
  | {
      subnumbers: AvailabilityRatingType;
    }
>;
export const AvailabilityRatingSchema: zod.ZodType<AvailabilityRatingType> =
  zod.array(
    zod.union([
      AvailabilityRatingSubnumberSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => AvailabilityRatingSchema),
        })
        .strict(),
    ])
  );

const ratingCalculation = zod.array(
  zod.union([
    zod.number(),
    zod
      .object({
        option: zod.nativeEnum(ratingAugmentationEnum),
      })
      .strict(),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
  ])
);

export const ValueRangeSchema = zod.union([
  zod
    .object({
      minimum: zod.optional(ratingCalculation),
      maximum: zod.optional(ratingCalculation),
    })
    .strict(),
  zod
    .object({
      base: BaseOrSpecialSchema,
      specialCalculation: GearCalculation,
    })
    .strict(),
]);
export const RatingSchema = ValueRangeSchema;
export type RatingType = zod.infer<typeof RatingSchema>;

export const CapacitySchema = ValueRangeSchema;
export type CapacityType = zod.infer<typeof CapacitySchema>;

export enum weaponXmlSubtypeEnum {
  Blades = "Blades",
  Clubs = "Clubs",
  Gear = "Gear",
  ExoticMeleeWeapons = "Exotic Melee Weapons",
  ExoticRangedWeapons = "Exotic Ranged Weapons",
  Flamethrowers = "Flamethrowers",
  Cyberweapon = "Cyberweapon",
  Bows = "Bows",
  Crossbows = "Crossbows",
  Tasers = "Tasers",
  Holdouts = "Holdouts",
  LightPistols = "Light Pistols",
  HeavyPistols = "Heavy Pistols",
  MachinePistols = "Machine Pistols",
  SubmachineGuns = "Submachine Guns",
  AssaultRifles = "Assault Rifles",
  SportingRifles = "Sporting Rifles",
  Shotguns = "Shotguns",
  SniperRifles = "Sniper Rifles",
  LightMachineguns = "Light Machine Guns",
  MediumMachineguns = "Medium Machine Guns",
  HeavyMachineguns = "Heavy Machine Guns",
  AssaultCannons = "Assault Cannons",
  GrenadeLaunchers = "Grenade Launchers",
  MissileLaunchers = "Missile Launchers",
  ImprovisedWeapons = "Improvised Weapons",
  LaserWeapons = "Laser Weapons",
  Unarmed = "Unarmed",
  Quality = "Quality",
  UnderbarrelWeapons = "Underbarrel Weapons",
  BioWeapon = "Bio-Weapon",
  Carbines = "Carbines",
  Rifles = "Rifles",
  Pistol = "Pistol",
}

export const WeaponXmlSubtypeSchema = zod.nativeEnum(weaponXmlSubtypeEnum);
export type WeaponXmlSubtypeType = zod.infer<typeof WeaponXmlSubtypeSchema>;

export const IncludedGearSubSchema = zod
  .object({
    name: zod.string(),
    specificOption: zod.optional(zod.string()),
    rating: zod.optional(zod.number()),
    consumeCapacity: zod.optional(zod.literal(true)),
    quantity: zod.optional(zod.number()),
    category: zod.optional(zod.nativeEnum(gearCategoryEnum)),
  })
  .strict();
type IncludedGearSubType = zod.infer<typeof IncludedGearSubSchema>;

export type IncludedGearType = IncludedGearSubType & {
  innerGearList?: Array<IncludedGearType> | undefined;
};

const IncludedGearSchema: zod.ZodType<IncludedGearType> =
  IncludedGearSubSchema.extend({
    innerGearList: zod.optional(zod.lazy(() => zod.array(IncludedGearSchema))),
  }).strict();

export const IncludedGearListSchema = zod.array(IncludedGearSchema);
export type IncludedGearListType = zod.infer<typeof IncludedGearListSchema>;

export const RangeCostSchema = zod
  .object({
    range: zod
      .object({
        min: zod.number(),
        max: zod.number(),
      })
      .strict(),
  })
  .strict();

export const DamageReductionArmourSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(availabilityEnum),
    })
    .strict(),
]);
export type DamageReductionArmourType = zod.infer<
  typeof DamageReductionArmourSchema
>;

// export type EssenceType = zod.infer<typeof EssenceSchema>;
// Essence Cost is a recursive type
export const EssenceSubnumberSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.literal("Rating"),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

type EssenceRecursiveCostType = Array<
  | zod.infer<typeof EssenceSubnumberSchema>
  | {
      subnumbers: EssenceRecursiveCostType;
    }
>;
export const EssenceCostRecursiveSchema: zod.ZodType<EssenceRecursiveCostType> =
  zod.array(
    zod.union([
      EssenceSubnumberSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => EssenceCostRecursiveSchema),
        })
        .strict(),
    ])
  );

export const EssenceCostSchema = zod.union([
  zod
    .object({
      ratingLinked: zod.array(EssenceCostRecursiveSchema),
    })
    .strict(),
  EssenceCostRecursiveSchema,
]);

export type EssenceCostType = zod.infer<typeof EssenceCostSchema>;

export const AttributeRangeSchema = zod
  .object({
    min: zod.number(),
    max: zod.number(),
    augmentedMax: zod.number(),
  })
  .strict();
export type AttributeRangeType = zod.infer<typeof AttributeRangeSchema>;

const MovementEnvironmentSchema = zod
  .object({
    ground: zod.number(),
    water: zod.number(),
    air: zod.number(),
  })
  .strict();

export const MovementStrideSchema = zod
  .object({
    walk: MovementEnvironmentSchema,
    run: MovementEnvironmentSchema,
    sprint: MovementEnvironmentSchema,
  })
  .strict();
export type MovementStrideType = zod.infer<typeof MovementStrideSchema>;

const CharacterCreatorBonusSchema = zod
  .object({
    source: zod.string(),
    linkMentorSpirit: zod.optional(zod.literal(true)),
    linkParagon: zod.optional(zod.literal(true)),
    sourceType: zod.nativeEnum(bonusSourceEnum),
  })
  .strict();

export type CharacterCreatorBonusType = zod.infer<
  typeof CharacterCreatorBonusSchema
>;
export const CharacterCreatorBonusListSchema = zod.array(
  CharacterCreatorBonusSchema
);
export type CharacterCreatorBonusListType = zod.infer<
  typeof CharacterCreatorBonusListSchema
>;
