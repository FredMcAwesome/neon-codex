import { z as zod } from "zod";

export enum PrioritiesEnum {
  Metatype,
  Attributes,
  Magic,
  Skills,
  Resources,
}
export enum PriorityLevelEnum {
  A,
  B,
  C,
  D,
  E,
}

export enum MetatypeEnum {
  Human,
  Elf,
  Dwarf,
  Ork,
  Troll,
}
export enum MagicTypeEnum {
  Adept,
  AspectedMagician,
  Magician,
  MysticAdept,
  NotAwakened,
  Technomancer,
}

export const PrioritiesSchema = zod
  .object({
    MetatypePriority: zod.nativeEnum(PriorityLevelEnum),
    MetatypeSubselection: zod.nativeEnum(MetatypeEnum),
    AttributesPriority: zod.nativeEnum(PriorityLevelEnum),
    MagicPriority: zod.nativeEnum(PriorityLevelEnum),
    MagicSubselection: zod.nativeEnum(MagicTypeEnum),
    SkillsPriority: zod.nativeEnum(PriorityLevelEnum),
    ResourcesPriority: zod.nativeEnum(PriorityLevelEnum),
  })
  .strict();
export type PrioritiesType = zod.infer<typeof PrioritiesSchema>;

export const AttributesSchema = zod.object({
  body: zod.number(),
  agility: zod.number(),
  reaction: zod.number(),
  strength: zod.number(),
  willpower: zod.number(),
  logic: zod.number(),
  intuition: zod.number(),
  charisma: zod.number(),
});
export type AttributesType = zod.infer<typeof AttributesSchema>;

export const SpecialAttributesSchema = zod
  .object({
    edge: zod.number(),
    magic: zod.number(),
  })
  .strict();
export type SpecialAttributesType = zod.infer<typeof SpecialAttributesSchema>;

// export const CharacterInformationSchema = zod
//   .object({
//     priorityInfo: PrioritiesSchema,
//     attributeInfo: AttributesSchema,
//     specialAttributeInfo: SpecialAttributesSchema,
//     skillSelections: CustomSkillListSchema,
//     equipmentSelected: EquipmentListSchema,
//     karmaPoints: zod.number(),
//     nuyen: zod.number(),
//   })
//   .strict();
const CostRangeSchema = zod.array(zod.number());
export type CostRange = zod.infer<typeof CostRangeSchema>;
