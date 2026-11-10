import { type } from "arktype";
import {
  aircraftSubtypeEnum,
  ammoSourceEnum,
  armourCategoryEnum,
  augmentationCategoryEnum,
  biowareCategoryEnum,
  cyberwareCategoryEnum,
  droneSubtypeEnum,
  equipmentTypeEnum,
  explosiveTypeEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  gearCategoryEnum,
  groundcraftSubtypeEnum,
  heritageCategoryEnum,
  meleeWeaponTypeEnum,
  priorityTableRunnerLevelEnum,
  projectileWeaponTypeEnum,
  vehicleCategoryEnum,
  watercraftSubtypeEnum,
  weaponCategoryEnum,
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountVisibilityEnum,
  requirementFilterModeEnum,
  weaponMountParentCategory,
} from "../../enums.js";
import { WeaponClassificationSchema } from "./commonSchemas.js";
import { AccessoryMountSchema, DamageSchema } from "./weaponSharedSchemas.js";
import { GearDeviceAttributeSchema } from "../equipment/other/gearSchemas.js";

export const RequirementWeaponParentBaseSchema = type({
  "+": "reject",
  category: type.unit(equipmentTypeEnum.Weapon),
  "name?": "string",
  "ammoTypes?": type.valueOf(ammoSourceEnum).array(),
  "ammoCategory?": "string",
  "ammoWeaponClassification?": WeaponClassificationSchema,
  "concealability?": "number",
  "mountsAvailable?": AccessoryMountSchema,
  "installedAccessories?": "string[]",
  "specialModificationCount?": "number",
  "skills?": "string[]",
  "modes?": type.valueOf(firearmModeEnum).array(),
  "damage?": DamageSchema,
});

export type RequirementWeaponParentBaseType =
  typeof RequirementWeaponParentBaseSchema.infer;

export const RequirementFirearmParentSchema =
  RequirementWeaponParentBaseSchema.merge({
    "+": "reject",
    weaponCategory: type.unit(weaponCategoryEnum.Firearm),
    "subtype?": type.valueOf(firearmWeaponTypeEnum),
  });
export type RequirementFirearmParentType =
  typeof RequirementFirearmParentSchema.infer;

export const RequirementMeleeParentSchema =
  RequirementWeaponParentBaseSchema.merge({
    "+": "reject",
    weaponCategory: type.unit(weaponCategoryEnum.Melee),
    "subtype?": type.valueOf(meleeWeaponTypeEnum),
  });
export type RequirementMeleeParentType =
  typeof RequirementMeleeParentSchema.infer;

export const RequirementProjectileParentSchema =
  RequirementWeaponParentBaseSchema.merge({
    "+": "reject",
    weaponCategory: type.unit(weaponCategoryEnum.Projectile),
    "subtype?": type.valueOf(projectileWeaponTypeEnum),
  });
export type RequirementProjectileParentType =
  typeof RequirementProjectileParentSchema.infer;

export const RequirementExplosiveParentSchema =
  RequirementWeaponParentBaseSchema.merge({
    "+": "reject",
    weaponCategory: type.unit(weaponCategoryEnum.Explosive),
    "subtype?": type.valueOf(explosiveTypeEnum),
  });
export type RequirementExplosiveParentType =
  typeof RequirementExplosiveParentSchema.infer;

// A weapon parent either omits the classification pair entirely or carries
// a correlated category/subtype pair, so drifted combinations (e.g. a
// Firearm category with a Blades subtype) are unrepresentable.
export const RequirementWeaponParentContextSchema = type.or(
  RequirementWeaponParentBaseSchema,
  RequirementFirearmParentSchema,
  RequirementMeleeParentSchema,
  RequirementProjectileParentSchema,
  RequirementExplosiveParentSchema
);
export type RequirementWeaponParentContextType =
  typeof RequirementWeaponParentContextSchema.infer;

export const RequirementArmourParentContextSchema = type({
  "+": "reject",
  category: type.unit(equipmentTypeEnum.Armour),
  "name?": "string",
  "subtype?": type.valueOf(armourCategoryEnum),
  "installedMods?": "string[]",
});
export type RequirementArmourParentContextType =
  typeof RequirementArmourParentContextSchema.infer;

