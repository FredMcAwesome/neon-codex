import { gearCategoryEnum } from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";
import {
  SourceXmlSchema,
  GearXmlSchema,
  StringOrNumberSchema,
  NumberOrRatingSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

const AccessoryAccuracyXmlSchema = zod.number();
export type AccessoryAccuracyXmlType = zod.infer<
  typeof AccessoryAccuracyXmlSchema
>;

const AccessoryDamageXmlSchema = zod.number();
export type AccessoryDamageXmlType = zod.infer<typeof AccessoryDamageXmlSchema>;

const WeaponAccessoryXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Maximum accessory rating, 0 when not applicable
    rating: zod.number(),
    // Bonus/penalty to weapon accuracy
    accuracy: zod.optional(AccessoryAccuracyXmlSchema),
    // Bonus/penalty to weapon damage
    damage: zod.optional(AccessoryDamageXmlSchema),
    // Changes weapon damage type from stun to physical
    damagetype: zod.optional(zod.literal("P")),
    // Bonus/penalty to weapon reach
    reach: zod.optional(zod.number()),
    // Bonus/penalty to weapon armour penetration (bonus is negative for ap)
    ap: zod.optional(zod.number()),
    // Bonus/penalty to weapon recoil compensation
    rangemodifier: zod.optional(zod.number()),
    // Bonus/penalty to weapon conceal (bonus is negative for conceal)
    // sometimes using + for positive sometimes not... though zod ignores the +
    conceal: zod.optional(NumberOrRatingSchema),
    // Bonus/penalty to weapon recoil compensation
    rc: zod.optional(zod.number()),
    // Type of recoil compensation,
    // items from the same rcgroup are incompatible with each other
    rcgroup: zod.optional(zod.number()),
    // Recoil compensation is only available when item is deployed
    // e.g. tripod out and braced on ground, or folding stock out and braced on shoulder
    rcdeployable: zod.optional(zod.literal("True")),
    // Availability, can be a modifier to base weapon availability
    avail: StringOrNumberSchema,
    // Cost
    cost: StringOrNumberSchema,
    // Modifies the cost to add accesories to a weapon
    // this should really be under a trait category
    accessorycostmultiplier: zod.optional(zod.number()),
    // Gear included with the weapon
    gears: zod.optional(GearXmlSchema),
    // Gear that can be added to the weapon accessory
    allowgear: zod.optional(
      zod
        .object({
          gearcategory: zod.union([
            zod.array(zod.nativeEnum(gearCategoryEnum)),
            zod.nativeEnum(gearCategoryEnum),
          ]),
        })
        .strict()
    ),
    // Requires the special modification quality
    specialmodification: zod.optional(zod.literal("True")),
    // Adds an additional ammo slot to a weapon
    // this is usually combined with ammo replace to provide a different reload method/ammo type
    ammoslots: zod.optional(zod.literal(1)),
    // Replace the original reload/ammo type with this one
    ammoreplace: zod.optional(StringOrNumberSchema),
    // Modifies the ammo capacity of all ammo slots currently in use
    // (I should put this and ammo bonus together)
    modifyammocapacity: zod.optional(zod.string()),
    // Modifies the ammo capacity, normally by a percentage amount
    // For explosive magazine this instead modifies it by -2 bullets
    ammobonus: zod.optional(StringOrNumberSchema),
    // Mount locations required to add accessory
    // For a few accessories this is one of a few locations
    mount: zod.optional(zod.union([zod.string(), zod.literal("")])),
    // Second mount location, seems to be an error here
    // sometimes there are 2 options for mount and extramount, when there should just be 1 in each
    extramount: zod.optional(zod.string()),
    // this item is not selectable i.e. only used when weapon includes it
    hide: zod.optional(zod.literal("")),
    // Add an underbarrel weapon to the host weapon
    // This should really only be used for Krim Stun-O-Net
    // but could maybe be removed even from that
    // Normally you add underbarrel weapons and then they are linked as accessories separately
    addunderbarrels: zod.optional(
      zod
        .object({
          weapon: zod.string(),
        })
        .strict()
    ),
    // Requirements on host weapon
    required: zod.optional(RequiredXmlSchema),
    // Host weapon cannot have these traits
    forbidden: zod.optional(RequiredXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type WeaponAccessoryXmlType = zod.infer<typeof WeaponAccessoryXmlSchema>;
export const WeaponAccessoryListXmlSchema = zod.array(WeaponAccessoryXmlSchema);
export type WeaponAccessoryListXmlType = zod.infer<
  typeof WeaponAccessoryListXmlSchema
>;
