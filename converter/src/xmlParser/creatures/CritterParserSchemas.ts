// import { standardCalculationEnum } from "@neon-codex/common/build/enums.js";
import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
  XmlPowerSchema,
  XmlQualityListSchema,
  attributeXMLEnum,
} from "../common/ParserCommonDefines.js";
import {
  critterTypeEnum,
  matrixAttributeEnum,
  skillCategoryEnum,
} from "@neon-codex/common/build/enums.js";

const SkillSchema = zod
  .object({
    _spec: zod.optional(zod.string()),
    _rating: zod.string(),
    _select: zod.optional(zod.string()),
    xmltext: zod.string(),
  })
  .strict();

const GroupSchema = zod
  .object({
    _rating: zod.string(),
    xmltext: zod.string(),
  })
  .strict();

const SkillListSchema = zod
  .object({
    skill: zod.array(SkillSchema),
    group: zod.optional(zod.union([GroupSchema, zod.array(GroupSchema)])),
    knowledge: zod.optional(
      zod
        .object({
          _rating: zod.string(),
          _category: zod.nativeEnum(skillCategoryEnum),
          _attribute: zod.nativeEnum(attributeXMLEnum),
          xmltext: zod.string(),
        })
        .strict()
    ),
  })
  .strict();

const CritterIncludedBiowareSchema = zod.union([
  zod.string(),
  zod.object({ _rating: zod.string(), xmltext: zod.string() }).strict(),
]);
const CritterIncludedBiowareListSchema = zod.array(
  CritterIncludedBiowareSchema
);
export type CritterIncludedBiowareListType = zod.infer<
  typeof CritterIncludedBiowareListSchema
>;
const CritterIncludedComplexFormSchema = zod.union([
  zod.string(),
  zod
    .object({
      _select: zod.nativeEnum(matrixAttributeEnum),
      xmltext: zod.string(),
    })
    .strict(),
]);
const CritterIncludedComplexFormListSchema = zod.array(
  CritterIncludedComplexFormSchema
);
export type CritterIncludedComplexFormType = zod.infer<
  typeof CritterIncludedComplexFormListSchema
>;

const SubCritterXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    karma: zod.optional(zod.literal(0)),
    // Attributes, critter have min, max, aug as physical critters
    // can have a range of min +/-3 (for some reason only +3 is given for max
    // there is no -3, min is just the standard)
    // Body
    bodmin: StringOrNumberSchema,
    bodmax: StringOrNumberSchema,
    bodaug: StringOrNumberSchema,
    // Agility
    agimin: StringOrNumberSchema,
    agimax: StringOrNumberSchema,
    agiaug: StringOrNumberSchema,
    // Reaction
    reamin: StringOrNumberSchema,
    reamax: StringOrNumberSchema,
    reaaug: StringOrNumberSchema,
    // Strength
    strmin: StringOrNumberSchema,
    strmax: StringOrNumberSchema,
    straug: StringOrNumberSchema,
    // Charisma
    chamin: StringOrNumberSchema,
    chamax: StringOrNumberSchema,
    chaaug: StringOrNumberSchema,
    // Intuition
    intmin: StringOrNumberSchema,
    intmax: StringOrNumberSchema,
    intaug: StringOrNumberSchema,
    // Logic
    logmin: StringOrNumberSchema,
    logmax: StringOrNumberSchema,
    logaug: StringOrNumberSchema,
    // Willpower
    wilmin: StringOrNumberSchema,
    wilmax: StringOrNumberSchema,
    wilaug: StringOrNumberSchema,
    // Initiative
    inimin: zod.optional(StringOrNumberSchema),
    inimax: zod.optional(StringOrNumberSchema),
    iniaug: zod.optional(StringOrNumberSchema),
    // Edge
    edgmin: StringOrNumberSchema,
    edgmax: StringOrNumberSchema,
    edgaug: StringOrNumberSchema,
    // Magic
    magmin: zod.optional(StringOrNumberSchema),
    magmax: zod.optional(StringOrNumberSchema),
    magaug: zod.optional(StringOrNumberSchema),
    // Resonance
    resmin: zod.optional(StringOrNumberSchema),
    resmax: zod.optional(StringOrNumberSchema),
    resaug: zod.optional(StringOrNumberSchema),
    // Depth
    depmin: zod.optional(StringOrNumberSchema),
    depmax: zod.optional(StringOrNumberSchema),
    depaug: zod.optional(StringOrNumberSchema),
    // Essence
    essmin: StringOrNumberSchema,
    essmax: StringOrNumberSchema,
    essaug: StringOrNumberSchema,
    // Doesn't have normal movement e.g. An AI program doesn't have a physical body
    movement: zod.optional(zod.literal("Special")),
    // Movement speeds
    // Formatted like: Ground/Water/Air speed
    walk: zod.optional(zod.string()),
    run: zod.optional(zod.string()),
    sprint: zod.optional(zod.string()),
    // Sprite or Spirit that uses force to determine attributes
    forcecreature: zod.optional(zod.literal("")),
    // Creature is Sprite, force means level for this purpose
    forceislevels: zod.optional(zod.literal("")),
    // Included qualities
    qualities: zod.optional(XmlQualityListSchema),
    // Included Powers
    powers: zod.optional(
      zod
        .object({
          power: zod.union([XmlPowerSchema, zod.array(XmlPowerSchema)]),
        })
        .strict()
    ),
    // Choose one optional power per every 3 points of force in summoning
    optionalpowers: zod.optional(
      zod
        .object({
          optionalpower: zod.union([zod.array(XmlPowerSchema), XmlPowerSchema]),
          _count: zod.optional(zod.string()),
        })
        .strict()
    ),
    // Included Biowares
    biowares: zod.optional(
      zod
        .object({
          bioware: zod.union([
            zod.array(CritterIncludedBiowareSchema),
            CritterIncludedBiowareSchema,
          ]),
        })
        .strict()
    ),
    // Technocritters have complex forms
    complexforms: zod.optional(
      zod
        .object({
          complexform: zod.union([
            zod.array(CritterIncludedComplexFormSchema),
            CritterIncludedComplexFormSchema,
          ]),
        })
        .strict()
    ),
    // Non-defaulting skills
    skills: SkillListSchema,
    // Armour from armour power, H means hardened armour
    armor: zod.optional(StringOrNumberSchema),
    // Bonuses
    bonus: zod.optional(BonusXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();

const CritterXmlSchema = SubCritterXmlSchema.extend({
  category: zod.nativeEnum(critterTypeEnum),
  // subcritter types (used for insect spirits)
  metavariants: zod.optional(
    zod
      .object({
        metavariant: zod.array(SubCritterXmlSchema),
      })
      .strict()
  ),
}).strict();
export type CritterXmlType = zod.infer<typeof CritterXmlSchema>;

export const CritterListXmlSchema = zod.array(CritterXmlSchema);
export type CritterListXmlType = zod.infer<typeof CritterListXmlSchema>;
