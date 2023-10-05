import { z as zod } from "zod";
import {
  ModRecursiveXmlSchema,
  SourceXmlSchema,
  StringOrNumberSchema,
  UseGearXmlSchema,
} from "../common/ParserCommonDefines.js";

const WeaponMountXmlSchema = zod
  .object({
    control: zod.string(),
    flexibility: zod.string(),
    size: zod.string(),
    visibility: zod.string(),
    allowedweapons: zod.optional(zod.string()),
    mods: zod.optional(zod.object({ mod: zod.string() }).strict()),
  })
  .strict();

const GearOtherXmlSchema = zod.union([
  zod
    .object({
      xmltext: zod.string(),
      _select: zod.optional(zod.string()),
      _rating: zod.optional(zod.string()),
      _consumecapacity: zod.optional(zod.string()),
      _costfor: zod.optional(zod.string()),
    })
    .strict(),
  zod.string(),
]);

const GearCombinedSchema = zod.union([UseGearXmlSchema, GearOtherXmlSchema]);

const VehicleXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    accel: StringOrNumberSchema,
    armor: zod.number(),
    avail: StringOrNumberSchema,
    body: zod.number(),
    category: zod.string(),
    cost: StringOrNumberSchema,
    handling: StringOrNumberSchema,
    pilot: zod.number(),
    sensor: zod.number(),
    speed: StringOrNumberSchema,
    powertrainmodslots: zod.optional(zod.number()),
    protectionmodslots: zod.optional(zod.number()),
    bodymodslots: zod.optional(zod.number()),
    electromagneticmodslots: zod.optional(zod.number()),
    cosmeticmodslots: zod.optional(zod.number()),
    gears: zod.optional(
      zod
        .object({
          gear: zod.union([zod.array(GearCombinedSchema), GearCombinedSchema]),
        })
        .strict()
    ),
    mods: zod.optional(
      zod.union([
        zod.array(ModRecursiveXmlSchema),
        ModRecursiveXmlSchema,
        zod.literal(""),
      ])
    ),
    modslots: zod.optional(zod.number()),
    seats: zod.optional(StringOrNumberSchema),
    weapons: zod.optional(
      zod
        .object({
          weapon: zod.union([
            zod.array(
              zod
                .object({
                  name: zod.string(),
                })
                .strict()
            ),
            zod
              .object({
                name: zod.string(),
              })
              .strict(),
          ]),
        })
        .strict()
    ),
    weaponmounts: zod.optional(
      zod
        .object({
          weaponmount: zod.union([
            zod.array(WeaponMountXmlSchema),
            WeaponMountXmlSchema,
          ]),
        })
        .strict()
    ),
    weaponmodslots: zod.optional(zod.number()),
    hide: zod.optional(zod.literal("")),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type VehicleXmlType = zod.infer<typeof VehicleXmlSchema>;
export const VehicleListXmlSchema = zod.array(VehicleXmlSchema);
export type VehicleListXmlType = zod.infer<typeof VehicleListXmlSchema>;
