import { Type, type } from "arktype";
import {
  damageAnnotationEnum,
  damageTypeEnum,
  metamagicArtEnum,
  spellDescriptorEnum,
  priorityTableRunnerLevelEnum,
  augmentationGradeEnum,
  mathOperatorEnum,
  standardCalculationEnum,
  attributeTypeEnum,
  gearCategoryEnum,
  vehicleCategoryEnum,
  ammoSourceEnum,
  mathComparisonEnum,
  firearmModeEnum,
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountVisibilityEnum,
  equipmentTypeEnum,
  armourCategoryEnum,
  armourModCategoryEnum,
  augmentationCategoryEnum,
  cyberwareCategoryEnum,
  biowareCategoryEnum,
  aircraftSubtypeEnum,
  groundcraftSubtypeEnum,
  watercraftSubtypeEnum,
  droneSubtypeEnum,
  firearmWeaponTypeEnum,
  projectileWeaponTypeEnum,
  weaponCategoryEnum,
  heritageCategoryEnum,
  skillTypeEnum,
} from "../../enums.js";
import { SkillSchema } from "../abilities/skillSchemas.js";
import { WeaponCategorySchema, weaponSubtypeEnum } from "./commonSchemas.js";
import { MountSchema } from "./weaponSharedSchemas.js";

// --- Shared Internal Schemas ---
export const WeaponDamageRequirementsSchema = type({
  "+": "reject",
  type: type.valueOf(damageTypeEnum),
  "annotation?": type.valueOf(damageAnnotationEnum),
});
export type WeaponDamageRequirementsType =
  typeof WeaponDamageRequirementsSchema.infer;

const EquipmentCategorySchema = type.or(
  type({
    "+": "reject",
    equipmentType: type.unit(equipmentTypeEnum.Armour),
    category: type.valueOf(armourCategoryEnum),
  }),
  type({
    "+": "reject",
    equipmentType: type.unit(equipmentTypeEnum.ArmourMod),
    category: type.valueOf(armourModCategoryEnum),
  }),
  type({
    "+": "reject",
    equipmentType: type.unit(equipmentTypeEnum.Augmentation),
    category: type.unit(augmentationCategoryEnum.Cyberware),
    subtype: type.valueOf(cyberwareCategoryEnum),
  }),
  type({
    "+": "reject",
    equipmentType: type.unit(equipmentTypeEnum.Augmentation),
    category: type.unit(augmentationCategoryEnum.Bioware),
    subtype: type.valueOf(biowareCategoryEnum),
  }),
  type({
    "+": "reject",
    equipmentType: type.unit(equipmentTypeEnum.Gear),
    category: type.valueOf(gearCategoryEnum),
  }),
  type({
    "+": "reject",
    equipmentType: type.unit(equipmentTypeEnum.Vehicle),
    category: type.unit(vehicleCategoryEnum.Aircraft),
    subtype: type.valueOf(aircraftSubtypeEnum),
  }),
  type({
    "+": "reject",
    equipmentType: type.unit(equipmentTypeEnum.Vehicle),
    category: type.unit(vehicleCategoryEnum.Groundcraft),
    subtype: type.valueOf(groundcraftSubtypeEnum),
  }),
  type({
    "+": "reject",
    equipmentType: type.unit(equipmentTypeEnum.Vehicle),
    category: type.unit(vehicleCategoryEnum.Watercraft),
    subtype: type.valueOf(watercraftSubtypeEnum),
  }),
  type({
    "+": "reject",
    equipmentType: type.unit(equipmentTypeEnum.Vehicle),
    category: type.unit(vehicleCategoryEnum.Drone),
    subtype: type.valueOf(droneSubtypeEnum),
  }),
  // TODO: update to new format
  type({
    "+": "reject",
    equipmentType: type.unit(equipmentTypeEnum.Weapon),
    category: type.valueOf(weaponSubtypeEnum),
  })
);
export type EquipmentCategoryType = typeof EquipmentCategorySchema.infer;

const FixedAttributeSchema = type.or(
  type({
    "+": "reject",
    noAttribute: "true",
  }),
  type({
    "+": "reject",
    nonZeroAttribute: "true",
  })
);
export type FixedAttributeType = typeof FixedAttributeSchema.infer;

// --- Requirement Enums ---

export enum commonRequirementTypeEnum {
  AllOf = "allOf",
  OneOf = "oneOf",
}

export enum genericRequirementTypeEnum {
  NoParent = "noParent",
  Name = "name",
  Equipment = "equipment",
}

export enum gearRequirementTypeEnum {
  AttributeArray = "attributeArray",
  Attack = "attack",
  Sleaze = "sleaze",
  DataProcessing = "dataProcessing",
  Firewall = "firewall",
  IsCyberdeck = "isCyberdeck",
}

