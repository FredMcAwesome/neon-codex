import { z as zod } from "zod";
import { priorityLetterEnum, talentCategoryEnum } from "../../enums.js";
import { HeritageSchema } from "../abilities/heritageSchemas.js";
import type { HeritageType } from "../abilities/heritageSchemas.js";
import { CustomisedWeaponListSchema } from "../equipment/combat/weaponSchemas.js";
import type { CustomisedWeaponListType } from "../equipment/combat/weaponSchemas.js";
import { CustomisedArmourListSchema } from "../equipment/combat/armourSchemas.js";
import type { CustomisedArmourListType } from "../equipment/combat/armourSchemas.js";
import { CustomisedGearListSchema } from "../equipment/other/gearSchemas.js";
import type { CustomisedGearListType } from "../equipment/other/gearSchemas.js";
import { CustomisedAugmentationListSchema } from "../equipment/bodyModification/augmentationSchemas.js";
import type { CustomisedAugmentationListType } from "../equipment/bodyModification/augmentationSchemas.js";
import { CustomisedVehicleListSchema } from "../equipment/rigger/vehicleSchemas.js";
import type { CustomisedVehicleListType } from "../equipment/rigger/vehicleSchemas.js";
import { CustomSkillListSchema } from "../abilities/skillSchemas.js";
import type { CustomSkillListType } from "../abilities/skillSchemas.js";
import { CustomQualityListSchema } from "../abilities/qualitySchemas.js";
import type { CustomQualityListType } from "../abilities/qualitySchemas.js";
import { AttributeRangeSchema } from "../shared/commonSchemas.js";

export enum PrioritiesEnum {
  Heritage,
  Attributes,
  Talents,
  Skills,
  Resources,
}

export const PriorityLevelsSchema = zod
  .object({
    heritage: zod.nativeEnum(priorityLetterEnum),
    attributes: zod.nativeEnum(priorityLetterEnum),
    talent: zod.nativeEnum(priorityLetterEnum),
    skills: zod.nativeEnum(priorityLetterEnum),
    resources: zod.nativeEnum(priorityLetterEnum),
  })
  .strict();
export type PriorityLevelsType = zod.infer<typeof PriorityLevelsSchema>;

export const AttributesSchema = zod
  .object({
    body: zod.number(),
    agility: zod.number(),
    reaction: zod.number(),
    strength: zod.number(),
    willpower: zod.number(),
    logic: zod.number(),
    intuition: zod.number(),
    charisma: zod.number(),
  })
  .strict();
export type AttributesType = zod.infer<typeof AttributesSchema>;

export const SpecialAttributesSchema = zod
  .object({
    edge: zod.number(),
    talent: zod.discriminatedUnion("type", [
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Magic),
          magic: zod.number(),
        })
        .strict(),
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Resonance),
          resonance: zod.number(),
        })
        .strict(),
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Depth),
          depth: zod.number(),
        })
        .strict(),
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Mundane),
        })
        .strict(),
    ]),
  })
  .strict();
export type SpecialAttributesType = zod.infer<typeof SpecialAttributesSchema>;

export const QualitySelectedListSchema = zod.array(
  zod
    .object({
      name: zod.string(),
      rating: zod.optional(zod.number()),
    })
    .strict()
);
export type QualitySelectedListType = zod.infer<
  typeof QualitySelectedListSchema
>;

export const HeritagePrioritySelectedSchema = zod
  .object({
    heritage: zod.string(),
    metavariant: zod.optional(zod.string()),
    specialAttributePoints: zod.number(),
  })
  .strict();

export type HeritagePrioritySelectedType = zod.infer<
  typeof HeritagePrioritySelectedSchema
>;

export const AttributeRangesSchema = zod
  .object({
    body: AttributeRangeSchema,
    agility: AttributeRangeSchema,
    reaction: AttributeRangeSchema,
    strength: AttributeRangeSchema,
    willpower: AttributeRangeSchema,
    logic: AttributeRangeSchema,
    intuition: AttributeRangeSchema,
    charisma: AttributeRangeSchema,
    // Special Attributes
    edge: AttributeRangeSchema,
    magic: AttributeRangeSchema,
    resonance: AttributeRangeSchema,
    depth: AttributeRangeSchema,
  })
  .strict();
export type AttributeRangesType = zod.infer<typeof AttributeRangesSchema>;

const CostRangeSchema = zod.array(zod.number());
export type CostRange = zod.infer<typeof CostRangeSchema>;

export type CharacterType = {
  name: string;
  heritage: HeritageType;
  priorities: PriorityLevelsType;
  attributes: AttributesType;
  specialAttributes: SpecialAttributesType;
  skillList: CustomSkillListType;
  qualityList: CustomQualityListType;
  nuyen: number;
  karmaPoints: number;
  weaponList: CustomisedWeaponListType;
  armourList: CustomisedArmourListType;
  gearList: CustomisedGearListType;
  augmentationList: CustomisedAugmentationListType;
  vehicleList: CustomisedVehicleListType;
};
export const CharacterSchema: zod.ZodType<CharacterType> = zod
  .object({
    name: zod.string(),
    heritage: HeritageSchema,
    priorities: PriorityLevelsSchema,
    attributes: AttributesSchema,
    specialAttributes: SpecialAttributesSchema,
    skillList: CustomSkillListSchema,
    qualityList: CustomQualityListSchema,
    //talent: talentStuffSchema,
    nuyen: zod.number(),
    karmaPoints: zod.number(),
    weaponList: CustomisedWeaponListSchema,
    armourList: CustomisedArmourListSchema,
    gearList: CustomisedGearListSchema,
    augmentationList: CustomisedAugmentationListSchema,
    vehicleList: CustomisedVehicleListSchema,
  })
  .strict();