export const RequirementVehicleParentBaseSchema = type({
  "+": "reject",
  category: type.unit(equipmentTypeEnum.Vehicle),
  "name?": "string",
  "body?": "number",
  "seats?": "number",
  "installedMods?": "string[]",
});
export type RequirementVehicleParentBaseType =
  typeof RequirementVehicleParentBaseSchema.infer;

export const RequirementGroundcraftParentSchema =
  RequirementVehicleParentBaseSchema.merge({
    "+": "reject",
    vehicleCategory: type.unit(vehicleCategoryEnum.Groundcraft),
    "subtype?": type.valueOf(groundcraftSubtypeEnum),
  });
export type RequirementGroundcraftParentType =
  typeof RequirementGroundcraftParentSchema.infer;

export const RequirementWatercraftParentSchema =
  RequirementVehicleParentBaseSchema.merge({
    "+": "reject",
    vehicleCategory: type.unit(vehicleCategoryEnum.Watercraft),
    "subtype?": type.valueOf(watercraftSubtypeEnum),
  });
export type RequirementWatercraftParentType =
  typeof RequirementWatercraftParentSchema.infer;

export const RequirementAircraftParentSchema =
  RequirementVehicleParentBaseSchema.merge({
    "+": "reject",
    vehicleCategory: type.unit(vehicleCategoryEnum.Aircraft),
    "subtype?": type.valueOf(aircraftSubtypeEnum),
  });
export type RequirementAircraftParentType =
  typeof RequirementAircraftParentSchema.infer;

export const RequirementDroneParentSchema =
  RequirementVehicleParentBaseSchema.merge({
    "+": "reject",
    vehicleCategory: type.unit(vehicleCategoryEnum.Drone),
    "subtype?": type.valueOf(droneSubtypeEnum),
  });
export type RequirementDroneParentType =
  typeof RequirementDroneParentSchema.infer;

// Either no classification pair or a correlated vehicleCategory/subtype pair.
export const RequirementVehicleParentContextSchema = type.or(
  RequirementVehicleParentBaseSchema,
  RequirementGroundcraftParentSchema,
  RequirementWatercraftParentSchema,
  RequirementAircraftParentSchema,
  RequirementDroneParentSchema
);
export type RequirementVehicleParentContextType =
  typeof RequirementVehicleParentContextSchema.infer;

export const RequirementGearParentContextSchema = type({
  "+": "reject",
  category: type.unit(equipmentTypeEnum.Gear),
  "name?": "string",
  "subtype?": type.valueOf(gearCategoryEnum),
  "attack?": GearDeviceAttributeSchema,
  "sleaze?": GearDeviceAttributeSchema,
  "dataProcessing?": GearDeviceAttributeSchema,
  "firewall?": GearDeviceAttributeSchema,
  "hasAttributeArray?": "boolean",
  "isCyberdeck?": "boolean",
});
export type RequirementGearParentContextType =
  typeof RequirementGearParentContextSchema.infer;

export const RequirementAugmentationParentBaseSchema = type({
  "+": "reject",
  category: type.unit(equipmentTypeEnum.Augmentation),
  "name?": "string",
});
export type RequirementAugmentationParentBaseType =
  typeof RequirementAugmentationParentBaseSchema.infer;

export const RequirementCyberwareParentSchema =
  RequirementAugmentationParentBaseSchema.merge({
    "+": "reject",
    augmentationCategory: type.unit(augmentationCategoryEnum.Cyberware),
    "subtype?": type.valueOf(cyberwareCategoryEnum),
  });
export type RequirementCyberwareParentType =
  typeof RequirementCyberwareParentSchema.infer;

export const RequirementBiowareParentSchema =
  RequirementAugmentationParentBaseSchema.merge({
    "+": "reject",
    augmentationCategory: type.unit(augmentationCategoryEnum.Bioware),
    "subtype?": type.valueOf(biowareCategoryEnum),
  });
export type RequirementBiowareParentType =
  typeof RequirementBiowareParentSchema.infer;

