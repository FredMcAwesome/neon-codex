import { z as zod } from "zod";
import {
  augmentationGradeEnum,
  augmentationTypeEnum,
  equipmentPackCategoryEnum,
} from "../../enums.js";
import { AugmentationSubsystemListSchema } from "./bodyModification/augmentationSchemas.js";
import { IncludedGearListSchema } from "../shared/commonSchemas.js";
import { GenericModListSchema } from "../shared/modSchemas.js";

const ArmourEquipmentPackSchema = zod
  .object({
    name: zod.string(),
    modList: zod.optional(GenericModListSchema),
    gearList: zod.optional(IncludedGearListSchema),
  })
  .strict();

const PartialAugmentationEquipmentPackSchema = zod.object({
  name: zod.string(),
  grade: zod.nativeEnum(augmentationGradeEnum),
  rating: zod.optional(zod.number()),
});
const AugmentationEquipmentPackSchema = zod.discriminatedUnion("type", [
  PartialAugmentationEquipmentPackSchema.extend({
    type: zod.literal(augmentationTypeEnum.Bioware),
  }).strict(),
  PartialAugmentationEquipmentPackSchema.extend({
    type: zod.literal(augmentationTypeEnum.Cyberware),
    gearList: zod.optional(IncludedGearListSchema),
    subsystemList: zod.optional(AugmentationSubsystemListSchema),
  }).strict(),
]);
export type AugmentationEquipmentPackType = zod.infer<
  typeof AugmentationEquipmentPackSchema
>;
const AugmentationEquipmentPackListSchema = zod.array(
  AugmentationEquipmentPackSchema
);
export type AugmentationEquipmentPackListType = zod.infer<
  typeof AugmentationEquipmentPackListSchema
>;

const WeaponEquipmentPackSchema = zod
  .object({
    name: zod.string(),
    accessoryList: zod.optional(
      zod.array(
        zod
          .object({
            name: zod.string(),
          })
          .strict()
      )
    ),
  })
  .strict();
export type WeaponEquipmentPackType = zod.infer<
  typeof WeaponEquipmentPackSchema
>;

const VehicleEquipmentPackSchema = zod
  .object({
    name: zod.string(),
    gearList: zod.optional(IncludedGearListSchema),
    weaponList: zod.optional(zod.array(WeaponEquipmentPackSchema)),
  })
  .strict();

const LifestyleEquipmentPackSchema = zod
  .object({
    baseLifestyle: zod.string(),
    prepurchasedDuration: zod.number(),
  })
  .strict();

export const EquipmentPackSchema = zod
  .object({
    name: zod.string(),
    category: zod.nativeEnum(equipmentPackCategoryEnum),
    nuyen: zod.number(),
    armourList: zod.optional(zod.array(ArmourEquipmentPackSchema)),
    augmentationList: zod.optional(AugmentationEquipmentPackListSchema),
    gearList: zod.optional(IncludedGearListSchema),
    vehicleList: zod.optional(zod.array(VehicleEquipmentPackSchema)),
    weaponList: zod.optional(zod.array(WeaponEquipmentPackSchema)),
    lifestyle: zod.optional(LifestyleEquipmentPackSchema),
    description: zod.string(),
  })
  .strict();
export type EquipmentPackType = zod.infer<typeof EquipmentPackSchema>;
export const EquipmentPackListSchema = zod.array(EquipmentPackSchema);
export type EquipmentPackListType = zod.infer<typeof EquipmentPackListSchema>;
