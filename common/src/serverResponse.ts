import { z as zod } from "zod";
import { WeaponSummarySchema } from "./schemas/weaponSchemas.js";

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

const WeaponListSchema = zod.array(WeaponSummarySchema);
type WeaponListType = zod.infer<typeof WeaponListSchema>;

export type { ThreadListType, JwtTokenType, WeaponListType };
export { ThreadListSchema, JwtTokenSchema, WeaponListSchema };
