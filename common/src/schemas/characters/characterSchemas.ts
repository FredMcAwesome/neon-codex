import { z as zod } from "zod";
import { priorityLetterEnum, talentCategoryEnum } from "../../enums.js";
import { AttributeRangeSchema } from "../abilities/heritageSchemas.js";

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

const HeritagePrioritySelectedSchema = zod
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

const SpecialAttributeRangesSchema = zod.object({}).strict();
export type SpecialAttributeRangesType = zod.infer<
  typeof SpecialAttributeRangesSchema
>;

const CostRangeSchema = zod.array(zod.number());
export type CostRange = zod.infer<typeof CostRangeSchema>;
