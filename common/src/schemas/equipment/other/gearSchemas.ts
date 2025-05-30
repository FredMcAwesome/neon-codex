import { z as zod } from "zod";
import {
  attributeTypeEnum,
  costEnum,
  firearmWeaponTypeEnum,
  gearCategoryEnum,
  gearDeviceRatingEnum,
  gearRatingEnum,
  mathOperatorEnum,
  parentGearEnum,
  personaFormEnum,
  projectileWeaponTypeEnum,
  ratingMeaningEnum,
  restrictionEnum,
  sourceBookEnum,
  weaponExtraClassificationEnum,
  weaponTypeEnum,
} from "../../../enums.js";
import {
  AvailabilityRatingSchema,
  RangeCostSchema,
} from "../../shared/commonSchemas.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { WeaponBonusSchema } from "../../shared/weaponSharedSchemas.js";

export const PartialAvailabilityGearSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
const AvailabilityGearSchema = zod.union([
  PartialAvailabilityGearSchema,
  zod
    .object({
      ratingLinked: zod.array(PartialAvailabilityGearSchema),
    })
    .strict(),
]);
export type AvailabilityGearType = zod.infer<typeof AvailabilityGearSchema>;

const InnerCostGearSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type RecursiveCostGearType = Array<
  zod.infer<typeof InnerCostGearSchema> | { subnumbers: RecursiveCostGearType }
>;
export const RecursiveCostGearSchema: zod.ZodType<RecursiveCostGearType> =
  zod.array(
    zod.union([
      InnerCostGearSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => RecursiveCostGearSchema),
        })
        .strict(),
    ])
  );

export const CostGearSchema = zod.union([
  RangeCostSchema,
  RecursiveCostGearSchema,
  zod.object({ ratingLinked: zod.array(RecursiveCostGearSchema) }).strict(),
]);
export type CostGearType = zod.infer<typeof CostGearSchema>;

const AmmoForWeaponTypeSchema = zod.union([
  zod
    .object({
      type: zod.literal(weaponTypeEnum.Projectile),
      subtype: zod.nativeEnum(projectileWeaponTypeEnum),
    })
    .strict(),
  zod
    .object({
      type: zod.literal(weaponTypeEnum.Firearm),
      subtype: zod.nativeEnum(firearmWeaponTypeEnum),
    })
    .strict(),
  zod
    .object({
      extraClassification: zod.optional(
        zod.nativeEnum(weaponExtraClassificationEnum)
      ),
    })
    .strict(),
]);
export type AmmoForWeaponTypeType = zod.infer<typeof AmmoForWeaponTypeSchema>;

const GearDeviceRatingSchema = zod.union([
  zod
    .object({
      option: zod.nativeEnum(gearDeviceRatingEnum),
    })
    .strict(),
  zod.number(),
]);
export type GearDeviceRatingType = zod.infer<typeof GearDeviceRatingSchema>;

const GearProgramSchema = zod.array(
  zod.union([
    zod.number(),
    zod
      .object({
        option: zod.nativeEnum(parentGearEnum),
      })
      .strict(),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
  ])
);
export type GearProgramType = zod.infer<typeof GearProgramSchema>;

const GearDeviceAttributeSchema = zod.union([
  zod
    .object({
      option: zod.union([
        zod.nativeEnum(attributeTypeEnum),
        zod.nativeEnum(parentGearEnum),
      ]),
    })
    .strict(),
  zod.number(),
]);
export type GearDeviceAttributeType = zod.infer<
  typeof GearDeviceAttributeSchema
>;

const GearCapacitySchema = zod.array(
  zod.union([
    zod
      .object({
        option: zod.nativeEnum(parentGearEnum),
      })
      .strict(),
    zod
      .object({
        operator: zod.nativeEnum(mathOperatorEnum),
      })
      .strict(),
    zod.number(),
  ])
);

const GearCapacityInformationSchema = zod
  .object({
    capacity: zod.optional(GearCapacitySchema),
    capacityCost: zod.optional(GearCapacitySchema),
  })
  .strict();
export type GearCapacityInformationType = zod.infer<
  typeof GearCapacityInformationSchema
>;

const GearRatingSchema = zod.union([
  zod.number(),
  zod.object({ option: zod.nativeEnum(gearRatingEnum) }).strict(),
]);
export type GearRatingType = zod.infer<typeof GearRatingSchema>;

