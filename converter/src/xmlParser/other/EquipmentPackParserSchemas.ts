import {
  augmentationGradeEnum,
  equipmentPackCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import { UseGearXmlSchema } from "../common/ParserCommonDefines.js";
import { MountSchema } from "@neon-codex/common/build/schemas/shared/weaponSharedSchemas.js";
import { type } from "arktype";

const ArmorModEquipmentPackXmlSchema = type({
  "+": "reject",
  name: "string",
  "rating?": "number",
});
const ArmorEquipmentPackXmlSchema = type({
  "+": "reject",
  name: "string",
  "mods?": type({
    "+": "reject",
    mod: type.or(
      ArmorModEquipmentPackXmlSchema,
      ArmorModEquipmentPackXmlSchema.array()
    ),
  }),
  "gears?": type({
    "+": "reject",
    gear: UseGearXmlSchema,
  }),
});
export type ArmorEquipmentPackXmlType =
  typeof ArmorEquipmentPackXmlSchema.infer;

const BiowareEquipmentPackXmlSchema = type({
  "+": "reject",
  name: "string",
  grade: type.valueOf(augmentationGradeEnum),
  "rating?": "number",
});
export type BiowareEquipmentPackXmlType =
  typeof BiowareEquipmentPackXmlSchema.infer;

const CyberwareEquipmentPackXmlSchema = type({
  "+": "reject",
  name: "string",
  grade: type.valueOf(augmentationGradeEnum),
  "rating?": "number",
  "gears?": type({
    "+": "reject",
    gear: UseGearXmlSchema,
  }),
  "cyberwares?": type({
    "+": "reject",
    cyberware: type.or(
      type({
        "+": "reject",
        name: "string",
        "rating?": "number",
      }),
      type({ "+": "reject", name: "string", "rating?": "number" }).array()
    ),
  }),
});
export type CyberwareEquipmentPackXmlType =
  typeof CyberwareEquipmentPackXmlSchema.infer;

const WeaponAccessoryEquipmentPackXmlSchema = type({
  "+": "reject",
  name: "string",
  mount: "string",
});
const WeaponEquipmentPackXmlSchema = type({
  "+": "reject",
  name: "string",
  "accessories?": type({
    "+": "reject",
    accessory: type.or(
      WeaponAccessoryEquipmentPackXmlSchema,
      WeaponAccessoryEquipmentPackXmlSchema.array()
    ),
  }),
});
export type WeaponEquipmentPackXmlType =
  typeof WeaponEquipmentPackXmlSchema.infer;

const VehicleEquipmentPackXmlSchema = type({
  "+": "reject",
  name: "string",
  "gears?": type({
    "+": "reject",
    gear: UseGearXmlSchema,
  }),
  "weapons?": type({
    "+": "reject",
    weapon: type.or(
      WeaponEquipmentPackXmlSchema,
      WeaponEquipmentPackXmlSchema.array()
    ),
  }),
});
export type VehicleEquipmentPackXmlType =
  typeof VehicleEquipmentPackXmlSchema.infer;

const EquipmentPackXmlSchema = type({
  "+": "reject",
  name: "string",
  // Category of pack this is
  category: type.valueOf(equipmentPackCategoryEnum),
  // Nuyen (build points?)
  // Nuyen cost in karma (converted to nuyen)
  nuyenbp: "number",
  // Armour List
  "armors?": type({
    "+": "reject",
    armor: type.or(
      ArmorEquipmentPackXmlSchema,
      ArmorEquipmentPackXmlSchema.array()
    ),
  }),
  // Biowares
  "biowares?": type({
    "+": "reject",
    bioware: type.or(
      BiowareEquipmentPackXmlSchema,
      BiowareEquipmentPackXmlSchema.array()
    ),
  }),
  // Cyberwares
  "cyberwares?": type({
    "+": "reject",
    cyberware: type.or(
      CyberwareEquipmentPackXmlSchema,
      CyberwareEquipmentPackXmlSchema.array()
    ),
  }),
  // Gears
  "gears?": type({
    "+": "reject",
    gear: UseGearXmlSchema,
  }),
  // Vehicles
  "vehicles?": type({
    "+": "reject",
    vehicle: type.or(
      VehicleEquipmentPackXmlSchema,
      VehicleEquipmentPackXmlSchema.array()
    ),
  }),
  // Weapons
  "weapons?": type({
    "+": "reject",
    weapon: type.or(
      WeaponEquipmentPackXmlSchema,
      WeaponEquipmentPackXmlSchema.array()
    ),
  }),
  // Lifestyle
  "lifestyles?": type({
    "+": "reject",
    lifestyle: type({
      "+": "reject",
      // these are non-advanced lifestyles
      baselifestyle: "string",
      months: "number",
    }),
  }),
});
export type EquipmentPackXmlType = typeof EquipmentPackXmlSchema.infer;
export const EquipmentListXmlSchema = type(EquipmentPackXmlSchema.array());
export type EquipmentPackListXmlType = typeof EquipmentListXmlSchema.infer;
