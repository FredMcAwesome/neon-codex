import { z as zod } from "zod";

const ExampleSchema = zod
  .object({
    example: zod.string(),
  })
  .strict();

type Example = zod.infer<typeof ExampleSchema>;

export type { Example };
export { ExampleSchema };
