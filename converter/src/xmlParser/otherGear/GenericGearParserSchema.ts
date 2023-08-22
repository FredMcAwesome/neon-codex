import { z as zod } from "zod";
import {
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
  UseGearXmlSchema,
} from "../ParserCommonDefines.js";

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
    bonus: zod.optional(
      zod.union([
        zod
          .object({
            selectweapon: zod.optional(
              zod.union([
                zod
                  .object({
                    _weapondetails: zod.string(),
                  })
                  .strict(),
                zod.literal(""),
              ])
            ),
            selecttext: zod.optional(
              zod.union([
                zod.string(),
                zod
                  .object({
                    _xml: zod.string(),
                    _xpath: zod.string(),
                    _allowedit: zod.optional(zod.string()),
                  })
                  .strict(),
              ])
            ),
          })
          .strict(),
        zod.literal(""),
      ])
    ),
    addoncategory: zod.optional(StringArrayOrStringSchema),
    cost: StringOrNumberSchema,
    costfor: zod.optional(zod.number()),
    weaponbonus: zod.optional(
      zod
        .object({
          ap: zod.optional(zod.number()),
          damage: zod.optional(StringOrNumberSchema),
        })
        .strict()
    ),
    isflechetteammo: zod.optional(zod.literal("True")),
    flechetteweaponbonus: zod.optional(
      zod
        .object({
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
    required: zod.optional(
      zod
        .object({
          geardetails: zod.optional(
            zod.union([
              zod
                .object({
                  OR: zod
                    .object({
                      category: zod.optional(StringArrayOrStringSchema),
                      name: zod.optional(StringArrayOrStringSchema),
                    })
                    .strict(),
                })
                .strict(),
              zod
                .object({
                  category: zod.optional(StringArrayOrStringSchema),
                })
                .strict(),
            ])
          ),
          parentdetails: zod.optional(
            zod
              .object({
                name: zod.string(),
                category: zod.optional(zod.string()),
              })
              .strict()
          ),
        })
        .strict()
    ),
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
