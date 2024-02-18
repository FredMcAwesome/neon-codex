import { z as zod } from "zod";
import {
  BonusXmlSchema,
  type BonusXmlType,
} from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
  augmentationXmlGradeEnum,
  AugmentationXmlLimitSchema,
  xmlAllowGearSchema,
} from "../common/ParserCommonDefines.js";
import {
  RequiredXmlSchema,
  type RequiredXmlType,
} from "../common/RequiredParserSchemas.js";

export enum biowareXmlCategoryEnum {
  Basic = "Basic",
  Biosculpting = "Biosculpting",
  BioWeapons = "Bio-Weapons",
  ChemicalGlandModifications = "Chemical Gland Modifications",
  CosmeticBioware = "Cosmetic Bioware",
  Cultured = "Cultured",
  OrthoskinUpgrades = "Orthoskin Upgrades",
  Symbionts = "Symbionts",
  GeneticRestoration = "Genetic Restoration",
  PhenotypeAdjustment = "Phenotype Adjustment",
  ExoticMetagenetics = "Exotic Metagenetics",
  Transgenics = "Transgenics",
  EnvironmentalMicroadaptation = "Environmental Microadaptation",
  Immunization = "Immunization",
  TransgenicAlteration = "Transgenic Alteration",
  ComplimentaryGenetics = "Complimentary Genetics",
}

const BiowareSubBonusXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // How many times can this bioware be taken
    limit: zod.optional(AugmentationXmlLimitSchema),
    // Category of bioware
    category: zod.nativeEnum(biowareXmlCategoryEnum),
    // All cultured Bioware has banned Used and Used (Adapsin)
    // as it has to be specifically made for a person
    // There are limited other cases where it is reserved for
    // certain clinic types
    bannedgrades: zod.optional(
      zod
        .object({
          grade: zod.array(zod.nativeEnum(augmentationXmlGradeEnum)),
        })
        .strict()
    ),
    // Essense cost
    ess: StringOrNumberSchema,
    // Needs to be added to a parent
    requireparent: zod.optional(zod.literal("")),
    // This is a modification of a parent eseense cost
    addtoparentess: zod.optional(zod.literal("")),
    // Max rating
    rating: zod.optional(zod.number()),
    // This is irrelevant for bioware
    capacity: zod.optional(zod.literal(0)),
    // Availability
    avail: StringOrNumberSchema,
    // Cost
    cost: StringOrNumberSchema,
    // Bioware is a weapon, this is the weapon name
    // can be different than bioware name
    addweapon: zod.optional(zod.string()),
    // Cannot have another cyberware/bioware using these mounts
    blocksmounts: zod.optional(zod.string()),
    // Select left or right used for example, in hand replacement
    selectside: zod.optional(zod.literal("")),
    // pairbonus applies when there is 2 of this or 1 of this and 1 of
    // the bioware here
    pairinclude: zod.optional(
      zod
        .object({
          name: zod.string(),
        })
        .strict()
    ),
    // Allow certain gear categories
    // used for example, to allow chemical release from a gland
    allowgear: zod.optional(xmlAllowGearSchema),
    // Allow subsystems outside the "Basic" category
    allowsubsystems: zod.optional(
      zod
        .object({
          category: zod.nativeEnum(biowareXmlCategoryEnum),
        })
        .strict()
    ),
    // Specific notes for chummer 5 client use, these can be ignored
    notes: zod.optional(zod.string()),
    // Not selectable
    hide: zod.optional(zod.literal("")),
    // Grade is not applicable to this bioware i.e. there is only 1 grade
    forcegrade: zod.optional(zod.literal("None")),
    // This is Geneware not bioware
    isgeneware: zod.optional(zod.literal("")),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();

type BiowareSubBonusXmlType = zod.infer<typeof BiowareSubBonusXmlSchema>;

// Need to split up type/annotate schema to avoid TS7056 error
export type BiowareXmlType = BiowareSubBonusXmlType & {
  bonus?: BonusXmlType | undefined;
  pairbonus?: BonusXmlType | undefined;
  required?: RequiredXmlType | undefined;
  forbidden?: RequiredXmlType | undefined;
};
const BiowareXmlSchema: zod.ZodSchema<BiowareXmlType> =
  BiowareSubBonusXmlSchema.extend({
    // Bonus applied by Cyberware
    bonus: zod.optional(BonusXmlSchema),
    // // Bonus applied when 2 are equipped e.g. 2 feet = different run speed
    pairbonus: zod.optional(BonusXmlSchema),
    // Required
    required: zod.optional(RequiredXmlSchema),
    // Forbidden
    forbidden: zod.optional(RequiredXmlSchema),
  });
export const BiowareListXmlSchema = zod.array(BiowareXmlSchema);
export type BiowareListXmlType = zod.infer<typeof BiowareListXmlSchema>;
