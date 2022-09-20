import { z as zod } from "zod";
const LoginSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
});

type LoginType = zod.infer<typeof LoginSchema>;

export type { LoginType };
export { LoginSchema };