// Either no classification pair or a correlated augmentationCategory/subtype pair.
export const RequirementAugmentationParentContextSchema = type.or(
  RequirementAugmentationParentBaseSchema,
  RequirementCyberwareParentSchema,
  RequirementBiowareParentSchema
);
export type RequirementAugmentationParentContextType =
  typeof RequirementAugmentationParentContextSchema.infer;

export const RequirementWeaponAccessoryParentContextSchema = type({
  "+": "reject",
  category: type.unit(equipmentTypeEnum.WeaponAccessory),
  "name?": "string",
});
export type RequirementWeaponAccessoryParentContextType =
  typeof RequirementWeaponAccessoryParentContextSchema.infer;

export const RequirementWeaponMountParentContextSchema = type({
  "+": "reject",
  category: type.unit(weaponMountParentCategory),
  "name?": "string",
  "control?": type.valueOf(weaponMountControlEnum),
  "flexibility?": type.valueOf(weaponMountFlexibilityEnum),
  "visibility?": type.valueOf(weaponMountVisibilityEnum),
});
export type RequirementWeaponMountParentContextType =
  typeof RequirementWeaponMountParentContextSchema.infer;

export const RequirementParentContextSchema = type.or(
  RequirementWeaponParentContextSchema,
  RequirementArmourParentContextSchema,
  RequirementVehicleParentContextSchema,
  RequirementGearParentContextSchema,
  RequirementAugmentationParentContextSchema,
  RequirementWeaponAccessoryParentContextSchema,
  RequirementWeaponMountParentContextSchema
);
export type RequirementParentContextType =
  typeof RequirementParentContextSchema.infer;

export const RequirementCharacterContextSchema = type({
  "+": "reject",
  "metatype?": "string",
  "metatypeCategory?": type.valueOf(heritageCategoryEnum),
  "positiveQualities?": "string[]",
  "negativeQualities?": "string[]",
  "skills?": "Record<string, number>",
  "installedCyberware?": "string[]",
  "installedBioware?": "string[]",
  "installedGear?": "string[]",
  "installedGearRatings?": "Record<string, number>",
  "installedArmourMods?": "string[]",
  "installedMartialArts?": "string[]",
  "installedMartialTechniques?": "string[]",
  "attributes?": "Record<string, number>",
  "programs?": "string[]",
  "lifestyles?": "string[]",
  "lifestyleQualities?": "string[]",
  "gameplayOption?": type.valueOf(priorityTableRunnerLevelEnum),
  "essence?": "number",
  "magicEnabled?": "boolean",
  "resonanceEnabled?": "boolean",
  "depthEnabled?": "boolean",
  "initiateGrade?": "number",
  "submersionGrade?": "number",
  "tradition?": "string",
  "metamagics?": "string[]",
  "metamagicArts?": "string[]",
  "spells?": "string[]",
  "spellsByCategory?": "Record<string, number>",
  "spellsByDescriptor?": "Record<string, number>",
  "adeptPowers?": "string[]",
  "critterPowers?": "string[]",
  "traditionSpiritForms?": "string[]",
});
export type RequirementCharacterContextType =
  typeof RequirementCharacterContextSchema.infer;

export const RequirementEvaluationContextSchema = type({
  "+": "reject",
  "parent?": RequirementParentContextSchema,
  // The parent's own parent (e.g. the vehicle hosting a weapon mount, or the weapon hosting an accessory that gear attaches to).
  // Domain checks consult the nearest ancestor of the required kind, name and standalone checks always use the direct parent.
  "grandparent?": RequirementParentContextSchema,
  "character?": RequirementCharacterContextSchema,
  "isRoot?": "boolean",
});
export type RequirementEvaluationContextType =
  typeof RequirementEvaluationContextSchema.infer;

export const RequirementCompatibilitySchema = type({
  "+": "reject",
  isCompatible: "boolean",
  unmetReasons: "string[]",
});
export type RequirementCompatibilityType =
  typeof RequirementCompatibilitySchema.infer;

export const RequirementFilterModeSchema = type.valueOf(
  requirementFilterModeEnum
);
export type RequirementFilterModeType =
  typeof RequirementFilterModeSchema.infer;
