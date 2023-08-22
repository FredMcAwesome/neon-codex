import { z as zod } from "zod";
const LoginSchema = zod
  .object({
    username: zod.string().min(1),
    password: zod.string().min(1),
  })
  .strict();

type LoginType = zod.infer<typeof LoginSchema>;

export type { LoginType };
export { LoginSchema };
