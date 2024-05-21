import { z as zod } from "zod";
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

export const CritterPowerSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(critterPowerEnum),
    karma: zod.optional(zod.number()),
    rating: zod.optional(
      zod.union([
        zod
          .object({
            critterRating: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            maxRating: zod.number(),
          })
          .strict(),
      ])
    ),
    type: zod.optional(
      zod.union([
        zod.nativeEnum(spellTypeEnum),
        zod
          .object({
            spellType: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            ritualType: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            device: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            host: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            file: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            persona: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            personaOrDevice: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            icon: zod.literal(true),
          })
          .strict(),
      ])
    ),
    action: zod.optional(
      zod.union([
        zod.nativeEnum(actionEnum),
        zod
          .object({
            ritualType: zod.literal(true),
          })
          .strict(),
      ])
    ),
    range: zod.optional(
      zod.union([
        zod
          .object({
            rangeCalc: spellRangeSchema,
          })
          .strict(),
        zod
          .object({
            spellRange: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            ritualRange: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            magicMutliplied: zod.number(),
          })
          .strict(),
      ])
    ),
    duration: zod.optional(
      zod.union([
        zod.nativeEnum(durationEnum),
        zod
          .object({
            spellDuration: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            ritualDuration: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            spriteDuration: zod.literal(true),
          })
          .strict(),
        zod
          .object({
            forceMultipliedTenCombatTurns: zod.literal(true),
          })
          .strict(),
      ])
    ),
    userSelectable: zod.optional(zod.literal(false)),
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    forbidden: zod.optional(RequirementsSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type CritterPowerType = zod.infer<typeof CritterPowerSchema>;

export const CritterPowerListSchema = zod.array(CritterPowerSchema);
export type CritterPowerListType = zod.infer<typeof CritterPowerListSchema>;
