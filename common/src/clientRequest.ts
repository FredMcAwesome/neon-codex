import { type } from "arktype";

const LoginSchema = type({
  "+": "reject",
  username: "string > 0",
  password: "string > 0",
});
type LoginType = typeof LoginSchema.infer;

export type { LoginType };
export { LoginSchema };
