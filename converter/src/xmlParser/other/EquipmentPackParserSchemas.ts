import { z as zod } from "zod";
import {
  augmentationGradeEnum,
  equipmentPackCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import { UseGearXmlSchema } from "../common/ParserCommonDefines.js";
import { MountSchema } from "@neon-codex/common/build/schemas/shared/weaponSharedSchemas.js";

const ArmorModEquipmentPackXmlSchema = zod
  .object({
    name: zod.string(),
    rating: zod.optional(zod.number()),
  })
  .strict();
const ArmorEquipmentPackXmlSchema = zod
  .object({
    name: zod.string(),
    mods: zod.optional(
      zod
        .object({
          mod: zod.union([
            ArmorModEquipmentPackXmlSchema,
            zod.array(ArmorModEquipmentPackXmlSchema),
          ]),
        })
        .strict()
    ),
    gears: zod.optional(
      zod
        .object({
          gear: UseGearXmlSchema,
        })
        .strict()
    ),
  })
  .strict();
export type ArmorEquipmentPackXmlType = zod.infer<
  typeof ArmorEquipmentPackXmlSchema
>;

const BiowareEquipmentPackXmlSchema = zod
  .object({
    name: zod.string(),
    grade: zod.nativeEnum(augmentationGradeEnum),
    rating: zod.optional(zod.number()),
  })
  .strict();
export type BiowareEquipmentPackXmlType = zod.infer<
  typeof BiowareEquipmentPackXmlSchema
>;

const CyberwareEquipmentPackXmlSchema = zod
  .object({
    name: zod.string(),
    grade: zod.nativeEnum(augmentationGradeEnum),
    rating: zod.optional(zod.number()),
    gears: zod.optional(
      zod
        .object({
          gear: UseGearXmlSchema,
        })
        .strict()
    ),
    cyberwares: zod.optional(
      zod
        .object({
          cyberware: zod.lazy(() =>
            zod.union([
              zod
                .object({
                  name: zod.string(),
                  rating: zod.optional(zod.number()),
                })
                .strict(),
              zod.array(
                zod
                  .object({
                    name: zod.string(),
                    rating: zod.optional(zod.number()),
                  })
                  .strict()
              ),
            ])
          ),
        })
        .strict()
    ),
  })
  .strict();
export type CyberwareEquipmentPackXmlType = zod.infer<
  typeof CyberwareEquipmentPackXmlSchema
>;
const WeaponAccessoryEquipmentPackXmlSchema = zod
  .object({
    name: zod.string(),
    mount: zod.string(),
  })
  .strict();

const WeaponEquipmentPackXmlSchema = zod
  .object({
    name: zod.string(),
    accessories: zod.optional(
      zod
        .object({
          accessory: zod.union([
            WeaponAccessoryEquipmentPackXmlSchema,
            zod.array(WeaponAccessoryEquipmentPackXmlSchema),
          ]),
        })
        .strict()
    ),
  })
  .strict();

export type WeaponEquipmentPackXmlType = zod.infer<
  typeof WeaponEquipmentPackXmlSchema
>;

const VehicleEquipmentPackXmlSchema = zod
  .object({
    name: zod.string(),
    gears: zod.optional(
      zod
        .object({
          gear: UseGearXmlSchema,
        })
        .strict()
    ),
    weapons: zod.optional(
      zod
        .object({
          weapon: zod.union([
            WeaponEquipmentPackXmlSchema,
            zod.array(WeaponEquipmentPackXmlSchema),
          ]),
        })
        .strict()
    ),
  })
  .strict();
export type VehicleEquipmentPackXmlType = zod.infer<
  typeof VehicleEquipmentPackXmlSchema
>;

const EquipmentPackXmlSchema = zod
  .object({
    name: zod.string(),
    // Category of pack this is
    category: zod.nativeEnum(equipmentPackCategoryEnum),
    // Nuyen (build points?)
    // Nuyen cost in karma (converted to nuyen)
    nuyenbp: zod.number(),
    // Armour List
    armors: zod.optional(
      zod
        .object({
          armor: zod.union([
            ArmorEquipmentPackXmlSchema,
            zod.array(ArmorEquipmentPackXmlSchema),
          ]),
        })
        .strict()
    ),
    // Biowares
    biowares: zod.optional(
      zod
        .object({
          bioware: zod.union([
            BiowareEquipmentPackXmlSchema,
            zod.array(BiowareEquipmentPackXmlSchema),
          ]),
        })
        .strict()
    ),
    // Cyberwares
    cyberwares: zod.optional(
      zod
        .object({
          cyberware: zod.union([
            CyberwareEquipmentPackXmlSchema,
            zod.array(CyberwareEquipmentPackXmlSchema),
          ]),
        })
        .strict()
    ),
    // Gears
    gears: zod.optional(
      zod
        .object({
          gear: UseGearXmlSchema,
        })
        .strict()
    ),
    // Vehicles
    vehicles: zod.optional(
      zod
        .object({
          vehicle: zod.union([
            VehicleEquipmentPackXmlSchema,
            zod.array(VehicleEquipmentPackXmlSchema),
          ]),
        })
        .strict()
    ),
    // Weapons
    weapons: zod.optional(
      zod
        .object({
          weapon: zod.union([
            WeaponEquipmentPackXmlSchema,
            zod.array(WeaponEquipmentPackXmlSchema),
          ]),
        })
        .strict()
    ),
    // Lifestyle
    lifestyles: zod.optional(
      zod
        .object({
          lifestyle: zod
            .object({
              // these are non-advanced lifestyles
              baselifestyle: zod.string(),
              months: zod.number(),
            })
            .strict(),
        })
        .strict()
    ),
  })
  .strict();
export type EquipmentPackXmlType = zod.infer<typeof EquipmentPackXmlSchema>;
export const EquipmentListXmlSchema = zod.array(EquipmentPackXmlSchema);
export type EquipmentPackListXmlType = zod.infer<typeof EquipmentListXmlSchema>;
