import {
  mathOperatorEnum,
  standardCalculationEnum,
} from "@neon-codex/common/build/enums.js";
import { z as zod } from "zod";
import { BonusXmlWrappedSchema } from "../common/BonusParserSchemas.js";
import { StringArrayOrStringSchema } from "../common/ParserCommonDefines.js";

export type GenericXmlParsingType =
  | { option: standardCalculationEnum }
  | { operator: mathOperatorEnum }
  | string
  | number;

export type GenericArrayXmlParsingType = Array<GenericXmlParsingType>;

const MetatypeXmlMovementSchema = zod.union([
  // Formatted like: Ground/Water/Air speed
  zod.string(),
  zod
    .object({
      // Alt text is for shapeshifters (the orignal form speeds)
      _alt: zod.string(),
      xmltext: zod.string(),
    })
    .strict(),
]);
export type MetatypeXmlMovementType = zod.infer<
  typeof MetatypeXmlMovementSchema
>;

const MetatypeXmlQualitySingleSchema = zod.union([
  zod
    .object({
      // At least one of these optional must be implemented for xmltext to be valid
      _removable: zod.optional(zod.literal("True")),
      _select: zod.optional(zod.string()),
      xmltext: zod.string(),
    })
    .strict(),
  zod.string(),
]);

const MetatypeXmlQualitiesSingularSchema = zod
  .object({
    quality: zod.union([
      zod.array(MetatypeXmlQualitySingleSchema),
      MetatypeXmlQualitySingleSchema,
    ]),
  })
  .strict();
export type MetatypeXmlQualitiesSingularType = zod.infer<
  typeof MetatypeXmlQualitiesSingularSchema
>;

const MetatypeXmlQualitiesSchema = zod
  .object({
    // one of either positive or negative must be defined
    positive: zod.optional(MetatypeXmlQualitiesSingularSchema),
    negative: zod.optional(MetatypeXmlQualitiesSingularSchema),
  })
  .strict();
export type MetatypeXmlQualitiesType = zod.infer<
  typeof MetatypeXmlQualitiesSchema
>;

const MetatypeXmlPowerSchema = zod.union([
  zod
    .object({
      _select: zod.string(),
      xmltext: zod.string(),
    })
    .strict(),
  zod.string(),
]);

const BaseMetatypeXmlSubBonusSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Karma cost for point buy
    karma: zod.number(),
    halveattributepoints: zod.optional(zod.literal("")),
    // optional for metavariants only
    category: zod.optional(zod.string()),
    // Body
    bodmin: zod.number(),
    bodmax: zod.number(),
    // Augmented maximum
    bodaug: zod.number(),
    // Agility
    agimin: zod.number(),
    agimax: zod.number(),
    agiaug: zod.number(),
    // Reaction
    reamin: zod.number(),
    reamax: zod.number(),
    reaaug: zod.number(),
    // Strength
    strmin: zod.number(),
    strmax: zod.number(),
    straug: zod.number(),
    // Charisma
    chamin: zod.number(),
    chamax: zod.number(),
    chaaug: zod.number(),
    // Intuition
    intmin: zod.number(),
    intmax: zod.number(),
    intaug: zod.number(),
    // Logic
    logmin: zod.number(),
    logmax: zod.number(),
    logaug: zod.number(),
    // Willpower
    wilmin: zod.number(),
    wilmax: zod.number(),
    wilaug: zod.number(),
    // Initiative
    inimin: zod.number(),
    inimax: zod.number(),
    iniaug: zod.number(),
    // Edge
    edgmin: zod.number(),
    edgmax: zod.number(),
    edgaug: zod.number(),
    // Magic
    magmin: zod.number(),
    magmax: zod.number(),
    magaug: zod.number(),
    // Resonance
    resmin: zod.number(),
    resmax: zod.number(),
    resaug: zod.number(),
    // Essence
    essmin: zod.number(),
    essmax: zod.number(),
    essaug: zod.number(),
    // Depth
    depmin: zod.number(),
    depmax: zod.number(),
    depaug: zod.number(),
    // Additional initiative dice
    // Only used in metavariants (this should probably be moved into bonus tag)
    initiativedice: zod.optional(zod.number()),
    // Doesn't have normal movement e.g. An AI program doesn't have a physical body
    movement: zod.optional(zod.literal("Special")),
    // Movement speeds
    // optional for metavariants only
    walk: zod.optional(MetatypeXmlMovementSchema),
    run: zod.optional(MetatypeXmlMovementSchema),
    sprint: zod.optional(MetatypeXmlMovementSchema),
    // Add a natural weapon
    addweapon: zod.optional(StringArrayOrStringSchema),
    // Included powers
    powers: zod.optional(
      zod
        .object({
          power: zod.union([
            zod.array(MetatypeXmlPowerSchema),
            MetatypeXmlPowerSchema,
          ]),
        })
        .strict()
    ),
    // Included qualities
    qualities: zod.optional(MetatypeXmlQualitiesSchema),
    // Illegal qualities
    qualityrestriction: zod.optional(MetatypeXmlQualitiesSchema),
    source: zod.string(),
    page: zod.number(),
  })
  .strict();

// Need to split up type/annotate schema to avoid TS7056 error
type BaseMetatypeXmlSubBonusShape = typeof BaseMetatypeXmlSubBonusSchema.shape;
type BonusXmlWrappedShape = typeof BonusXmlWrappedSchema.shape;
type BaseMetatypeXmlShape = BaseMetatypeXmlSubBonusShape & BonusXmlWrappedShape;
const BaseMetatypeXmlSchema: zod.ZodObject<BaseMetatypeXmlShape> =
  BaseMetatypeXmlSubBonusSchema.merge(BonusXmlWrappedSchema);
export type BaseMetatypeXmlType = zod.infer<typeof BaseMetatypeXmlSchema>;

export const MetatypeXmlSchema = BaseMetatypeXmlSchema.extend({
  // metavariants of the base form
  metavariants: zod.optional(
    zod
      .object({
        metavariant: zod.union([
          BaseMetatypeXmlSchema,
          zod.array(BaseMetatypeXmlSchema),
        ]),
      })
      .strict()
  ),
}).strict();

export type MetatypeXmlType = zod.infer<typeof MetatypeXmlSchema>;
export const MetatypeListXmlSchema = zod.array(MetatypeXmlSchema);