const WeightSchema = zod.union([
  zod.object({ option: zod.literal("Rating") }).strict(),
  zod.number(),
]);
export type WeightType = zod.infer<typeof WeightSchema>;

export const GearSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(gearCategoryEnum),
    minRating: zod.optional(GearRatingSchema),
    maxRating: zod.optional(GearRatingSchema),
    ratingMeaning: zod.optional(zod.nativeEnum(ratingMeaningEnum)),
    includedWeapon: zod.optional(
      zod
        .object({
          name: zod.string(),
          rating: zod.optional(
            zod.object({ option: zod.nativeEnum(gearRatingEnum) }).strict()
          ),
        })
        .strict()
    ),
    allowCategoryList: zod.optional(
      zod.array(zod.nativeEnum(gearCategoryEnum))
    ),
    purchaseQuantity: zod.optional(zod.number()),
    bonus: zod.optional(BonusSchema),
    weaponBonus: zod.optional(WeaponBonusSchema),
    isFlechetteAmmo: zod.optional(zod.literal(true)),
    flechetteWeaponBonus: zod.optional(WeaponBonusSchema),
    ammoForWeaponType: zod.optional(zod.array(AmmoForWeaponTypeSchema)),
    explosiveWeight: zod.optional(WeightSchema),
    userSelectable: zod.optional(zod.literal(false)),
    allowedGearList: zod.optional(zod.array(zod.string())),
    includedGearList: zod.optional(zod.lazy(() => CustomisedGearListSchema)),
    deviceRating: zod.optional(GearDeviceRatingSchema),
    programs: zod.optional(GearProgramSchema),
    attributeArray: zod.optional(zod.array(zod.number())),
    attack: zod.optional(GearDeviceAttributeSchema),
    sleaze: zod.optional(GearDeviceAttributeSchema),
    dataProcessing: zod.optional(GearDeviceAttributeSchema),
    firewall: zod.optional(GearDeviceAttributeSchema),
    canFormPersona: zod.optional(zod.nativeEnum(personaFormEnum)),
    capacityInformation: zod.optional(GearCapacityInformationSchema),
    armourCapacityInformation: zod.optional(GearCapacityInformationSchema),
    requirements: zod.optional(RequirementsSchema),
    requireParent: zod.optional(zod.literal(true)),
    forbidden: zod.optional(RequirementsSchema),
    modifyAttributeArray: zod.optional(zod.array(zod.number())),
    modifyAttack: zod.optional(GearDeviceAttributeSchema),
    modifySleaze: zod.optional(GearDeviceAttributeSchema),
    modifyDataProcessing: zod.optional(GearDeviceAttributeSchema),
    modifyFirewall: zod.optional(GearDeviceAttributeSchema),
    addMatrixBoxes: zod.optional(zod.number()),
    renameCustomLabel: zod.optional(zod.literal(true)),
    availability: AvailabilityGearSchema,
    cost: CostGearSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type GearType = zod.infer<typeof GearSchema>;
export const GearListSchema = zod.array(GearSchema);
export type GearListType = zod.infer<typeof GearListSchema>;

export type CustomisedGearType = {
  baseGear: string;
  customName?: string | undefined;
  specificOption?: string | undefined;
  rating?: number | undefined;
  consumeCapacity?: true | undefined;
  currentQuantity?: number | undefined;
  innerGearList?: CustomisedGearListType | undefined;
};

export const CustomisedGearSchema: zod.ZodType<CustomisedGearType> = zod
  .object({
    baseGear: zod.string(),
    // optional as only sometimes required to identify the gear
    category: zod.optional(zod.nativeEnum(gearCategoryEnum)),
    customName: zod.optional(zod.string()),
    specificOption: zod.optional(zod.string()),
    rating: zod.optional(zod.number()),
    consumeCapacity: zod.optional(zod.literal(true)),
    currentQuantity: zod.optional(zod.number()),
    innerGearList: zod.optional(zod.lazy(() => CustomisedGearListSchema)),
  })
  .strict();

export const CustomisedGearListSchema = zod.array(CustomisedGearSchema);
export type CustomisedGearListType = zod.infer<typeof CustomisedGearListSchema>;
