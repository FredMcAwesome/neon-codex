import {
  priorityLetterEnum,
  priorityCategoryEnum,
  metatypeCategoryEnum,
  priorityTableRunnerLevelEnum,
} from "@neon-codex/common/build/enums.js";
import { z as zod } from "zod";
import { StringArrayOrStringSchema } from "../common/ParserCommonDefines.js";

const PriorityBaseXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Related attribute
    value: zod.nativeEnum(priorityLetterEnum),
  })
  .strict();

const PriorityMetavariantXmlSchema = zod
  .object({
    name: zod.string(),
    value: zod.number(),
    karma: zod.number(),
  })
  .strict();

const PriorityMetatypeXmlSchema = zod
  .object({
    name: zod.string(),
    value: zod.number(),
    karma: zod.number(),
    metavariants: zod.optional(
      zod.union([
        zod
          .object({
            metavariant: zod.union([
              zod.array(PriorityMetavariantXmlSchema),
              PriorityMetavariantXmlSchema,
            ]),
          })
          .strict(),
        zod.literal(""),
      ])
    ),
  })
  .strict();

const HeritageSchema = PriorityBaseXmlSchema.extend({
  category: zod.literal(priorityCategoryEnum.Heritage),
  metatypes: zod
    .object({
      metatype: zod.union([
        zod.array(PriorityMetatypeXmlSchema),
        PriorityMetatypeXmlSchema,
      ]),
    })
    .strict(),
}).strict();
export type HeritageType = zod.infer<typeof HeritageSchema>;

const TalentSchema = PriorityBaseXmlSchema.extend({
  category: zod.literal(priorityCategoryEnum.Talent),
  talents: zod
    .object({
      talent: zod.array(
        zod
          .object({
            name: zod.string(),
            value: zod.string(),
            qualities: zod.optional(
              zod
                .object({
                  quality: zod.string(),
                })
                .strict()
            ),
            magic: zod.optional(zod.number()),
            spells: zod.optional(zod.number()),
            resonance: zod.optional(zod.number()),
            // Complex forms
            cfp: zod.optional(zod.number()),
            depth: zod.optional(zod.number()),
            // Number of free skills of the type in skill type
            skillqty: zod.optional(zod.number()),
            // Rating of skills
            skillval: zod.optional(zod.number()),
            // The type of free skills given
            skilltype: zod.optional(
              zod.union([
                zod.literal("resonance"),
                zod.literal("matrix"),
                // Look at skill choices
                zod.literal("specific"),
                zod.literal("magic"),
                zod
                  .object({
                    _xpath: zod.literal(
                      "not(attribute = 'RES' or attribute = 'DEP') and (not(category = 'Magical Active') or skillgroup = '' or not(skillgroup))"
                    ),
                    xmltext: zod.literal("xpath"),
                  })
                  .strict(),
              ])
            ),
            // Used for the "specific" skilltype
            skillchoices: zod.optional(
              zod.object({ skill: zod.array(zod.string()) }).strict()
            ),
            // Number of free skill group points
            skillgroupqty: zod.optional(zod.number()),
            // Rating of skill group
            skillgroupval: zod.optional(zod.number()),
            // This seems kinda redundant as is only ever grouped..
            skillgrouptype: zod.optional(zod.literal("grouped")),
            // Choices when using skill groups
            skillgroupchoices: zod.optional(
              zod
                .object({
                  skillgroup: StringArrayOrStringSchema,
                })
                .strict()
            ),
            required: zod.optional(
              zod
                .object({
                  oneof: zod.union([
                    zod
                      .object({
                        metatypecategory: zod.literal(
                          metatypeCategoryEnum.Metahuman
                        ),
                      })
                      .strict(),
                    zod
                      .object({
                        metatype: zod.literal("A.I."),
                      })
                      .strict(),
                  ]),
                })
                .strict()
            ),
            forbidden: zod.optional(
              zod
                .object({
                  oneof: zod
                    .object({
                      metatype: zod.literal("A.I."),
                    })
                    .strict(),
                })
                .strict()
            ),
          })
          .strict()
      ),
    })
    .strict(),
}).strict();
export type TalentType = zod.infer<typeof TalentSchema>;

const AttributeSchema = PriorityBaseXmlSchema.extend({
  category: zod.literal(priorityCategoryEnum.Attributes),
  attributes: zod.number(),
}).strict();
export type AttributeType = zod.infer<typeof AttributeSchema>;

const SkillSchema = PriorityBaseXmlSchema.extend({
  category: zod.literal(priorityCategoryEnum.Skills),
  skills: zod.number(),
  skillgroups: zod.number(),
}).strict();
export type SkillXmlType = zod.infer<typeof SkillSchema>;

const ResourceXmlSchema = PriorityBaseXmlSchema.extend({
  category: zod.literal(priorityCategoryEnum.Resources),
  prioritytable: zod.nativeEnum(priorityTableRunnerLevelEnum),
  resources: zod.number(),
}).strict();
export type ResourceXmlType = zod.infer<typeof ResourceXmlSchema>;

export const PriorityXmlSchema = zod.discriminatedUnion("category", [
  HeritageSchema,
  TalentSchema,
  AttributeSchema,
  SkillSchema,
  ResourceXmlSchema,
]);
export const PriorityListXmlSchema = zod.array(PriorityXmlSchema);
export type PriorityXmlType = zod.infer<typeof PriorityXmlSchema>;
