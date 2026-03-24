import { type } from "arktype";
import {
  AttributesSchema,
  HeritagePrioritySelectedSchema,
  LifestyleSelectedListSchema,
  MartialArtSelectedSchema,
  PriorityLevelsSchema,
  QualitySelectedListSchema,
  SpecialAttributesSchema,
  TalentInfoSchema,
} from "./characterSchemas.js";
import {
  CustomSkillGroupListSchema,
  CustomSkillListSchema,
} from "../abilities/skillSchemas.js";
import { SelectedEquipmentListSchema } from "../equipment/other/equipmentSchemas.js";
import { CharacterCreatorBonusListSchema } from "../shared/commonSchemas.js";

/**
 * Enum for character creator steps.
 * Used to track which step the user is currently on.
 */
export const characterCreatorStepEnum = {
  PriorityListSelect: "PriorityListSelect",
  AttributeListSelect: "AttributeListSelect",
  QualityListSelect: "QualityListSelect",
  TalentListSelect: "TalentListSelect",
  SkillListSelect: "SkillListSelect",
  MartialArtSelect: "MartialArtSelect",
  EquipmentListSelect: "EquipmentListSelect",
  LifestyleSelect: "LifestyleSelect",
  CreatorSummary: "CreatorSummary",
} as const;

export type CharacterCreatorStepType =
  (typeof characterCreatorStepEnum)[keyof typeof characterCreatorStepEnum];

export const CharacterCreatorStepSchema = type.valueOf(
  characterCreatorStepEnum
);

/**
 * Draft character data schema.
 * All fields are optional since the character is in-progress.
 * Uses snapshotting approach - stores full object data for selections.
 */
export const DraftCharacterDataSchema = type({
  "+": "reject",
  "priorityInfo?": PriorityLevelsSchema,
  "heritageInfo?": HeritagePrioritySelectedSchema,
  "attributeInfo?": AttributesSchema,
  "specialAttributeInfo?": SpecialAttributesSchema,
  "talentInfo?": TalentInfoSchema,
  "positiveQualityListSelected?": QualitySelectedListSchema,
  "negativeQualityListSelected?": QualitySelectedListSchema,
  "skillSelections?": CustomSkillListSchema,
  "skillGroupSelections?": CustomSkillGroupListSchema,
  "martialArtSelected?": MartialArtSelectedSchema,
  "equipmentSelections?": SelectedEquipmentListSchema,
  "lifestyleSelections?": LifestyleSelectedListSchema,
  "karmaPoints?": "number",
  "nuyen?": "number",
  "bonusInfo?": CharacterCreatorBonusListSchema,
  // Current step for resuming editing
  "currentStep?": CharacterCreatorStepSchema,
});
export type _DraftCharacterDataType = typeof DraftCharacterDataSchema.infer;
export interface DraftCharacterDataType extends _DraftCharacterDataType {}

/**
 * Schema for creating a new draft character.
 */
export const CreateDraftCharacterSchema = type({
  "+": "reject",
  currentStep: CharacterCreatorStepSchema,
  characterData: DraftCharacterDataSchema,
  "name?": "string",
});
export type _CreateDraftCharacterType = typeof CreateDraftCharacterSchema.infer;
export interface CreateDraftCharacterType extends _CreateDraftCharacterType {}

/**
 * Schema for updating an existing draft character.
 * Includes version for optimistic locking.
 */
export const UpdateDraftCharacterSchema = type({
  "+": "reject",
  draftId: "number",
  version: "number",
  currentStep: CharacterCreatorStepSchema,
  characterData: DraftCharacterDataSchema,
  "name?": "string",
  "forceOverwrite?": "boolean",
});
export type _UpdateDraftCharacterType = typeof UpdateDraftCharacterSchema.infer;
export interface UpdateDraftCharacterType extends _UpdateDraftCharacterType {}

/**
 * Schema for a draft character returned from the server.
 */
export const DraftCharacterResponseSchema = type({
  "+": "reject",
  id: "number",
  name: "string",
  currentStep: "string",
  characterData: DraftCharacterDataSchema,
  version: "number",
  createdAt: "string",
  updatedAt: "string",
});
export type DraftCharacterResponseType =
  typeof DraftCharacterResponseSchema.infer;

/**
 * Schema for draft character list item (summary view).
 */
export const DraftCharacterSummarySchema = type({
  "+": "reject",
  id: "number",
  name: "string",
  currentStep: "string",
  updatedAt: "string",
});
export type DraftCharacterSummaryType =
  typeof DraftCharacterSummarySchema.infer;

export const DraftCharacterSummaryListSchema =
  DraftCharacterSummarySchema.array();
export type DraftCharacterSummaryListType =
  typeof DraftCharacterSummaryListSchema.infer;
