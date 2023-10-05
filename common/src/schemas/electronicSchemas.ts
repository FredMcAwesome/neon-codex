import { z as zod } from "zod";
import {
  costElectronicEnum,
  mathOperatorEnum,
  matrixWareAccessoryTypeEnum,
  matrixWareTypeEnum,
  restrictionEnum,
} from "../enums.js";
import {
  RatingSchema,
  CapacitySchema,
  AvailabilityRatingSchema,
} from "./commonSchemas.js";

export const AvailabilityElectronicSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityElectronicType = zod.infer<
  typeof AvailabilityElectronicSchema
>;

const InnerCostElectronicSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costElectronicEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CostElectronicType = Array<
  | zod.infer<typeof InnerCostElectronicSchema>
  | { subnumbers: CostElectronicType }
>;
export const CostElectronicSchema: zod.ZodType<CostElectronicType> = zod.array(
  zod.union([
    InnerCostElectronicSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => CostElectronicSchema),
      })
      .strict(),
  ])
);

export const CyberdeckAttributeArraySchema = zod.array(zod.number()).length(4);
export type CyberdeckAttributeArrayType = zod.infer<
  typeof CyberdeckAttributeArraySchema
>;

export const CommlinkTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareTypeEnum.Commlink),
  })
  .strict();
export type CommlinkTypeInformationType = zod.infer<
  typeof CommlinkTypeInformationSchema
>;
export const CyberdeckTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareTypeEnum.Cyberdeck),
    attributeArray: CyberdeckAttributeArraySchema,
    programs: zod.number(),
  })
  .strict();
export type CyberdeckTypeInformationType = zod.infer<
  typeof CyberdeckTypeInformationSchema
>;
export const RFIDTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareTypeEnum.CommunicationCountermeasure),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type RFIDTypeInformationType = zod.infer<
  typeof RFIDTypeInformationSchema
>;
export const CommunicationTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareTypeEnum.RFIDTag),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type CommunicationTypeInformationType = zod.infer<
  typeof CommunicationTypeInformationSchema
>;
export const SoftwareTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareTypeEnum.Software),
  })
  .strict();
export type SoftwareTypeInformationType = zod.infer<
  typeof SoftwareTypeInformationSchema
>;
export const SkillsoftTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareTypeEnum.Skillsoft),
  })
  .strict();
export type SkillsoftTypeInformationType = zod.infer<
  typeof SkillsoftTypeInformationSchema
>;

export const ElectronicTypeInformationSchema = zod
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

export type electronicTypeInformationType = zod.infer<
  typeof ElectronicTypeInformationSchema
>;
export const MatrixSchema = zod
  .object({
    typeInformation: ElectronicTypeInformationSchema,
    name: zod.string(),
    rating: zod.optional(RatingSchema),
    availability: AvailabilityElectronicSchema,
    cost: CostElectronicSchema,
    attributeArray: zod.optional(CyberdeckAttributeArraySchema),
    programs: zod.optional(zod.number()),
  })
  .strict();
export type MatrixType = zod.infer<typeof MatrixSchema>;

export const CredStickTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareAccessoryTypeEnum.CredStick),
    maxValue: zod.number(),
  })
  .strict();
export type CredStickTypeInformationType = zod.infer<
  typeof CredStickTypeInformationSchema
>;
export const IdentificationTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareAccessoryTypeEnum.Identification),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type IdentificationTypeInformationType = zod.infer<
  typeof IdentificationTypeInformationSchema
>;
export const ToolTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareAccessoryTypeEnum.Tool),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type ToolTypeInformationType = zod.infer<
  typeof ToolTypeInformationSchema
>;
export const SecurityDeviceTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareAccessoryTypeEnum.SecurityDevice),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type SecurityDeviceTypeInformationType = zod.infer<
  typeof SecurityDeviceTypeInformationSchema
>;
export const BreakingAndEnteringDeviceTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type BreakingAndEnteringDeviceTypeInformationType = zod.infer<
  typeof BreakingAndEnteringDeviceTypeInformationSchema
>;
export const OpticalDeviceTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareAccessoryTypeEnum.OpticalDevice),
    capacity: CapacitySchema,
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type OpticalDeviceTypeInformationType = zod.infer<
  typeof OpticalDeviceTypeInformationSchema
>;
export const VisionEnhancementTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareAccessoryTypeEnum.VisionEnhancement),
    capacity: CapacitySchema,
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type VisionEnhancementTypeInformationType = zod.infer<
  typeof VisionEnhancementTypeInformationSchema
>;
export const AudioDeviceTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareAccessoryTypeEnum.AudioDevice),
    capacity: CapacitySchema,
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type AudioDeviceTypeInformationType = zod.infer<
  typeof AudioDeviceTypeInformationSchema
>;
export const AudioEnhancementTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareAccessoryTypeEnum.AudioEnhancement),
    capacityCost: CostElectronicSchema,
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type AudioEnhancementTypeInformationType = zod.infer<
  typeof AudioEnhancementTypeInformationSchema
>;
export const SensorSchemaTypeInformationSchema = zod
  .object({
    type: zod.literal(matrixWareAccessoryTypeEnum.Sensor),
    capacity: CapacitySchema,
  })
  .strict();
export type SensorSchemaTypeInformationType = zod.infer<
  typeof SensorSchemaTypeInformationSchema
>;

export const ElectronicAccessoryTypeInformationSchema = zod
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
export type electronicAccessoryTypeInformationType = zod.infer<
  typeof ElectronicAccessoryTypeInformationSchema
>;

export const MatrixAccessorySchema = zod
  .object({
    name: zod.string(),
    typeInformation: ElectronicAccessoryTypeInformationSchema,
    rating: zod.optional(RatingSchema),
    availability: AvailabilityElectronicSchema,
    cost: CostElectronicSchema,
    attributeArray: zod.optional(CyberdeckAttributeArraySchema),
    programs: zod.optional(zod.number()),
  })
  .strict();
export type MatrixAccessoryType = zod.infer<typeof MatrixAccessorySchema>;
