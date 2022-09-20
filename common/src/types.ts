import { z as zod } from "zod";

const ExampleSchema = zod.object({
  example: zod.string(),
});

type Example = zod.infer<typeof ExampleSchema>;

export type { Example };
export { ExampleSchema };
