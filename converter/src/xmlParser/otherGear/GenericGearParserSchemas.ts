import { z as zod } from "zod";
import {
  BonusXmlSchema,
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
  UseGearXmlSchema,
} from "../ParserCommonDefines.js";

const GearRequiredGearDetailsPropertyStandardSchema = zod.union([
  zod
    .object({
      _operation: zod.string(),
      _NOT: zod.optional(zod.literal("")),
      xmltext: zod.optional(zod.union([zod.literal(0), zod.string()])),
    })
    .strict(),
  zod.literal(0),
]);

const GearDetailsPropertyUnionSchema = zod.union([
  GearRequiredGearDetailsPropertyStandardSchema,
  zod.array(GearRequiredGearDetailsPropertyStandardSchema),
]);

const NameUnionSchema = zod.union([
  StringArrayOrStringSchema,
  zod.array(
    zod.union([zod.string(), GearRequiredGearDetailsPropertyStandardSchema])
  ),
]);

const PartialGearRequiredInnerSchema = zod
  .object({
    category: zod.optional(StringArrayOrStringSchema),
    attributearray: zod.optional(
      zod
        .object({
          _operation: zod.string(),
          _NOT: zod.optional(zod.literal("")),
        })
        .strict()
    ),
    name: zod.optional(NameUnionSchema),
    NONE: zod.optional(zod.literal("")),
    attack: zod.optional(GearDetailsPropertyUnionSchema),
    sleaze: zod.optional(GearDetailsPropertyUnionSchema),
    dataprocessing: zod.optional(GearDetailsPropertyUnionSchema),
    firewall: zod.optional(GearDetailsPropertyUnionSchema),
  })
  .strict();

type GearsRequiredInnerType = zod.infer<
  typeof PartialGearRequiredInnerSchema
> & {
  OR?: zod.infer<typeof GearRequiredInnerSchema> | undefined;
  AND?: zod.infer<typeof GearRequiredInnerSchema> | undefined;
};

const GearRequiredInnerSchema: zod.ZodType<GearsRequiredInnerType> =
  PartialGearRequiredInnerSchema.extend({
    OR: zod.optional(zod.lazy(() => GearRequiredInnerSchema)),
    AND: zod.optional(zod.lazy(() => GearRequiredInnerSchema)),
  }).strict();

const GenericGearRequiredXmlSchema = zod
  .object({
    geardetails: zod.optional(GearRequiredInnerSchema),
    parentdetails: zod.optional(
      zod
        .object({
          name: zod.string(),
          category: zod.optional(zod.string()),
        })
        .strict()
    ),
    oneof: zod.optional(
      zod
        .object({
          quality: zod.string(),
        })
        .strict()
    ),
  })
  .strict();

const GenericGearXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    category: zod.string(),
    rating: zod.optional(StringOrNumberSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
    avail: StringOrNumberSchema,
    addweapon: zod.optional(
      zod.union([
        zod.string(),
        zod
          .object({
            xmltext: zod.string(),
            _rating: zod.string(),
          })
          .strict(),
      ])
    ),
    bonus: zod.optional(BonusXmlSchema),
    addoncategory: zod.optional(StringArrayOrStringSchema),
    cost: StringOrNumberSchema,
    costfor: zod.optional(zod.number()),
    weaponbonus: zod.optional(
      zod
        .object({
          ap: zod.optional(zod.number()),
          apreplace: zod.optional(zod.number()),
          damage: zod.optional(StringOrNumberSchema),
          damagereplace: zod.optional(zod.string()),
          damagetype: zod.optional(zod.string()),
          modereplace: zod.optional(zod.string()),
          userange: zod.optional(zod.string()),
          accuracy: zod.optional(zod.number()),
          accuracyreplace: zod.optional(zod.number()),
        })
        .strict()
    ),
    isflechetteammo: zod.optional(zod.literal("True")),
    flechetteweaponbonus: zod.optional(
      zod
        .object({
          ap: zod.optional(zod.number()),
          damage: zod.optional(zod.number()),
          damagetype: zod.string(),
        })
        .strict()
    ),
    ammoforweapontype: zod.optional(
      zod.union([
        zod.string(),
        zod
          .object({
            _noextra: zod.string(),
            xmltext: zod.optional(zod.string()),
          })
          .strict(),
      ])
    ),
    minrating: zod.optional(zod.number()),
    weight: zod.optional(zod.number()),
    hide: zod.optional(zod.literal("")),
    allowgear: zod.optional(
      zod
        .object({
          name: StringArrayOrStringSchema,
        })
        .strict()
    ),
    gears: zod.optional(
      zod
        .object({
          usegear: zod.union([zod.array(UseGearXmlSchema), UseGearXmlSchema]),
          _startcollapsed: zod.optional(zod.literal("True")),
        })
        .strict()
    ),
    devicerating: zod.optional(StringOrNumberSchema),
    attributearray: zod.optional(zod.string()),
    programs: zod.optional(StringOrNumberSchema),
    attack: zod.optional(StringOrNumberSchema),
    sleaze: zod.optional(StringOrNumberSchema),
    dataprocessing: zod.optional(StringOrNumberSchema),
    firewall: zod.optional(StringOrNumberSchema),
    canformpersona: zod.optional(zod.string()),
    armorcapacity: zod.optional(StringOrNumberSchema),
    capacity: zod.optional(StringOrNumberSchema),
    required: zod.optional(GenericGearRequiredXmlSchema),
    requireparent: zod.optional(zod.literal("")),
    forbidden: zod.optional(
      zod
        .object({
          geardetails: zod.union([
            zod
              .object({
                name: zod.string(),
              })
              .strict(),
            zod
              .object({
                OR: zod
                  .object({
                    name: StringArrayOrStringSchema,
                  })
                  .strict(),
              })
              .strict(),
          ]),
        })
        .strict()
    ),
    modattack: zod.optional(StringOrNumberSchema),
    modsleaze: zod.optional(StringOrNumberSchema),
    moddataprocessing: zod.optional(StringOrNumberSchema),
    modfirewall: zod.optional(StringOrNumberSchema),
    modattributearray: zod.optional(zod.string()),
    allowrename: zod.optional(zod.string()),
    matrixcmbonus: zod.optional(zod.number()),
  })
  .strict();
export type GenericGearXmlType = zod.infer<typeof GenericGearXmlSchema>;
export const GenericGearListXmlSchema = zod.array(GenericGearXmlSchema);
export type GenericGearListXmlType = zod.infer<typeof GenericGearListXmlSchema>;