export enum vehicleRequirementTypeEnum {
  Body = "body",
  Seats = "seats",
}

export enum weaponRequirementTypeEnum {
  AmmoType = "ammoType",
  AmmoCategory = "ammoCategory",
  Subtype = "subtype",
  Category = "category",
  Skill = "skill",
  AccessoryMount = "accessoryMount",
  Conceal = "conceal",
  Damage = "damage",
  Mode = "mode",
}

export enum weaponMountRequirementTypeEnum {
  Control = "control",
  Flexibility = "flexibility",
  Visibility = "visibility",
}

export enum otherRequirementTypeEnum {
  Quality = "quality",
  MartialArt = "martialArt",
  MartialTechnique = "martialTechnique",
  Bioware = "bioware",
  Cyberware = "cyberware",
  Metatype = "metatype",
  MetatypeCategory = "metatypeCategory",
  Gear = "gear",
  Skill = "skill",
  Accessory = "accessory",
  SpecialModificationLimit = "specialModificationLimit",
  ArmourMod = "armourMod",
  Attribute = "attribute",
  Program = "program",
  Lifestyle = "lifestyle",
  LifestyleQuality = "lifestyleQuality",
  GameplayOption = "gameplayOption",
  EssenceMinimum = "essenceMinimum",
  EssenceLoss = "essenceLoss",
  MagicEnabled = "magicEnabled",
  ResonanceEnabled = "resonanceEnabled",
  DepthEnabled = "depthEnabled",
  MinimumInitiateGrade = "minimumInitiateGrade",
  MinimumSubmersionGrade = "minimumSubmersionGrade",
  Tradition = "tradition",
  Metamagic = "metamagic",
  MetamagicArt = "metamagicArt",
  Spell = "spell",
  SpellCategory = "spellCategory",
  SpellDescriptor = "spellDescriptor",
  AdeptPower = "adeptpower",
  CritterPower = "critterPower",
  TraditionSpiritForm = "traditionSpiritForm",
}

// --- Atomic Schemas (Non-Recursive) ---

export const ParentGenericRequirementSubSchema = type.or(
  type({
    "+": "reject",
    type: type.unit(genericRequirementTypeEnum.NoParent),
    value: "boolean",
  }),
  type({
    "+": "reject",
    type: type.unit(genericRequirementTypeEnum.Name),
    value: { name: "string", "partialName?": "boolean" },
  }),
  type({
    "+": "reject",
    type: type.unit(genericRequirementTypeEnum.Equipment),
    value: EquipmentCategorySchema,
  })
);

export const ParentGearRequirementSubSchema = type.or(
  ParentGenericRequirementSubSchema,
  type({
    "+": "reject",
    type: type.unit(gearRequirementTypeEnum.AttributeArray),
    exists: "boolean",
  }),
  type({
    "+": "reject",
    type: type.unit(gearRequirementTypeEnum.Attack),
    value: FixedAttributeSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(gearRequirementTypeEnum.Sleaze),
    value: FixedAttributeSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(gearRequirementTypeEnum.DataProcessing),
    value: FixedAttributeSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(gearRequirementTypeEnum.Firewall),
    value: FixedAttributeSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(gearRequirementTypeEnum.IsCyberdeck),
    value: "boolean",
  })
);

export const ParentVehicleRequirementSubSchema = type.or(
  ParentGenericRequirementSubSchema,
  type({
    "+": "reject",
    type: type.unit(vehicleRequirementTypeEnum.Body),
    value: { value: "number", comparison: type.valueOf(mathComparisonEnum) },
  }),
  type({
    "+": "reject",
    type: type.unit(vehicleRequirementTypeEnum.Seats),
    value: { value: "number", comparison: type.valueOf(mathComparisonEnum) },
  })
);

export const ParentWeaponRequirementSubSchema = type.or(
  ParentGenericRequirementSubSchema,
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.AmmoType),
    value: type.valueOf(ammoSourceEnum),
  }),
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.AmmoCategory),
    value: WeaponCategorySchema,
  }),
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.Subtype),
    value: WeaponCategorySchema,
  }),
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.Category),
    value: type.valueOf(weaponCategoryEnum),
  }),
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.Skill),
    value: { "skill?": "string", "specialisation?": "string" },
  }),
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.AccessoryMount),
    value: MountSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.Conceal),
    value: { value: "number", comparison: type.valueOf(mathComparisonEnum) },
  }),
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.Damage),
    value: {
      type: type.valueOf(damageTypeEnum),
      "annotation?": type.valueOf(damageAnnotationEnum),
    },
  }),
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.Mode),
    value: type.valueOf(firearmModeEnum),
  })
);

