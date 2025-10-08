import { type } from "arktype";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  sourceBookXmlEnum,
  StringOrNumberSchema,
  augmentationXmlGradeEnum,
  AugmentationXmlLimitSchema,
  xmlAllowGearSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

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

const BiowareXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // How many times can this bioware be taken
  "limit?": AugmentationXmlLimitSchema,
  // Category of bioware
  category: type.valueOf(biowareXmlCategoryEnum),
  // All cultured Bioware has banned Used and Used (Adapsin)
  // as it has to be specifically made for a person
  // There are limited other cases where it is reserved for
  // certain clinic types
  "bannedgrades?": {
    grade: type.valueOf(augmentationXmlGradeEnum).array(),
  },
  // Essense cost
  ess: StringOrNumberSchema,
  // Needs to be added to a parent
  "requireparent?": "''",
  // This is a modification of a parent eseense cost
  "addtoparentess?": "''",
  // Max rating
  "rating?": "number",
  // This is irrelevant for bioware
  "capacity?": "0",
  // Availability
  avail: StringOrNumberSchema,
  // Cost
  cost: StringOrNumberSchema,
  // Bioware is a weapon, this is the weapon name
  // can be different than bioware name
  "addweapon?": "string",
  // Cannot have another cyberware/bioware using these mounts
  "blocksmounts?": "string",
  // Select left or right used for example, in hand replacement
  "selectside?": "''",
  // pairbonus applies when there is 2 of this or 1 of this and 1 of
  // the bioware here
  "pairinclude?": {
    name: "string",
  },
  // Allow certain gear categories
  // used for example, to allow chemical release from a gland
  "allowgear?": xmlAllowGearSchema,
  // Allow subsystems outside the "Basic" category
  "allowsubsystems?": {
    category: type.valueOf(biowareXmlCategoryEnum),
  },
  // Specific notes for chummer 5 client use, these can be ignored
  "notes?": "string",
  // Not selectable
  "hide?": "''",
  // Grade is not applicable to this bioware i.e. there is only 1 grade
  "forcegrade?": "'None'",
  // This is Geneware not bioware
  "isgeneware?": "''",
  source: type.or(type.valueOf(sourceBookXmlEnum), "2050"),
  page: "number",

  // Bonus applied by Cyberware
  "bonus?": BonusXmlSchema,
  // // Bonus applied when 2 are equipped e.g. 2 feet = different run speed
  "pairbonus?": BonusXmlSchema,
  // Required
  "required?": RequiredXmlSchema,
  // Forbidden
  "forbidden?": RequiredXmlSchema,
});
export type BiowareXmlType = typeof BiowareXmlSchema.infer;

export const BiowareListXmlSchema = type(BiowareXmlSchema.array());
export type BiowareListXmlType = typeof BiowareListXmlSchema.infer;
