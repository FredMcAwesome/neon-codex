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

const electronicTypeInformation = zod.discriminatedUnion("type", [
  zod.object({
    type: zod.literal(matrixWareTypeEnum.Commlink),
  }),
  zod.object({
    type: zod.literal(matrixWareTypeEnum.Cyberdeck),
    attributeArray: CyberdeckAttributeArraySchema,
    programs: zod.number(),
  }),
  zod.object({
    type: zod.literal(matrixWareTypeEnum.RFIDTag),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  }),
  zod.object({
    type: zod.literal(matrixWareTypeEnum.CommunicationCountermeasure),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  }),
  zod.object({
    type: zod.literal(matrixWareTypeEnum.Software),
  }),
  zod.object({
    type: zod.literal(matrixWareTypeEnum.Skillsoft),
  }),
]);

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

const electronicAccessoryTypeInformation = zod.discriminatedUnion("type", [
  zod.object({
    type: zod.literal(matrixWareAccessoryTypeEnum.CredStick),
    maxValue: zod.number(),
  }),
  zod.object({
    type: zod.literal(matrixWareAccessoryTypeEnum.Identification),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  }),
  zod.object({
    type: zod.literal(matrixWareAccessoryTypeEnum.Tool),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  }),
  zod.object({
    type: zod.literal(matrixWareAccessoryTypeEnum.OpticalDevice),
    capacity: CapacitySchema,
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  }),
  zod.object({
    type: zod.literal(matrixWareAccessoryTypeEnum.VisionEnhancement),
    capacity: CapacitySchema,
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  }),
  zod.object({
    type: zod.literal(matrixWareAccessoryTypeEnum.AudioDevice),
    capacity: CapacitySchema,
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  }),
  zod.object({
    type: zod.literal(matrixWareAccessoryTypeEnum.AudioEnhancement),
    capacityCost: CostSchema,
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  }),
  zod.object({
    type: zod.literal(matrixWareAccessoryTypeEnum.Sensor),
    capacity: CapacitySchema,
  }),
  zod.object({
    type: zod.literal(matrixWareAccessoryTypeEnum.SecurityDevice),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  }),
  zod.object({
    type: zod.literal(matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  }),
]);

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
