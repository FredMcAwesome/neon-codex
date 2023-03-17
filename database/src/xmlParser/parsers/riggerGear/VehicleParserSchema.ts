import { z as zod } from "zod";
import { ModListXmlSchema } from "../combatGear/ArmourParserSchema.js";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
  UseGearXmlSchema,
} from "../ParserCommonDefines.js";

const WeaponMountXmlSchema = zod.object({
  control: zod.string(),
  flexibility: zod.string(),
  size: zod.string(),
  visibility: zod.string(),
});

const GearOtherXmlSchema = zod.union([
  zod.object({
    xmltext: zod.string(),
    _select: zod.optional(zod.string()),
    _rating: zod.optional(zod.string()),
  }),
  zod.string(),
]);

const GearCombinedSchema = zod.union([UseGearXmlSchema, GearOtherXmlSchema]);

const VehicleXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    page: zod.number(),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
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
      zod.object({
        gear: zod.union([zod.array(GearCombinedSchema), GearCombinedSchema]),
      })
    ),
    mods: zod.optional(
      zod.union([
        zod.array(ModListXmlSchema),
        ModListXmlSchema,
        zod.literal(""),
      ])
    ),
    modslots: zod.optional(zod.number()),
    seats: zod.optional(StringOrNumberSchema),
    weapons: zod.optional(
      zod.object({
        weapon: zod.union([
          zod.array(
            zod.object({
              name: zod.string(),
            })
          ),
          zod.object({
            name: zod.string(),
          }),
        ]),
      })
    ),
    weaponmounts: zod.optional(
      zod.object({
        weaponmount: zod.union([
          zod.array(WeaponMountXmlSchema),
          WeaponMountXmlSchema,
        ]),
      })
    ),
    weaponmodslots: zod.optional(zod.number()),
    hide: zod.optional(zod.literal("")),
  })
  .strict();
export type VehicleXmlType = zod.infer<typeof VehicleXmlSchema>;
export const VehicleListXmlSchema = zod.array(VehicleXmlSchema);
export type VehicleListXmlType = zod.infer<typeof VehicleListXmlSchema>;