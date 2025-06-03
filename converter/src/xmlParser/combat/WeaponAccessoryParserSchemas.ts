import { type } from "arktype";
import {
  SourceXmlSchema,
  IncludedGearXmlSchema,
  StringOrNumberSchema,
  NumberOrRatingSchema,
  xmlAllowGearSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

const AccessoryAccuracyXmlSchema = type("number");
export type AccessoryAccuracyXmlType = typeof AccessoryAccuracyXmlSchema;

const AccessoryDamageXmlSchema = type("number");
export type AccessoryDamageXmlType = typeof AccessoryDamageXmlSchema.infer;

const WeaponAccessoryXmlSchema = type({
  id: "string",
  name: "string",
  // Maximum accessory rating, 0 when not applicable
  rating: "number",
  // Bonus/penalty to weapon accuracy
  "accuracy?": AccessoryAccuracyXmlSchema,
  // Bonus/penalty to weapon damage
  "damage?": AccessoryDamageXmlSchema,
  // Changes weapon damage type from stun to physical
  "damagetype?": "'P'",
  // Bonus/penalty to weapon reach
  "reach?": "number",
  // Bonus/penalty to weapon armour penetration (bonus is negative for ap)
  "ap?": "number",
  // Bonus/penalty to weapon recoil compensation
  "rangemodifier?": "number",
  // Bonus/penalty to weapon conceal (bonus is negative for conceal)
  // sometimes using + for positive sometimes not... though zod ignores the +
  "conceal?": NumberOrRatingSchema,
  // Bonus/penalty to weapon recoil compensation
  "rc?": "number",
  // Type of recoil compensation,
  // items from the same rcgroup are incompatible with each other
  "rcgroup?": "number",
  // Recoil compensation is only available when item is deployed
  // e.g. tripod out and braced on ground, or folding stock out and braced on shoulder
  "rcdeployable?": "'True'",
  // Availability, can be a modifier to base weapon availability
  avail: StringOrNumberSchema,
  // Cost
  cost: StringOrNumberSchema,
  // Modifies the cost to add accesories to a weapon
  // this should really be under a trait category
  "accessorycostmultiplier?": "number",
  // Gear included with the weapon
  "gears?": IncludedGearXmlSchema,
  // Gear that can be added to the weapon accessory
  "allowgear?": xmlAllowGearSchema,
  // Requires the special modification quality
  "specialmodification?": "'True'",
  // Adds an additional ammo slot to a weapon
  // this is usually combined with ammo replace to provide a different reload method/ammo type
  "ammoslots?": "1",
  // Replace the original reload/ammo type with this one
  "ammoreplace?": StringOrNumberSchema,
  // Modifies the ammo capacity of all ammo slots currently in use
  // (I should put this and ammo bonus together)
  "modifyammocapacity?": "string",
  // Modifies the ammo capacity, normally by a percentage amount
  // For explosive magazine this instead modifies it by -2 bullets
  "ammobonus?": StringOrNumberSchema,
  // Mount locations required to add accessory
  // For a few accessories this is one of a few locations
  "mount?": type.or("string", "''"),
  // Second mount location, seems to be an error here
  // sometimes there are 2 options for mount and extramount, when there should just be 1 in each
  "extramount?": "string",
  // this item is not selectable i.e. only used when weapon includes it
  "hide?": "''",
  // Add an underbarrel weapon to the host weapon
  // This should really only be used for Krim Stun-O-Net
  // but could maybe be removed even from that
  // Normally you add underbarrel weapons and then they are linked as accessories separately
  "addunderbarrels?": {
    weapon: "string",
  },
  // Requirements on host weapon
  "required?": RequiredXmlSchema,
  // Host weapon cannot have these traits
  "forbidden?": RequiredXmlSchema,
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
export type WeaponAccessoryXmlType = typeof WeaponAccessoryXmlSchema.infer;
export const WeaponAccessoryListXmlSchema = type(
  WeaponAccessoryXmlSchema.array()
);
export type WeaponAccessoryListXmlType =
  typeof WeaponAccessoryListXmlSchema.infer;
