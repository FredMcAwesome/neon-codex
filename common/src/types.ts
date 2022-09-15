import { z as zod } from "zod";

const ExampleSchema = zod.object({
  example: zod.string(),
});

type Example = zod.infer<typeof ExampleSchema>;

const ThreadSummarySchema = zod.object({
  title: zod.string(),
  user: zod.string(),
  id: zod.number(),
});

const ThreadListSchema = zod.array(ThreadSummarySchema);

type ThreadListType = zod.infer<typeof ThreadListSchema>;

export type { Example, ThreadListType };
export { ExampleSchema, ThreadListSchema };
