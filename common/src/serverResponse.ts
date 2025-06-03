import { type } from "arktype";

const ThreadSummarySchema = type({
  title: "string",
  user: "string",
  id: "number",
});
const ThreadSummaryListSchema = ThreadSummarySchema.array();
type ThreadSummaryListType = typeof ThreadSummaryListSchema.infer;

const ThreadSchema = type({
  title: "string",
  username: "string",
  comments: type({
    username: "string",
    content: "string",
  }).array(),
});
type ThreadType = typeof ThreadSchema.infer;

const JwtTokenSchema = type({
  token: "string",
});
type JwtTokenType = typeof JwtTokenSchema.infer;

export type { ThreadSummaryListType, JwtTokenType, ThreadType };
export { ThreadSummaryListSchema, JwtTokenSchema, ThreadSchema };
