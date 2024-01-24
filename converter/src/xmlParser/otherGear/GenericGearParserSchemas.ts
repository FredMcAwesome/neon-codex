import { personaFormEnum } from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  GearXmlCategoryEnum,
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
  UseGearXmlSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

const GearXmlRatingSchema = zod.union([
  zod.number(),
  zod.literal("{Parent Rating}"),
]);
// zod.literal("Rating_Meters"),
// zod.literal("Rating_SqMeters"),
export type GearXmlRatingType = zod.infer<typeof GearXmlRatingSchema>;

const AddWeaponSchema = zod.union([
  zod.string(),
  zod
    .object({
      xmltext: zod.string(),
      _rating: zod.string(),
    })
    .strict(),
]);
export type AddWeaponType = zod.infer<typeof AddWeaponSchema>;

const WeaponXmlBonusSchema = zod
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
    smartlinkpool: zod.optional(zod.number()),
  })
  .strict();
export type WeaponXmlBonusType = zod.infer<typeof WeaponXmlBonusSchema>;

const AmmoForWeaponTypeXmlSchema = zod.union([
  zod.string(),
  zod
    .object({
      _noextra: zod.literal("True"),
      xmltext: zod.string(),
    })
    .strict(),
]);
export type AmmoForWeaponTypeXmlType = zod.infer<
  typeof AmmoForWeaponTypeXmlSchema
>;

const DeviceRatingXmlSchema = zod.union([
  zod.number(),
  zod.literal("Rating"),
  zod.literal("{Rating}"),
  zod.literal("{RES}"),
]);
export type DeviceRatingXmlType = zod.infer<typeof DeviceRatingXmlSchema>;

const GenericGearXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Category of gear
    category: zod.nativeEnum(GearXmlCategoryEnum),
    // Max rating
    rating: zod.optional(GearXmlRatingSchema),
    // Min rating
    minrating: zod.optional(zod.number()),
    // Label linked to what rating does for this gear
    ratinglabel: zod.optional(
      zod.union([zod.literal("Rating_SqMeters"), zod.literal("Rating_Meters")])
    ),
    // Add a weapon, this doesn't have to have the same name
    // as the gear name e.g. Survival Kit adds a Knife
    addweapon: zod.optional(AddWeaponSchema),
    // Allow addons of these category typee
    // e.g. Allow Toxins for injection darts,
    // Allow currency for a credstick,
    // Allow audio enhancements (pg 444 core rulebook) for microphones
    addoncategory: zod.optional(
      zod.union([
        zod.array(zod.nativeEnum(GearXmlCategoryEnum)),
        zod.nativeEnum(GearXmlCategoryEnum),
      ])
    ),
    // How many are bought at once
    costfor: zod.optional(zod.number()),
    // Bonus applied by gear
    bonus: zod.optional(BonusXmlSchema),
    // Modifies some attributes on the base weapon
    // ammoforweapontype should always be set when this is true
    weaponbonus: zod.optional(WeaponXmlBonusSchema),
    // This can be used by a weapon that can ONLY fire flechette
    // ammoforweapontype should always be set when this is true
    isflechetteammo: zod.optional(zod.literal("True")),
    // Modifies some attributes if weapon can ONLY fire flechette
    // isflechetteammo should always be set when this is true
    // if valid replaces weaponbonus if both are present
    flechetteweaponbonus: zod.optional(WeaponXmlBonusSchema),
    // This gear is ammo for a specific weapon type
    // If a weapon has weapontype set compare to that,
    // otherwise use some other heuristics to determine if this ammo
    // is useable in a weapon e.g. bolts have "crossbow"
    // Not entirely sure how the determination is done...
    ammoforweapontype: zod.optional(AmmoForWeaponTypeXmlSchema),
    // Weight of item, only seems to be listed for explosives
    // Not sure why every item doesn't have this
    weight: zod.optional(zod.union([zod.number(), zod.literal("Rating")])),
    // Not selectable
    hide: zod.optional(zod.literal("")),
    // Gear that can be added to this gear
    allowgear: zod.optional(
      zod
        .object({
          name: StringArrayOrStringSchema,
        })
        .strict()
    ),
    // Included gear
    gears: zod.optional(
      zod
        .object({
          usegear: zod.union([zod.array(UseGearXmlSchema), UseGearXmlSchema]),
          // Used if there is a long list of included gear
          _startcollapsed: zod.optional(zod.literal("True")),
        })
        .strict()
    ),
    // Matrix device rating
    devicerating: zod.optional(DeviceRatingXmlSchema),
    // Number of programs that can be run at one time on the deck
    programs: zod.optional(StringOrNumberSchema),
    // Cyberdeck attribute array
    attributearray: zod.optional(zod.string()),
    // The following are hardcoded attributes
    // You should have all of these or an attribute array
    // but not both for a cyberdeck.
    // Also used by rigger and technomancer stuff
    attack: zod.optional(zod.union([zod.number(), zod.literal("{CHA}")])),
    sleaze: zod.optional(zod.union([zod.number(), zod.literal("{INT}")])),
    dataprocessing: zod.optional(
      zod.union([zod.number(), zod.literal("{LOG}"), zod.literal("Rating")])
    ),
    firewall: zod.optional(
      zod.union([zod.number(), zod.literal("{WIL}"), zod.literal("Rating")])
    ),
    // Matrix device can form a persona
    canformpersona: zod.optional(zod.nativeEnum(personaFormEnum)),
    // Capacity Cost for gear
    capacity: zod.optional(StringOrNumberSchema),
    // Capacity Cost for gear (Not sure what difference is with above)
    armorcapacity: zod.optional(StringOrNumberSchema),
    // Requirements
    required: zod.optional(RequiredXmlSchema),
    // This gear needs a parent (not always clear what parent is?)
    // All Audio and Vision Enhancements should have this set
    // other categories can have this as well
    // For some reason armor enhancements don't have this set
    requireparent: zod.optional(zod.literal("")),
    // Forbidden
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
    // Modification to attribute array
    modattributearray: zod.optional(zod.string()),
    // Modification to attributes
    modattack: zod.optional(zod.union([zod.number(), zod.literal("{Rating}")])),
    modsleaze: zod.optional(zod.union([zod.number(), zod.literal("{Rating}")])),
    moddataprocessing: zod.optional(
      zod.union([zod.number(), zod.literal("{Rating}")])
    ),
    modfirewall: zod.optional(
      zod.union([zod.number(), zod.literal("{Rating}")])
    ),
    // Modify condition monitor boxes
    matrixcmbonus: zod.optional(zod.number()),
    // Allows extra text to be renamed (why isn't this always allowed)
    // Bonus should contain selecttext or similiar
    allowrename: zod.optional(zod.literal("True")),
    // Availability
    avail: StringOrNumberSchema,
    // Cost
    cost: StringOrNumberSchema,
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type GenericGearXmlType = zod.infer<typeof GenericGearXmlSchema>;
export const GenericGearListXmlSchema = zod.array(GenericGearXmlSchema);
export type GenericGearListXmlType = zod.infer<typeof GenericGearListXmlSchema>;
