import { type } from "arktype";
import {
  HeritageListSchema,
  type HeritageListType,
} from "./abilities/heritageSchemas.js";
import {
  MartialArtListSchema,
  MartialArtTechniqueListSchema,
  type MartialArtListType,
  type MartialArtTechniqueListType,
} from "./abilities/martialArtSchemas.js";
import {
  QualityListSchema,
  type QualityListType,
} from "./abilities/qualitySchemas.js";
import {
  AdeptPowerListSchema,
  type AdeptPowerListType,
} from "./abilities/talent/adeptPowerSchemas.js";
import {
  ComplexFormListSchema,
  type ComplexFormListType,
} from "./abilities/talent/complexFormSchemas.js";
import {
  MentorListSchema,
  type MentorListType,
} from "./abilities/talent/mentorSchemas.js";
import {
  ProgramListSchema,
  type ProgramListType,
} from "./abilities/talent/programSchemas.js";
import {
  SpellListSchema,
  type SpellListType,
} from "./abilities/talent/spellSchemas.js";
import {
  TraditionListSchema,
  type TraditionListType,
} from "./abilities/talent/traditionSchemas.js";
import {
  CritterListSchema,
  type CritterListType,
} from "./creatures/critterSchemas.js";
import {
  LifestyleListSchema,
  LifestyleQualityListSchema,
  type LifestyleListType,
  type LifestyleQualityListType,
} from "./otherData/lifestyleSchemas.js";
import {
  PriorityTableSchema,
  type PriorityTableType,
} from "./otherData/prioritySchemas.js";

// Static creator catalogs served as `creator-data.json`.

// Same pattern as `equipment-data.json`: generated from the DB by `backend/src/scripts/generate-creator-data-json.ts`,
// validated at generation time, then served statically so runtime pages never recalculate or refetch them.
// Covers exactly the lists the creator steps consume via trpc today (priorities, heritages, qualities, traditions,
// mentors, critters, spells, complexForms, adeptPowers, programs, martialArts, martialArtTechniques, lifestyles, lifestyleQualities).

export type CreatorStaticDataType = {
  version: number;
  priorities: PriorityTableType;
  heritages: HeritageListType;
  qualities: QualityListType;
  traditions: TraditionListType;
  mentors: MentorListType;
  critters: CritterListType;
  spells: SpellListType;
  complexForms: ComplexFormListType;
  adeptPowers: AdeptPowerListType;
  programs: ProgramListType;
  martialArts: MartialArtListType;
  martialArtTechniques: MartialArtTechniqueListType;
  lifestyles: LifestyleListType;
  lifestyleQualities: LifestyleQualityListType;
};

export const CreatorStaticDataSchema = type({
  "+": "reject",
  version: "number",
  priorities: PriorityTableSchema,
  heritages: HeritageListSchema,
  qualities: QualityListSchema,
  traditions: TraditionListSchema,
  mentors: MentorListSchema,
  critters: CritterListSchema,
  spells: SpellListSchema,
  complexForms: ComplexFormListSchema,
  adeptPowers: AdeptPowerListSchema,
  programs: ProgramListSchema,
  martialArts: MartialArtListSchema,
  martialArtTechniques: MartialArtTechniqueListSchema,
  lifestyles: LifestyleListSchema,
  lifestyleQualities: LifestyleQualityListSchema,
});
