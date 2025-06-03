import { type } from "arktype";

const RatingLiteralSchema = type("'Rating'");

type RatingLiteralType = typeof RatingLiteralSchema.infer;

export type { RatingLiteralType };
export { RatingLiteralSchema };