export const ParentWeaponMountRequirementSubschema = type.or(
  type({
    "+": "reject",
    type: type.unit(weaponMountRequirementTypeEnum.Control),
    value: type.valueOf(weaponMountControlEnum),
  }),
  type({
    "+": "reject",
    type: type.unit(weaponMountRequirementTypeEnum.Flexibility),
    value: type.valueOf(weaponMountFlexibilityEnum),
  }),
  type({
    "+": "reject",
    type: type.unit(weaponMountRequirementTypeEnum.Visibility),
    value: type.valueOf(weaponMountVisibilityEnum),
  })
);

export const RequirementOtherSubSchema = type.or(
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Quality),
    value: type({ "+": "reject", quality: "string", "select?": "string" }),
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.MartialArt),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.MartialTechnique),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Bioware),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Cyberware),
    value: { name: "string", "partialName?": "true" },
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Metatype),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.MetatypeCategory),
    value: type.valueOf(heritageCategoryEnum),
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Gear),
    value: { name: "string", "minimumRating?": "number" },
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Skill),
    value: type({
      name: "string",
      value: "number",
      "specialisation?": "string",
      "type?": type.valueOf(skillTypeEnum),
    }),
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Accessory),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.SpecialModificationLimit),
    value: "number",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.ArmourMod),
    value: { name: "string", "sameParent?": "true" },
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Attribute),
    value: {
      name: type.valueOf(attributeTypeEnum),
      minimumRating: "number",
      "isNaturalMinimumRating?": "true",
    },
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Program),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Lifestyle),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.LifestyleQuality),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.GameplayOption),
    value: type.valueOf(priorityTableRunnerLevelEnum),
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.EssenceMinimum),
    value: "number",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.EssenceLoss),
    value: {
      loss: "number",
      lossFromAugmentationGradeList: type
        .valueOf(augmentationGradeEnum)
        .array(),
    },
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.MagicEnabled),
    value: "boolean",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.ResonanceEnabled),
    value: "boolean",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.DepthEnabled),
    value: "boolean",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.MinimumInitiateGrade),
    value: "number",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.MinimumSubmersionGrade),
    value: "number",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Tradition),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Metamagic),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.MetamagicArt),
    value: type.valueOf(metamagicArtEnum),
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.Spell),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.SpellCategory),
    value: {
      category: "string",
      spellsInCategory: "number",
    },
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.SpellDescriptor),
    value: type({
      "+": "reject",
      name: type.valueOf(spellDescriptorEnum),
      count: "number",
    }),
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.AdeptPower),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.CritterPower),
    value: "string",
  }),
  type({
    "+": "reject",
    type: type.unit(otherRequirementTypeEnum.TraditionSpiritForm),
    value: "string",
  })
);

// --- Recursive Discriminated Unions ---

export type ParentGenericRequirementSubType =
  typeof ParentGenericRequirementSubSchema.infer;
export type ParentGearRequirementSubType =
  typeof ParentGearRequirementSubSchema.infer;
export type ParentVehicleRequirementSubType =
  typeof ParentVehicleRequirementSubSchema.infer;
export type ParentWeaponRequirementSubType =
  typeof ParentWeaponRequirementSubSchema.infer;
export type ParentWeaponMountSubType =
  typeof ParentWeaponMountRequirementSubschema.infer;
export type RequirementOtherSubType = typeof RequirementOtherSubSchema.infer;

export const { ParentGenericRequirementSchema } = type.module({
  ParentGenericRequirementAllOfSchema: {
    "+": "reject",
    allOf: "ParentGenericRequirementSchema[]",
  },
  ParentGenericRequirementOneOfSchema: {
    "+": "reject",
    oneOf: "ParentGenericRequirementSchema[]",
  },
  ParentGenericRequirementSchema: {
    "+": "reject",
    generic: [
      ParentGenericRequirementSubSchema,
      "|",
      [
        "ParentGenericRequirementAllOfSchema",
        "|",
        "ParentGenericRequirementOneOfSchema",
      ],
    ],
  },
});
export type ParentGenericRequirementType =
  typeof ParentGenericRequirementSchema.infer;
export const { ParentGearRequirementSchema } = type.module({
  ParentGearRequirementAllOfSchema: {
    "+": "reject",
    allOf: "ParentGearRequirementSchema[]",
  },
  ParentGearRequirementOneOfSchema: {
    "+": "reject",
    oneOf: "ParentGearRequirementSchema[]",
  },
  ParentGearRequirementSchema: {
    "+": "reject",
    gear: [
      ParentGearRequirementSubSchema,
      "|",
      [
        "ParentGearRequirementAllOfSchema",
        "|",
        "ParentGearRequirementOneOfSchema",
      ],
    ],
  },
});
export type ParentGearRequirementType =
  typeof ParentGearRequirementSchema.infer;
