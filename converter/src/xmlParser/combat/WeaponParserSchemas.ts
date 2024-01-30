import {
  weaponXmlSubtypeEnum,
  WeaponXmlSubtypeSchema,
} from "@neon-codex/common/build/schemas/commonSchemas.js";
import { MountSchema } from "@neon-codex/common/build/schemas/weaponSchemas.js";
import { z as zod } from "zod";
import {
  xmlAllowGearSchema,
  GearXmlSchema,
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

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

const AccessoryXmlSchema = zod
  .object({
    name: zod.string(),
    mount: zod.optional(zod.union([zod.array(MountSchema), MountSchema])),
    rating: zod.optional(zod.number()),
    gears: zod.optional(GearXmlSchema),
  })
  .strict();
export type AccessoryXmlType = zod.infer<typeof AccessoryXmlSchema>;

const UnderbarrelXmlSchema = zod
  .object({
    underbarrel: StringArrayOrStringSchema,
  })
  .strict();

const AccuracyXmlSchema = StringOrNumberSchema;
export type AccuracyXmlType = zod.infer<typeof AccuracyXmlSchema>;

const DamageXmlSchema = zod.union([zod.string(), zod.literal(0)]);
export type DamageXmlType = zod.infer<typeof DamageXmlSchema>;

const AccessoriesXmlSchema = zod.union([
  zod.array(AccessoryXmlSchema),
  AccessoryXmlSchema,
]);
export type AccessoriesXmlType = zod.infer<typeof AccessoriesXmlSchema>;

const WeaponXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Melee or ranged weapon
    type: zod.union([zod.literal("Ranged"), zod.literal("Melee")]),
    // Weapon type, e.g blades, shotguns
    // there are some special cases like underbarrel which don't
    // give all the information you would want here
    // gear is a special option that means it could be a missile
    // or grenade
    category: WeaponXmlSubtypeSchema,
    // Dice pool penalty to notice the weapon when it is being hidden (bonus is negative for conceal)
    conceal: zod.number(),
    // Accuracy acts as a limit for weapon tests
    accuracy: AccuracyXmlSchema,
    // Weapon reach, 0 for non-melee weapons
    reach: zod.number(),
    // Weapon damage, damage type (physical or stun),
    // annotation (fire, flechette, electrical), and
    // and relevant explosive radius or decreasing damage per radius
    damage: DamageXmlSchema,
    // Armour penetration
    ap: StringOrNumberSchema,
    // Weapon firing mode, nil for melee weapons, otherwise
    // (Single Shot, Semi-Automatic, Burst Fire, Full Auto)
    mode: zod.union([zod.string(), zod.literal(0)]),
    // Recoil Compensation, this is without any weapon attachments
    // so can be different than book
    rc: zod.union([zod.number(), zod.literal("-")]),
    // Amount of ammo that can be held and the reload method
    // Also states if multiple barrels are needed
    // If a melee weapon has ammo it means it has some form of special ammunition e.g. an electrical charge
    // the requireammo tag must be false for melee weapons
    ammo: StringOrNumberSchema,
    // Melee weapons with special ammo need this to be false, the micro-torpedo launcher has microtorpedo
    requireammo: zod.optional(
      zod.union([zod.literal("False"), zod.literal("microtorpedo")])
    ),
    // Weapon availability
    avail: StringOrNumberSchema,
    // Weapon cost
    cost: StringOrNumberSchema,
    // Included weapon accessories, where they are mounted (if appropriate),
    // their rating (if appropriate), and any gear included with that accessory
    accessories: zod.optional(
      zod
        .object({
          accessory: AccessoriesXmlSchema,
        })
        .strict()
    ),
    // All mounts available for accessories
    // this includes any already used by an included accessory
    accessorymounts: zod.optional(
      zod
        .object({
          mount: zod.union([zod.array(MountSchema), MountSchema]),
        })
        .strict()
    ),
    // Lists other weapons that this weapon can be used as
    // for example a club that is melee and can also be thrown
    // with 2 separate stat blocks would apply here
    addweapon: zod.optional(StringArrayOrStringSchema),
    // Indicates this weapon doesn't allow accessories
    // there is one case where it is true, but this weapon
    // cannot have accessories added normally, as it is a
    // cyberweapon that needs an implant
    allowaccessory: zod.optional(
      zod.union([zod.literal("True"), zod.literal("False")])
    ),
    // Gear that can be added to this weapon,
    // only used to add poison to an injector pen
    allowgear: zod.optional(xmlAllowGearSchema),
    // Ammo type if different than weapon type or for exotic ranged weapons
    ammocategory: zod.optional(zod.nativeEnum(weaponXmlSubtypeEnum)),
    // This is maybe redundant as ammo already says if multiple barrels are in use
    ammoslots: zod.optional(zod.number()),
    // This weapon is cyberware
    // Important as some cyber implant weapons do not have the
    // Cyberweapon category
    cyberware: zod.optional(zod.literal("True")),
    // This weapon is not selectable, it can be unlocked by other means
    // e.g. Cyber Implant
    hide: zod.optional(zod.literal("")),
    // This weapon is mounted on another weapon using this slot
    mount: zod.optional(MountSchema),
    // One extra mount slot required
    extramount: zod.optional(MountSchema),
    // Weapon range as per the Ranges.xml list
    range: zod.optional(zod.string()),
    // Alternative ranges, for example harpoon range underwater
    alternaterange: zod.optional(zod.string()),
    // Host weapon requirements e.g. for underbarrel weapons
    required: zod.optional(RequiredXmlSchema),

    // These 3 are specifically used for Hammerli Gemini
    // A normal attack uses 2 ammo
    singleshot: zod.optional(zod.literal(2)),
    // An optional short burst which uses 6 ammo
    shortburst: zod.optional(zod.literal(6)),
    // These accessory mount(s) cost double
    doubledcostaccessorymounts: zod.optional(
      zod
        .object({
          mount: zod.union([zod.array(MountSchema), MountSchema]),
        })
        .strict()
    ),
    // Can be mounted as though it were a weapon of this type, used for vehicle mounts
    sizecategory: zod.optional(zod.string()),
    // Allows weapon specialisations when the weapon name and category do not match
    // the specialisation from a skill
    spec: zod.optional(zod.string()),
    // Another specialisation that could apply to the weapon
    spec2: zod.optional(zod.string()),
    // Underbarrel weapon included in gun
    underbarrels: zod.optional(UnderbarrelXmlSchema),
    // Normally the skill used is the category, this overrides that
    // used when weapon is marked as gear or item specifically says to use another skill
    useskill: zod.optional(zod.string()),
    // Same as spec as far as I can tell?
    // If spec is also present this must match it
    // spec2 and this cannot both be present
    useskillspec: zod.optional(zod.string()),
    // This tag indicates that there is a specific ammo in gear.xml
    // that matches this weapontype and to use this tag instead of other
    // ways to indentify the ammo type needed
    weapontype: zod.optional(zod.nativeEnum(weaponTypeXmlEnum)),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type WeaponXmlType = zod.infer<typeof WeaponXmlSchema>;
export const WeaponListXmlSchema = zod.array(WeaponXmlSchema);
export type WeaponListXmlType = zod.infer<typeof WeaponListXmlSchema>;
