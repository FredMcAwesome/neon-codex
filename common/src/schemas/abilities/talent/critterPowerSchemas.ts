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
  type({
    "+": "reject",
    critterRating: "true",
  }),
  type({
    "+": "reject",
    maxRating: "number",
  })
);
export type CritterPowerRatingType = typeof CritterPowerRatingSchema.infer;

const CritterPowerTypeSchema = type.or(
  type.valueOf(spellTypeEnum),
  type({
    "+": "reject",
    spellType: "true",
  }),
  type({
    "+": "reject",
    ritualType: "true",
  }),
  type({
    "+": "reject",
    device: "true",
  }),
  type({
    "+": "reject",
    host: "true",
  }),
  type({
    "+": "reject",
    file: "true",
  }),
  type({
    "+": "reject",
    persona: "true",
  }),
  type({
    "+": "reject",
    personaOrDevice: "true",
  }),
  type({
    "+": "reject",
    icon: "true",
  })
);

export type CritterPowerTypeType = typeof CritterPowerTypeSchema.infer;

const CritterActionSchema = type.or(
  type.valueOf(actionEnum),
  type({
    "+": "reject",
    ritualType: "true",
  })
);
export type CritterActionType = typeof CritterActionSchema.infer;

const CritterPowerRangeSchema = type.or(
  type({
    "+": "reject",
    rangeCalc: spellRangeSchema,
  }),
  type({
    "+": "reject",
    spellRange: "true",
  }),
  type({
    "+": "reject",
    ritualRange: "true",
  }),
  type({
    "+": "reject",
    magicMutliplied: "number",
  })
);
export type CritterPowerRangeType = typeof CritterPowerRangeSchema.infer;

const CritterPowerDurationSchema = type.or(
  type.valueOf(durationEnum),
  type({
    "+": "reject",
    spellDuration: "true",
  }),
  type({
    "+": "reject",
    ritualDuration: "true",
  }),
  type({
    "+": "reject",
    spriteDuration: "true",
  }),
  type({
    "+": "reject",
    forceMultipliedTenCombatTurns: "true",
  })
);
export type CritterPowerDurationType = typeof CritterPowerDurationSchema.infer;

export const CritterPowerSchema = type({
  "+": "reject",
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
