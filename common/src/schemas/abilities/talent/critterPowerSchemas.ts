import { type } from "arktype";
import {
  actionEnum,
  critterPowerEnum,
  durationEnum,
  sourceBookEnum,
  spellTypeEnum,
} from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { spellRangeSchema } from "./spellSchemas.js";

const CritterPowerRatingSchema = type.or(
  {
    critterRating: "true",
  },
  {
    maxRating: "number",
  }
);
export type CritterPowerRatingType = typeof CritterPowerRatingSchema.infer;

const CritterPowerTypeSchema = type.or(
  type.valueOf(spellTypeEnum),
  {
    spellType: "true",
  },
  {
    ritualType: "true",
  },
  {
    device: "true",
  },
  {
    host: "true",
  },
  {
    file: "true",
  },
  {
    persona: "true",
  },
  {
    personaOrDevice: "true",
  },
  {
    icon: "true",
  }
);

export type CritterPowerTypeType = typeof CritterPowerTypeSchema.infer;

const CritterActionSchema = type.or(type.valueOf(actionEnum), {
  ritualType: "true",
});
export type CritterActionType = typeof CritterActionSchema.infer;

const CritterPowerRangeSchema = type.or(
  {
    rangeCalc: spellRangeSchema,
  },
  {
    spellRange: "true",
  },
  {
    ritualRange: "true",
  },
  {
    magicMutliplied: "number",
  }
);
export type CritterPowerRangeType = typeof CritterPowerRangeSchema.infer;

const CritterPowerDurationSchema = type.or(
  type.valueOf(durationEnum),
  {
    spellDuration: "true",
  },
  {
    ritualDuration: "true",
  },
  {
    spriteDuration: "true",
  },
  {
    forceMultipliedTenCombatTurns: "true",
  }
);
export type CritterPowerDurationType = typeof CritterPowerDurationSchema.infer;

export const CritterPowerSchema = type({
  name: "string",
  description: "string",
  category: type.valueOf(critterPowerEnum),
  "karma?": "number",
  "rating?": CritterPowerRatingSchema,
  "type?": CritterPowerTypeSchema,
  "action?": CritterActionSchema,
  "range?": CritterPowerRangeSchema,
  "duration?": CritterPowerDurationSchema,
  "userSelectable?": "false",
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  "forbidden?": RequirementsSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type CritterPowerType = typeof CritterPowerSchema.infer;

export const CritterPowerListSchema = type(CritterPowerSchema.array());
export type CritterPowerListType = typeof CritterPowerListSchema.infer;
