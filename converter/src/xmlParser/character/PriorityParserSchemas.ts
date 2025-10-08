import {
  priorityLetterEnum,
  priorityCategoryEnum,
  heritageCategoryEnum,
  priorityTableRunnerLevelEnum,
} from "@neon-codex/common/build/enums.js";

import { StringArrayOrStringSchema } from "../common/ParserCommonDefines.js";
import {
  AttributePrioritySchema,
  HeritageOptionsPrioritySchema,
  ResourcePrioritySchema,
  SkillPrioritySchema,
  TalentOptionsPrioritySchema,
} from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import { type } from "arktype";

const PriorityBaseXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Related attribute
  value: type.valueOf(priorityLetterEnum),
});
const PriorityMetavariantXmlSchema = type({
  "+": "reject",
  name: "string",
  value: "number",
  karma: "number",
});
const PriorityMetatypeXmlSchema = type({
  "+": "reject",
  name: "string",
  value: "number",
  karma: "number",
  "metavariants?": type.or(
    type({
      "+": "reject",
      metavariant: type.or(
        PriorityMetavariantXmlSchema,
        PriorityMetavariantXmlSchema.array()
      ),
    }),
    "''"
  ),
});
const HeritageXmlSchema = PriorityBaseXmlSchema.merge({
  category: type.unit(priorityCategoryEnum.Heritage),
  metatypes: type({
    "+": "reject",
    metatype: type.or(
      PriorityMetatypeXmlSchema,
      PriorityMetatypeXmlSchema.array()
    ),
  }),
});
export type HeritageXmlType = typeof HeritageXmlSchema.infer;

const TalentXmlSchema = PriorityBaseXmlSchema.merge({
  category: type.unit(priorityCategoryEnum.Talent),
  talents: type({
    "+": "reject",
    talent: type(
      type({
        "+": "reject",
        name: "string",
        value: "string",
        "qualities?": type({ "+": "reject", quality: "string" }),

        "magic?": "number",
        "spells?": "number",
        "resonance?": "number",
        // Complex forms
        "cfp?": "number",
        "depth?": "number",
        // Number of free skills of the type in skill type
        "skillqty?": "number",
        // Rating of skills
        "skillval?": "number",
        // The type of free skills given
        "skilltype?": type.or(
          "'resonance'",
          "'matrix'",
          // Look at skill choices
          "'specific'",
          "'magic'",
          type({
            "+": "reject",
            _xpath:
              "\"not(attribute = 'RES' or attribute = 'DEP') and (not(category = 'Magical Active') or skillgroup = '' or not(skillgroup))\"",
            xmltext: "'xpath'",
          })
        ),
        // Used for the "specific" skilltype
        "skillchoices?": { skill: "string[]" },
        // Number of free skill group points
        "skillgroupqty?": "number",
        // Rating of skill group
        "skillgroupval?": "number",
        // This seems kinda redundant as is only ever grouped..
        "skillgrouptype?": "'grouped'",
        // Choices when using skill groups
        "skillgroupchoices?": type({
          "+": "reject",
          skillgroup: StringArrayOrStringSchema,
        }),

        "required?": type({
          "+": "reject",
          oneof: type.or(
            type({
              "+": "reject",
              metatypecategory: type.unit(heritageCategoryEnum.Metahuman),
            }),
            type({ "+": "reject", metatype: "'A.I.'" })
          ),
        }),

        "forbidden?": type({
          "+": "reject",
          oneof: type({ "+": "reject", metatype: "'A.I.'" }),
        }),
      })
    ).array(),
  }),
});
export type TalentXmlType = typeof TalentXmlSchema.infer;

const AttributeXmlSchema = PriorityBaseXmlSchema.merge({
  category: type.unit(priorityCategoryEnum.Attributes),
  attributes: "number",
});
export type AttributeXmlType = typeof AttributeXmlSchema.infer;

const SkillXmlSchema = PriorityBaseXmlSchema.merge({
  category: type.unit(priorityCategoryEnum.Skills),
  skills: "number",
  skillgroups: "number",
});
export type SkillXmlType = typeof SkillXmlSchema.infer;

const ResourceXmlSchema = PriorityBaseXmlSchema.merge({
  category: type.unit(priorityCategoryEnum.Resources),
  prioritytable: type.valueOf(priorityTableRunnerLevelEnum),
  resources: "number",
});
export type ResourceXmlType = typeof ResourceXmlSchema.infer;

export const PriorityXmlSchema = type.or(
  HeritageXmlSchema,
  TalentXmlSchema,
  AttributeXmlSchema,
  SkillXmlSchema,
  ResourceXmlSchema
);
export const PriorityListXmlSchema = type(PriorityXmlSchema.array());
export type PriorityXmlType = typeof PriorityXmlSchema.infer;

export const PriorityUnionSchema = type.or(
  HeritageOptionsPrioritySchema.merge({
    category: type.unit(priorityCategoryEnum.Heritage),
    rowLetter: type.valueOf(priorityLetterEnum),
  }),
  TalentOptionsPrioritySchema.merge({
    category: type.unit(priorityCategoryEnum.Talent),
    rowLetter: type.valueOf(priorityLetterEnum),
  }),
  AttributePrioritySchema.merge({
    category: type.unit(priorityCategoryEnum.Attributes),
    rowLetter: type.valueOf(priorityLetterEnum),
  }),
  SkillPrioritySchema.merge({
    category: type.unit(priorityCategoryEnum.Skills),
    rowLetter: type.valueOf(priorityLetterEnum),
  }),
  ResourcePrioritySchema.merge({
    category: type.unit(priorityCategoryEnum.Resources),
    rowLetter: type.valueOf(priorityLetterEnum),
    priorityTable: type.valueOf(priorityTableRunnerLevelEnum),
  })
);
export const PriorityUnionList = type(PriorityUnionSchema.array());
export type PriorityUnionType = typeof PriorityUnionSchema.infer;
export type PriorityUnionListType = typeof PriorityUnionList.infer;
