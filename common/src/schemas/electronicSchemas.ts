import { z as zod } from "zod";
import { matrixWareAccessoryTypeEnum, matrixWareTypeEnum } from "../enums.js";
import {
  RatingSchema,
  AvailabilitySchema,
  CostSchema,
  CapacitySchema,
} from "./commonSchema.js";

export const CyberdeckAttributeArraySchema = zod.array(zod.number()).length(4);
export type CyberdeckAttributeArrayType = zod.infer<
  typeof CyberdeckAttributeArraySchema
>;

export const CommlinkTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareTypeEnum.Commlink),
});
export type CommlinkTypeInformationType = zod.infer<
  typeof CommlinkTypeInformationSchema
>;
export const CyberdeckTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareTypeEnum.Cyberdeck),
  attributeArray: CyberdeckAttributeArraySchema,
  programs: zod.number(),
});
export type CyberdeckTypeInformationType = zod.infer<
  typeof CyberdeckTypeInformationSchema
>;
export const RFIDTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareTypeEnum.CommunicationCountermeasure),
  description: zod.string(),
  wireless: zod.optional(zod.string()),
});
export type RFIDTypeInformationType = zod.infer<
  typeof RFIDTypeInformationSchema
>;
export const CommunicationTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareTypeEnum.RFIDTag),
  description: zod.string(),
  wireless: zod.optional(zod.string()),
});
export type CommunicationTypeInformationType = zod.infer<
  typeof CommunicationTypeInformationSchema
>;
export const SoftwareTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareTypeEnum.Software),
});
export type SoftwareTypeInformationType = zod.infer<
  typeof SoftwareTypeInformationSchema
>;
export const SkillsoftTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareTypeEnum.Skillsoft),
});
export type SkillsoftTypeInformationType = zod.infer<
  typeof SkillsoftTypeInformationSchema
>;

const electronicTypeInformation = zod
  .discriminatedUnion("type", [
    CommlinkTypeInformationSchema,
    CyberdeckTypeInformationSchema,
    RFIDTypeInformationSchema,
    CommunicationTypeInformationSchema,
    SoftwareTypeInformationSchema,
    SkillsoftTypeInformationSchema,
  ])
  .transform(
    (
      input
    ):
      | CommlinkTypeInformationType
      | CyberdeckTypeInformationType
      | RFIDTypeInformationType
      | CommunicationTypeInformationType
      | SoftwareTypeInformationType
      | SkillsoftTypeInformationType => {
      return input;
    }
  );

export const MatrixSchema = zod.object({
  typeInformation: electronicTypeInformation,
  name: zod.string(),
  rating: zod.optional(RatingSchema),
  availability: AvailabilitySchema,
  cost: CostSchema,
  attributeArray: zod.optional(CyberdeckAttributeArraySchema),
  programs: zod.optional(zod.number()),
});
export type MatrixType = zod.infer<typeof MatrixSchema>;

export const CredStickTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareAccessoryTypeEnum.CredStick),
  maxValue: zod.number(),
});
export type CredStickTypeInformationType = zod.infer<
  typeof CredStickTypeInformationSchema
>;
export const IdentificationTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareAccessoryTypeEnum.Identification),
  description: zod.string(),
  wireless: zod.optional(zod.string()),
});
export type IdentificationTypeInformationType = zod.infer<
  typeof IdentificationTypeInformationSchema
>;
export const ToolTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareAccessoryTypeEnum.Tool),
  description: zod.string(),
  wireless: zod.optional(zod.string()),
});
export type ToolTypeInformationType = zod.infer<
  typeof ToolTypeInformationSchema
>;
export const SecurityDeviceTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareAccessoryTypeEnum.SecurityDevice),
  description: zod.string(),
  wireless: zod.optional(zod.string()),
});
export type SecurityDeviceTypeInformationType = zod.infer<
  typeof SecurityDeviceTypeInformationSchema
>;
export const BreakingAndEnteringDeviceTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice),
  description: zod.string(),
  wireless: zod.optional(zod.string()),
});
export type BreakingAndEnteringDeviceTypeInformationType = zod.infer<
  typeof BreakingAndEnteringDeviceTypeInformationSchema
>;
export const OpticalDeviceTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareAccessoryTypeEnum.OpticalDevice),
  capacity: CapacitySchema,
  description: zod.string(),
  wireless: zod.optional(zod.string()),
});
export type OpticalDeviceTypeInformationType = zod.infer<
  typeof OpticalDeviceTypeInformationSchema
>;
export const VisionEnhancementTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareAccessoryTypeEnum.VisionEnhancement),
  capacity: CapacitySchema,
  description: zod.string(),
  wireless: zod.optional(zod.string()),
});
export type VisionEnhancementTypeInformationType = zod.infer<
  typeof VisionEnhancementTypeInformationSchema
>;
export const AudioDeviceTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareAccessoryTypeEnum.AudioDevice),
  capacity: CapacitySchema,
  description: zod.string(),
  wireless: zod.optional(zod.string()),
});
export type AudioDeviceTypeInformationType = zod.infer<
  typeof AudioDeviceTypeInformationSchema
>;
export const AudioEnhancementTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareAccessoryTypeEnum.AudioEnhancement),
  capacityCost: CostSchema,
  description: zod.string(),
  wireless: zod.optional(zod.string()),
});
export type AudioEnhancementTypeInformationType = zod.infer<
  typeof AudioEnhancementTypeInformationSchema
>;
export const SensorSchemaTypeInformationSchema = zod.object({
  type: zod.literal(matrixWareAccessoryTypeEnum.Sensor),
  capacity: CapacitySchema,
});
export type SensorSchemaTypeInformationType = zod.infer<
  typeof SensorSchemaTypeInformationSchema
>;

const electronicAccessoryTypeInformation = zod
  .discriminatedUnion("type", [
    CredStickTypeInformationSchema,
    IdentificationTypeInformationSchema,
    ToolTypeInformationSchema,
    SecurityDeviceTypeInformationSchema,
    BreakingAndEnteringDeviceTypeInformationSchema,
    OpticalDeviceTypeInformationSchema,
    VisionEnhancementTypeInformationSchema,
    AudioDeviceTypeInformationSchema,
    AudioEnhancementTypeInformationSchema,
    SensorSchemaTypeInformationSchema,
  ])
  .transform(
    (
      input
    ):
      | CredStickTypeInformationType
      | IdentificationTypeInformationType
      | ToolTypeInformationType
      | SecurityDeviceTypeInformationType
      | BreakingAndEnteringDeviceTypeInformationType
      | OpticalDeviceTypeInformationType
      | VisionEnhancementTypeInformationType
      | AudioDeviceTypeInformationType
      | AudioEnhancementTypeInformationType
      | SensorSchemaTypeInformationType => {
      return input;
    }
  );

export const MatrixAccessorySchema = zod.object({
  typeInformation: electronicAccessoryTypeInformation,
  name: zod.string(),
  rating: zod.optional(RatingSchema),
  availability: AvailabilitySchema,
  cost: CostSchema,
  attributeArray: zod.optional(CyberdeckAttributeArraySchema),
  programs: zod.optional(zod.number()),
});
export type MatrixAccessoryType = zod.infer<typeof MatrixAccessorySchema>;
