import { weaponSubtypeEnum, WeaponSubtypeSchema } from "@neon-codex/common";

import {
  xmlAllowGearSchema,
  IncludedGearXmlSchema,
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { MountSchema } from "@neon-codex/common";
import { type } from "arktype";

export enum weaponTypeXmlEnum {
  Melee = "melee",
  Exotic = "exotic",
  Bow = "bow",
  Crossbow = "crossbow",
  Taser = "taser",
  Gun = "gun",
  Cannon = "cannon",
  Flame = "flame",
  Energy = "energy",
  GLauncher = "glauncher",
  MLauncher = "mlauncher",
  Squirtgun = "squirtgun",
  Gasgun = "gasgun",
  Trackstopper = "trackstopper",
  Harpoongun = "harpoongun",
  Netgun = "netgun",
  Netgunxl = "netgunxl",
  Gyrojet = "gyrojet",
  Bola = "bola",
  Torpglauncher = "torpglauncher",
  Microtorpedo = "microtorpedo",
  Flaregun = "flaregun",
  Supermach = "supermach",
  FirefightingCannons = "firefighting cannons",
  Pepperpunch = "pepperpunch",
  Spraypen = "spraypen",
  Slingshot = "slingshot",
  Grapplegun = "grapplegun",
  Dartgun = "dartgun",
  Man_Catcher = "man-catcher",
  Spinstorm = "spinstorm",
}

const AccessoryXmlSchema = type({
  "+": "reject",
  name: "string",
  "mount?": type.or(MountSchema, MountSchema.array()),
  "rating?": "number",
  "gears?": IncludedGearXmlSchema,
});
export type AccessoryXmlType = typeof AccessoryXmlSchema.infer;

const UnderbarrelXmlSchema = type({
  "+": "reject",
  underbarrel: StringArrayOrStringSchema,
});
export const AccuracyXmlSchema = StringOrNumberSchema;
export type AccuracyXmlType = typeof AccuracyXmlSchema.infer;

export const DamageXmlSchema = type.or("string", "0");
export type DamageXmlType = typeof DamageXmlSchema.infer;

const AccessoryListXmlSchema = type.or(
  AccessoryXmlSchema,
  AccessoryXmlSchema.array()
);
export type AccessoryListXmlType = typeof AccessoryListXmlSchema.infer;

const WeaponXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Melee or ranged weapon
  type: type.or("'Ranged'", "'Melee'"),
  // Weapon type, e.g blades, shotguns
  // there are some special cases like underbarrel which don't
  // give all the information you would want here
  // gear is a special option that means it could be a missile
  // or grenade
  category: WeaponSubtypeSchema,
  // Dice pool penalty to notice the weapon when it is being hidden (bonus is negative for conceal)
  conceal: "number",
  // Accuracy acts as a limit for weapon tests
  accuracy: AccuracyXmlSchema,
  // Weapon reach, 0 for non-melee weapons
  reach: "number",
  // Weapon damage, damage type (physical or stun),
  // annotation (fire, flechette, electrical), and
  // and relevant explosive radius or decreasing damage per radius
  damage: DamageXmlSchema,
  // Armour penetration
  ap: StringOrNumberSchema,
  // Weapon firing mode, nil for melee weapons, otherwise
  // (Single Shot, Semi-Automatic, Burst Fire, Full Auto)
  mode: type.or("string", "0"),
  // Recoil Compensation, this is without any weapon attachments
  // so can be different than book
  rc: type.or("number", "'-'"),
  // Amount of ammo that can be held and the reload method
  // Also states if multiple barrels are needed
  // If a melee weapon has ammo it means it has some form of special ammunition e.g. an electrical charge
  // the requireammo tag must be false for melee weapons
  ammo: StringOrNumberSchema,
  // Melee weapons with special ammo need this to be false, the micro-torpedo launcher has microtorpedo
  "requireammo?": type.or("'False'", "'microtorpedo'"),
  // Weapon availability
  avail: StringOrNumberSchema,
  // Weapon cost
  cost: StringOrNumberSchema,
  // Included weapon accessories, where they are mounted (if appropriate),
  // their rating (if appropriate), and any gear included with that accessory
  "accessories?": type({ "+": "reject", accessory: AccessoryListXmlSchema }),
  // All mounts available for accessories
  // this includes any already used by an included accessory
  "accessorymounts?": type({
    "+": "reject",
    mount: type.or(MountSchema.array(), MountSchema),
  }),
  // Lists other weapons that this weapon can be used as
  // for example a club that is melee and can also be thrown
  // with 2 separate stat blocks would apply here
  "addweapon?": StringArrayOrStringSchema,
  // Indicates this weapon doesn't allow accessories
  // there is one case where it is true, but this weapon
  // cannot have accessories added normally, as it is a
  // cyberweapon that needs an implant
  "allowaccessory?": type.or("'True'", "'False'"),
  // Gear that can be added to this weapon,
  // only used to add poison to an injector pen
  "allowgear?": xmlAllowGearSchema,
  // Ammo type if different than weapon type or for exotic ranged weapons
  "ammocategory?": type.valueOf(weaponSubtypeEnum),
  // This is maybe redundant as ammo already says if multiple barrels are in use
  "ammoslots?": "number",
  // This weapon is cyberware
  // Important as some cyber implant weapons do not have the
  // Cyberweapon category
  "cyberware?": "'True'",
  // This weapon is not selectable, it can be unlocked by other means
  // e.g. Cyber Implant
  "hide?": "''",
  // This weapon is mounted on another weapon using this slot
  "mount?": MountSchema,
  // One extra mount slot required
  "extramount?": MountSchema,
  // Weapon range as per the Ranges.xml list
  "range?": "string",
  // Alternative ranges, for example harpoon range underwater
  "alternaterange?": "string",
  // Host weapon requirements e.g. for underbarrel weapons
  "required?": RequiredXmlSchema,

  // These 3 are specifically used for Hammerli Gemini
  // A normal attack uses 2 ammo
  "singleshot?": "2",
  // An optional short burst which uses 6 ammo
  "shortburst?": "6",
  // These accessory mount(s) cost double
  "doubledcostaccessorymounts?": type({
    "+": "reject",
    mount: type.or(MountSchema, MountSchema.array()),
  }),
  // Can be mounted as though it were a weapon of this type, used for vehicle mounts
  "sizecategory?": "string",
  // Allows weapon specialisations when the weapon name and category do not match
  // the specialisation from a skill
  "spec?": "string",
  // Another specialisation that could apply to the weapon
  "spec2?": "string",
  // Underbarrel weapon included in gun
  "underbarrels?": UnderbarrelXmlSchema,
  // Normally the skill used is the category, this overrides that
  // used when weapon is marked as gear or item specifically says to use another skill
  "useskill?": "string",
  // Same as spec as far as I can tell?
  // If spec is also present this must match it
  // spec2 and this cannot both be present
  "useskillspec?": "string",
  // This tag indicates that there is a specific ammo in gear.xml
  // that matches this weapontype and to use this tag instead of other
  // ways to indentify the ammo type needed
  "weapontype?": type.valueOf(weaponTypeXmlEnum),
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
export type WeaponXmlType = typeof WeaponXmlSchema.infer;
export const WeaponListXmlSchema = type(WeaponXmlSchema.array());
export type WeaponListXmlType = typeof WeaponListXmlSchema.infer;
