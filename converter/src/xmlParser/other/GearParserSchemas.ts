import { personaFormEnum } from "@neon-codex/common";

import {
  BonusXmlSchema,
  WeaponXmlBonusSchema,
} from "../common/BonusParserSchemas.js";
import {
  gearXmlCategoryEnum,
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
  UseGearXmlSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { type } from "arktype";

const GearXmlRatingSchema = type.or("number", "'{Parent Rating}'");
export type GearXmlRatingType = typeof GearXmlRatingSchema.infer;

const AddWeaponSchema = type.or(
  "string",
  type({ "+": "reject", xmltext: "string", _rating: "string" })
);
export type AddWeaponType = typeof AddWeaponSchema.infer;

const AmmoForWeaponTypeXmlSchema = type.or(
  "string",
  type({ "+": "reject", _noextra: "'True'", xmltext: "string" })
);
export type AmmoForWeaponTypeXmlType = typeof AmmoForWeaponTypeXmlSchema.infer;

const DeviceRatingXmlSchema = type.or(
  "number",
  "'Rating'",
  "'{Rating}'",
  "'{RES}'"
);
export type DeviceRatingXmlType = typeof DeviceRatingXmlSchema.infer;

export const GearXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Category of gear
  category: type.valueOf(gearXmlCategoryEnum),
  // Max rating
  "rating?": GearXmlRatingSchema,
  // Min rating
  "minrating?": "number",
  // Label linked to what rating does for this gear
  "ratinglabel?": type.or(
    "'Rating_SqMeters'",
    "'Rating_Meters'",
    "'String_Force'",
    "'String_Force_Potency'"
  ),
  // Add a weapon, this doesn't have to have the same name
  // as the gear name e.g. Survival Kit adds a Knife
  "addweapon?": AddWeaponSchema,
  // Allow addons of these category typee
  // e.g. Allow Toxins for injection darts,
  // Allow currency for a credstick,
  // Allow audio enhancements (pg 444 core rulebook) for microphones
  "addoncategory?": type.or(
    type.valueOf(gearXmlCategoryEnum).array(),
    type.valueOf(gearXmlCategoryEnum)
  ),
  // How many are bought at once
  "costfor?": "number",
  // Bonus applied by gear
  "bonus?": BonusXmlSchema,
  // Modifies some attributes on the base weapon
  // ammoforweapontype should always be set when this is true
  "weaponbonus?": WeaponXmlBonusSchema,
  // This can be used by a weapon that can ONLY fire flechette
  // ammoforweapontype should always be set when this is true
  "isflechetteammo?": "'True'",
  // Modifies some attributes if weapon can ONLY fire flechette
  // isflechetteammo should always be set when this is true
  // if valid replaces weaponbonus if both are present
  "flechetteweaponbonus?": WeaponXmlBonusSchema,
  // This gear is ammo for a specific weapon type
  // If a weapon has weapontype set compare to that,
  // otherwise use some other heuristics to determine if this ammo
  // is useable in a weapon e.g. bolts have "crossbow"
  // Not entirely sure how the determination is done...
  "ammoforweapontype?": AmmoForWeaponTypeXmlSchema,
  // Weight of item, only seems to be listed for explosives
  // Not sure why every item doesn't have this
  "weight?": type.or("number", "'Rating'"),
  // Not selectable
  "hide?": "''",
  // Gear that can be added to this gear
  "allowgear?": type({ "+": "reject", name: StringArrayOrStringSchema }),
  // Included gear
  "gears?": type({
    "+": "reject",
    usegear: UseGearXmlSchema,
    // Used if there is a long list of included gear
    "_startcollapsed?": "'True'",
  }),

  // Matrix device rating
  "devicerating?": DeviceRatingXmlSchema,
  // Number of programs that can be run at one time on the deck
  "programs?": StringOrNumberSchema,
  // Cyberdeck attribute array
  "attributearray?": "string",
  // The following are hardcoded attributes
  // You should have all of these or an attribute array
  // but not both for a cyberdeck.
  // Also used by rigger and technomancer stuff
  "attack?": type.or("number", "'{CHA}'"),
  "sleaze?": type.or("number", "'{INT}'"),
  "dataprocessing?": type.or("number", "'{LOG}'", "'Rating'"),
  "firewall?": type.or("number", "'{WIL}'", "'Rating'"),
  // Matrix device can form a persona
  "canformpersona?": type.valueOf(personaFormEnum),
  // Capacity Cost for gear
  "capacity?": StringOrNumberSchema,
  // Capacity Cost for gear (Not sure what difference is with above)
  "armorcapacity?": StringOrNumberSchema,
  // Requirements
  "required?": RequiredXmlSchema,
  // This gear needs a parent (not always clear what parent is?)
  // All Audio and Vision Enhancements should have this set
  // other categories can have this as well
  // For some reason armor enhancements don't have this set
  "requireparent?": "''",
  // Forbidden
  "forbidden?": RequiredXmlSchema,
  //  type({ "+": "reject",
  //   geardetails: type.or(
  //     type({ "+": "reject",
  //       name: "string",
  //     }),
  //     type({ "+": "reject",
  //       OR: type({ "+": "reject",
  //         name: StringArrayOrStringSchema,
  //       }),
  //     })
  //   ),
  // }),
  // Modification to attribute array
  "modattributearray?": "string",
  // Modification to attributes
  "modattack?": type.or("number", "'{Rating}'"),
  "modsleaze?": type.or("number", "'{Rating}'"),
  "moddataprocessing?": type.or("number", "'{Rating}'"),
  "modfirewall?": type.or("number", "'{Rating}'"),
  // Modify condition monitor boxes
  "matrixcmbonus?": "number",
  // Allows extra text to be renamed (why isn't this always allowed)
  // Bonus should contain selecttext or similiar
  "allowrename?": "'True'",
  // Availability
  avail: StringOrNumberSchema,
  // Cost
  cost: StringOrNumberSchema,
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
export type GearXmlType = typeof GearXmlSchema.infer;
export const GearListXmlSchema = type(GearXmlSchema.array());
export type GearListXmlType = typeof GearListXmlSchema.infer;
