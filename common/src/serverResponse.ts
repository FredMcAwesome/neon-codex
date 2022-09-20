import { z as zod } from "zod";

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

export type { ThreadListType, JwtTokenType };
export { ThreadListSchema, JwtTokenSchema };
