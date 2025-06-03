import {
  augmentationGradeEnum,
  equipmentPackCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import { UseGearXmlSchema } from "../common/ParserCommonDefines.js";
import { MountSchema } from "@neon-codex/common/build/schemas/shared/weaponSharedSchemas.js";
import { type } from "arktype";

const ArmorModEquipmentPackXmlSchema = type({
  name: "string",
  "rating?": "number",
});
const ArmorEquipmentPackXmlSchema = type({
  name: "string",
  "mods?": {
    mod: type.or(
      ArmorModEquipmentPackXmlSchema,
      ArmorModEquipmentPackXmlSchema.array()
    ),
  },
  "gears?": {
    gear: UseGearXmlSchema,
  },
});
export type ArmorEquipmentPackXmlType =
  typeof ArmorEquipmentPackXmlSchema.infer;

const BiowareEquipmentPackXmlSchema = type({
  name: "string",
  grade: type.valueOf(augmentationGradeEnum),
  "rating?": "number",
});
export type BiowareEquipmentPackXmlType =
  typeof BiowareEquipmentPackXmlSchema.infer;

const CyberwareEquipmentPackXmlSchema = type({
  name: "string",
  grade: type.valueOf(augmentationGradeEnum),
  "rating?": "number",
  "gears?": {
    gear: UseGearXmlSchema,
  },
  "cyberwares?": {
    cyberware: type.or(
      {
        name: "string",
        "rating?": "number",
      },
      type({
        name: "string",
        "rating?": "number",
      }).array()
    ),
  },
});
export type CyberwareEquipmentPackXmlType =
  typeof CyberwareEquipmentPackXmlSchema.infer;

const WeaponAccessoryEquipmentPackXmlSchema = type({
  name: "string",
  mount: "string",
});
const WeaponEquipmentPackXmlSchema = type({
  name: "string",
  "accessories?": {
    accessory: type.or(
      WeaponAccessoryEquipmentPackXmlSchema,
      WeaponAccessoryEquipmentPackXmlSchema.array()
    ),
  },
});
export type WeaponEquipmentPackXmlType =
  typeof WeaponEquipmentPackXmlSchema.infer;

const VehicleEquipmentPackXmlSchema = type({
  name: "string",
  "gears?": {
    gear: UseGearXmlSchema,
  },
  "weapons?": {
    weapon: type.or(
      WeaponEquipmentPackXmlSchema,
      WeaponEquipmentPackXmlSchema.array()
    ),
  },
});
export type VehicleEquipmentPackXmlType =
  typeof VehicleEquipmentPackXmlSchema.infer;

const EquipmentPackXmlSchema = type({
  name: "string",
  // Category of pack this is
  category: type.valueOf(equipmentPackCategoryEnum),
  // Nuyen (build points?)
  // Nuyen cost in karma (converted to nuyen)
  nuyenbp: "number",
  // Armour List
  "armors?": {
    armor: type.or(
      ArmorEquipmentPackXmlSchema,
      ArmorEquipmentPackXmlSchema.array()
    ),
  },
  // Biowares
  "biowares?": {
    bioware: type.or(
      BiowareEquipmentPackXmlSchema,
      BiowareEquipmentPackXmlSchema.array()
    ),
  },
  // Cyberwares
  "cyberwares?": {
    cyberware: type.or(
      CyberwareEquipmentPackXmlSchema,
      CyberwareEquipmentPackXmlSchema.array()
    ),
  },
  // Gears
  "gears?": {
    gear: UseGearXmlSchema,
  },
  // Vehicles
  "vehicles?": {
    vehicle: type.or(
      VehicleEquipmentPackXmlSchema,
      VehicleEquipmentPackXmlSchema.array()
    ),
  },
  // Weapons
  "weapons?": {
    weapon: type.or(
      WeaponEquipmentPackXmlSchema,
      WeaponEquipmentPackXmlSchema.array()
    ),
  },
  // Lifestyle
  "lifestyles?": {
    lifestyle: {
      // these are non-advanced lifestyles
      baselifestyle: "string",
      months: "number",
    },
  },
});
export type EquipmentPackXmlType = typeof EquipmentPackXmlSchema.infer;
export const EquipmentListXmlSchema = type(EquipmentPackXmlSchema.array());
export type EquipmentPackListXmlType = typeof EquipmentListXmlSchema.infer;
