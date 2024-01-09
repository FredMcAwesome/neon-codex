import { z as zod } from "zod";

const RatingLiteralSchema = zod.literal("Rating");

type RatingLiteralType = zod.infer<typeof RatingLiteralSchema>;

export type { RatingLiteralType };
export { RatingLiteralSchema };
