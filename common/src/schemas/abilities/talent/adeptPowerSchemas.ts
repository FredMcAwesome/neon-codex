import { type } from "arktype";
import { actionEnum, sourceBookEnum } from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";

export const AdeptPowerSchema = type({
  name: "string",
  description: "string",
  pointCost: "number",
  "extraFirstLevelPointCost?": "number",
  levels: "boolean",
  limit: "number",
  "sharedLimitAdeptPowerList?": "string[]",
  "action?": type.valueOf(actionEnum),
  "adeptWay?": {
    pointCost: "number",
    "requirements?": RequirementsSchema,
  },
  "doubleCost?": "false",
  "maxLevels?": "number",
  "userSelectable?": "false",
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  "forbidden?": RequirementsSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type AdeptPowerType = typeof AdeptPowerSchema.infer;

export const AdeptPowerListSchema = type(AdeptPowerSchema.array());
export type AdeptPowerListType = typeof AdeptPowerListSchema.infer;
