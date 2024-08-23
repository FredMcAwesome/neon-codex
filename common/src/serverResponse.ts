import { z as zod } from "zod";

const ThreadSummarySchema = zod
  .object({
    title: zod.string(),
    user: zod.string(),
    id: zod.number(),
  })
  .strict();
const ThreadSummaryListSchema = zod.array(ThreadSummarySchema);
type ThreadSummaryListType = zod.infer<typeof ThreadSummaryListSchema>;

const ThreadSchema = zod
  .object({
    title: zod.string(),
    username: zod.string(),
    comments: zod.array(
      zod
        .object({
          username: zod.string(),
          content: zod.string(),
        })
        .strict()
    ),
  })
  .strict();
type ThreadType = zod.infer<typeof ThreadSchema>;

const JwtTokenSchema = zod
  .object({
    token: zod.string(),
  })
  .strict();
type JwtTokenType = zod.infer<typeof JwtTokenSchema>;

export type { ThreadSummaryListType, JwtTokenType, ThreadType };
export { ThreadSummaryListSchema, JwtTokenSchema, ThreadSchema };