export const { ParentVehicleRequirementSchema } = type.module({
  ParentVehicleRequirementAllOfSchema: {
    "+": "reject",
    allOf: "ParentVehicleRequirementSchema[]",
  },
  ParentVehicleRequirementOneOfSchema: {
    "+": "reject",
    oneOf: "ParentVehicleRequirementSchema[]",
  },
  ParentVehicleRequirementSchema: {
    "+": "reject",
    vehicle: [
      ParentVehicleRequirementSubSchema,
      "|",
      [
        "ParentVehicleRequirementAllOfSchema",
        "|",
        "ParentVehicleRequirementOneOfSchema",
      ],
    ],
  },
});
export type ParentVehicleRequirementType =
  typeof ParentVehicleRequirementSchema.infer;
export const { ParentWeaponRequirementSchema } = type.module({
  ParentWeaponRequirementAllOfSchema: {
    "+": "reject",
    allOf: "ParentWeaponRequirementSchema[]",
  },
  ParentWeaponRequirementOneOfSchema: {
    "+": "reject",
    oneOf: "ParentWeaponRequirementSchema[]",
  },
  ParentWeaponRequirementSchema: {
    "+": "reject",
    weapon: [
      ParentWeaponRequirementSubSchema,
      "|",
      [
        "ParentWeaponRequirementAllOfSchema",
        "|",
        "ParentWeaponRequirementOneOfSchema",
      ],
    ],
  },
});
export type ParentWeaponRequirementType =
  typeof ParentWeaponRequirementSchema.infer;
export const { ParentWeaponMountRequirementSchema } = type.module({
  ParentWeaponMountRequirementAllOfSchema: {
    "+": "reject",
    allOf: "ParentWeaponMountRequirementSchema[]",
  },
  ParentWeaponMountRequirementOneOfSchema: {
    "+": "reject",
    oneOf: "ParentWeaponMountRequirementSchema[]",
  },
  ParentWeaponMountRequirementSchema: {
    "+": "reject",
    weaponMount: [
      ParentWeaponMountRequirementSubschema,
      "|",
      [
        "ParentWeaponMountRequirementAllOfSchema",
        "|",
        "ParentWeaponMountRequirementOneOfSchema",
      ],
    ],
  },
});
export type ParentWeaponMountRequirementType =
  typeof ParentWeaponMountRequirementSchema.infer;
export const ParentRequirementsSchema = type.or(
  ParentGenericRequirementSchema,
  ParentGearRequirementSchema,
  ParentVehicleRequirementSchema,
  ParentWeaponRequirementSchema,
  ParentWeaponMountRequirementSchema
);
export type ParentRequirementsType = typeof ParentRequirementsSchema.infer;

const SubRequirementsSchema = type({
  "+": "reject",
  // For simplicity we will just say its optional
  "parentDetails?": ParentRequirementsSchema,
  "otherDetails?": RequirementOtherSubSchema,
});
type SubRequirementsType = typeof SubRequirementsSchema.infer;

export type RequirementAllOfType = {
  allOf: NonTopRequirementsType[];
};

export type RequirementOneOfType = {
  oneOf: NonTopRequirementsType[];
};

// At leastOne of the properties must be present
export type NonTopRequirementsType =
  | (SubRequirementsType &
      Partial<RequirementAllOfType> &
      Partial<RequirementOneOfType>)
  | (Partial<SubRequirementsType> &
      RequirementOneOfType &
      Partial<RequirementAllOfType>)
  | (Partial<SubRequirementsType> &
      Partial<RequirementOneOfType> &
      RequirementAllOfType);

const RequirementsModule = type.module({
  OptionalRequirementsSchema: {
    "+": "reject",
    "allOf?": "NonTopRequirementsSchema[]",
    "oneOf?": "NonTopRequirementsSchema[]",
  },
  LocalSubRequirementsSchema: SubRequirementsSchema,
  NonTopRequirementsSchema:
    "LocalSubRequirementsSchema & OptionalRequirementsSchema",
  RequirementAllOfSchema: {
    "+": "reject",
    allOf: "NonTopRequirementsSchema[]",
  },
  RequirementOneOfSchema: {
    "+": "reject",
    oneOf: "NonTopRequirementsSchema[]",
  },
});
export const RequirementsSchema: Type<
  RequirementAllOfType | RequirementOneOfType
> = type.or(
  RequirementsModule.RequirementAllOfSchema,
  RequirementsModule.RequirementOneOfSchema
);
export type RequirementsType = RequirementAllOfType | RequirementOneOfType;
