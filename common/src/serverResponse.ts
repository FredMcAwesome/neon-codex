import { z as zod } from "zod";
import type {
  GearListType,
  MatrixListType,
  OtherGearListType,
} from "./schemas/gearSchemas.js";
import { MatrixListSchema } from "./schemas/gearSchemas.js";
import { GearListSchema } from "./schemas/gearSchemas.js";

const ThreadSummarySchema = zod
  .object({
    title: zod.string(),
    user: zod.string(),
    id: zod.number(),
  })
  .strict();
const ThreadListSchema = zod.array(ThreadSummarySchema);
type ThreadListType = zod.infer<typeof ThreadListSchema>;

const JwtTokenSchema = zod
  .object({
    token: zod.string(),
  })
  .strict();
type JwtTokenType = zod.infer<typeof JwtTokenSchema>;

export type {
  ThreadListType,
  JwtTokenType,
  MatrixListType,
  OtherGearListType,
  GearListType,
};
export { ThreadListSchema, JwtTokenSchema, MatrixListSchema, GearListSchema };
