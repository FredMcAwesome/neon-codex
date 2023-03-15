import { z as zod } from "zod";
import type {
  GearListType,
  MatrixListType,
  OtherGearListType,
  AugmentationListType,
} from "./schemas/gearSchemas.js";
import {
  MatrixListSchema,
  AugmentationListSchema,
} from "./schemas/gearSchemas.js";
import { GearListSchema } from "./schemas/gearSchemas.js";

const ThreadSummarySchema = zod.object({
  title: zod.string(),
  user: zod.string(),
  id: zod.number(),
});
const ThreadListSchema = zod.array(ThreadSummarySchema);
type ThreadListType = zod.infer<typeof ThreadListSchema>;

const JwtTokenSchema = zod.object({
  token: zod.string(),
});
type JwtTokenType = zod.infer<typeof JwtTokenSchema>;

export type {
  ThreadListType,
  JwtTokenType,
  MatrixListType,
  OtherGearListType,
  AugmentationListType,
  GearListType,
};
export {
  ThreadListSchema,
  JwtTokenSchema,
  MatrixListSchema,
  AugmentationListSchema,
  GearListSchema,
};
