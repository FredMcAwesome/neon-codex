import { z as zod } from "zod";
import {
  mathOperatorEnum,
  qualityCategoryEnum,
  standardCalculationEnum,
} from "@neon-codex/common/build/enums.js";
import {
  BonusXmlSchema,
  type BonusXmlType,
} from "../common/BonusParserSchemas.js";
import {
  RequiredXmlSchema,
  type RequiredXmlType,
} from "../common/RequiredParserSchemas.js";
import {
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";

export type GenericXmlParsingType =
  | { option: standardCalculationEnum }
  | { operator: mathOperatorEnum }
  | string
  | number;

export type GenericArrayXmlParsingType = Array<GenericXmlParsingType>;

const NaturalWeaponSchema = zod
  .object({
    name: zod.string(),
    reach: zod.number(),
    damage: zod.string(),
    ap: zod.number(),
    useskill: zod.string(),
    accuracy: zod.string(),
    source: zod.string(),
    page: zod.number(),
  })
  .strict();

const QualitySubBonusXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Category of quality
    category: zod.nativeEnum(qualityCategoryEnum),
    // Karma cost to aquire (negative for negative qualities)
    karma: zod.number(),
    // Only able to gain this quality at character creation
    chargenonly: zod.optional(zod.literal("")),
    // How many times can be taken at chargen
    chargenlimit: zod.optional(zod.number()),
    // Does not contribute to the Positive/Negative Karma limit
    // at Character Creation, these only have a karma cost
    // when using the point buy chargen system
    contributetolimit: zod.optional(zod.literal("False")),
    // Can't be taken at chargen
    careeronly: zod.optional(zod.literal("")),
    // prevents quality costing double if bought after chargen
    doublecareer: zod.optional(zod.literal("False")),
    // The limit (or lackthere of) to the number of times
    // this quality can be taken
    limit: zod.optional(StringOrNumberSchema),
    // Other qualities that count to this quality's limit
    includeinlimit: zod.optional(
      zod
        .object({
          name: StringArrayOrStringSchema,
        })
        .strict()
    ),
    // The number of times the quality can be taken when
    // including all includeinlimit qualities, the limit
    // in this case only refers to the current quality
    // This requires includeinlimit to be defined
    limitwithinclusions: zod.optional(zod.number()),
    // If using priority/sum to ten these can only be selected
    // through the table, not as a quality later
    onlyprioritygiven: zod.optional(zod.literal("")),
    // Different name on the book page
    nameonpage: zod.optional(zod.string()),
    // If requirement is met get the set value discoutt
    costdiscount: zod.optional(
      zod
        .object({
          required: RequiredXmlSchema,
          value: zod.number(),
        })
        .strict()
    ),
    // Each time this quality is selected it gives a non-stacking
    // bonus, e.g. restrictedgear allows a different gear to be
    // selected each time
    nolevels: zod.optional(zod.literal("")),
    // Bonus is only applied the first time this quality is taken
    firstlevelbonus: zod.optional(
      zod.union([
        zod
          .object({
            // Increase to Notoriety level
            notoriety: zod.number(),
          })
          .strict(),
        zod
          .object({
            // prevents attribute maximum/s from being increased
            attributemaxclamp: StringArrayOrStringSchema,
          })
          .strict(),
      ])
    ),
    // Add custom natural weapons
    // Chummer doesn't want them as weapons, I do
    naturalweapons: zod.optional(
      zod
        .object({
          naturalweapon: zod.union([
            zod.array(NaturalWeaponSchema),
            NaturalWeaponSchema,
          ]),
        })
        .strict()
    ),
    // Add weapon
    addweapon: zod.optional(StringArrayOrStringSchema),
    // This is a metagenic quality, only matters if another
    // quality gives a metageniclimit (in bonus)
    metagenic: zod.optional(zod.literal("True")),
    // Presumably this is not fully implemented in chummer?
    // TODO: implement these in chummer
    implemented: zod.optional(zod.string()),
    // Unsure if this is needed, don't we always refund?
    // Only used for Latent Dracomorphosis
    refundkarmaonremove: zod.optional(zod.literal("")),
    // Unsure what this does, only used for dracoforms
    stagedpurchase: zod.optional(zod.literal("True")),
    // Spell points are described in FA pg 31, it essentially
    // allows spells to be transferred to karma, chummer calls
    // this karma spell points
    canbuywithspellpoints: zod.optional(zod.literal("True")),
    // Karma used to be called Build Points (BP) in previous editions
    // In this case it means you don't get the karma bonus if
    // bought during chargen, in career mode you still get it though
    contributetobp: zod.optional(zod.literal("False")),
    // Not selectable
    hide: zod.optional(zod.literal("")),
    source: zod.string(),
    page: zod.number(),
  })
  .strict();

type QualitySubBonusXmlType = zod.infer<typeof QualitySubBonusXmlSchema>;

// Need to split up type/annotate schema to avoid TS7056 error
export type QualityXmlType = QualitySubBonusXmlType & {
  bonus?: BonusXmlType | undefined;
  required?: RequiredXmlType | undefined;
  forbidden?: RequiredXmlType | undefined;
};
const QualityXmlSchema: zod.ZodSchema<QualityXmlType> =
  QualitySubBonusXmlSchema.extend({
    // Bonus applied by Cyberware
    bonus: zod.optional(BonusXmlSchema),
    // Required
    required: zod.optional(RequiredXmlSchema),
    // Forbidden
    forbidden: zod.optional(RequiredXmlSchema),
  });

export const QualityListXmlSchema = zod.array(QualityXmlSchema);
