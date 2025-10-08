import { type } from "arktype";

const GenericModSchema = type({
  "+": "reject",
  baseMod: "string",
  "rating?": "number",
});
export const GenericModListSchema = type(GenericModSchema.array());
export type GenericModListType = typeof GenericModListSchema.infer;
