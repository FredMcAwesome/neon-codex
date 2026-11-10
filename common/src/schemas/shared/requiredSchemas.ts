import { Type, type } from "arktype";
import {
  damageAnnotationEnum,
  damageTypeEnum,
  metamagicArtEnum,
  spellDescriptorEnum,
  priorityTableRunnerLevelEnum,
  augmentationGradeEnum,
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
  weaponCategoryEnum,
  heritageCategoryEnum,
  skillTypeEnum,
  spellCategoryEnum,
  commonRequirementTypeEnum,
  genericRequirementTypeEnum,
  gearRequirementTypeEnum,
  vehicleRequirementTypeEnum,
  weaponRequirementTypeEnum,
  weaponMountRequirementTypeEnum,
  otherRequirementTypeEnum,
} from "../../enums.js";
import { WeaponClassificationSchema } from "./commonSchemas.js";
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
  WeaponClassificationSchema.merge({
    "+": "reject",
    equipmentType: type.unit(equipmentTypeEnum.Weapon),
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
    value: WeaponClassificationSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.Subtype),
    value: WeaponClassificationSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.Category),
    value: type.valueOf(weaponCategoryEnum),
  }),
  type({
    "+": "reject",
    type: type.unit(weaponRequirementTypeEnum.Skill),
    value: type.or(
      {
        "+": "reject",
        "skill?": "string",
        "specialisation?": "string",
      },
      {
        "+": "reject",
        noOverride: type.unit(true),
      }
    ),
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
      "+": "reject",
      category: type.valueOf(spellCategoryEnum),
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
    type: type.unit(commonRequirementTypeEnum.AllOf),
    allOf: "ParentGenericRequirementSchema[]",
  },
  ParentGenericRequirementOneOfSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.OneOf),
    oneOf: "ParentGenericRequirementSchema[]",
  },
  ParentGenericRequirementSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.Inner),
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
    type: type.unit(commonRequirementTypeEnum.AllOf),
    allOf: "ParentGearRequirementSchema[]",
  },
  ParentGearRequirementOneOfSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.OneOf),
    oneOf: "ParentGearRequirementSchema[]",
  },
  ParentGearRequirementSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.Inner),
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
    type: type.unit(commonRequirementTypeEnum.AllOf),
    allOf: "ParentVehicleRequirementSchema[]",
  },
  ParentVehicleRequirementOneOfSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.OneOf),
    oneOf: "ParentVehicleRequirementSchema[]",
  },
  ParentVehicleRequirementSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.Inner),
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
    type: type.unit(commonRequirementTypeEnum.AllOf),
    allOf: "ParentWeaponRequirementSchema[]",
  },
  ParentWeaponRequirementOneOfSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.OneOf),
    oneOf: "ParentWeaponRequirementSchema[]",
  },
  ParentWeaponRequirementSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.Inner),
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
    type: type.unit(commonRequirementTypeEnum.AllOf),
    allOf: "ParentWeaponMountRequirementSchema[]",
  },
  ParentWeaponMountRequirementOneOfSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.OneOf),
    oneOf: "ParentWeaponMountRequirementSchema[]",
  },
  ParentWeaponMountRequirementSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.Inner),
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

// --- Top-Level Requirement Nodes ---
export const RequirementLeafSchema = type.or(
  type({
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.Inner),
    parentDetails: ParentRequirementsSchema,
    otherDetails: RequirementOtherSubSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.Inner),
    parentDetails: ParentRequirementsSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.Inner),
    otherDetails: RequirementOtherSubSchema,
  })
);

export const { RequirementAllOfSchema, RequirementOneOfSchema } = type.module({
  RequirementAllOfSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.AllOf),
    allOf: [
      [
        RequirementLeafSchema,
        "|",
        ["RequirementAllOfSchema", "|", "RequirementOneOfSchema"],
      ],
      "[]",
    ],
  },
  RequirementOneOfSchema: {
    "+": "reject",
    type: type.unit(commonRequirementTypeEnum.OneOf),
    oneOf: [
      [
        RequirementLeafSchema,
        "|",
        ["RequirementAllOfSchema", "|", "RequirementOneOfSchema"],
      ],
      "[]",
    ],
  },
});

export const NonTopRequirementsSchema = type.or(
  RequirementLeafSchema,
  RequirementAllOfSchema,
  RequirementOneOfSchema
);
export const NonTopRequirementsArraySchema = NonTopRequirementsSchema.array();
export const RequirementsSchema: Type<
  RequirementAllOfType | RequirementOneOfType
> = type.or(RequirementAllOfSchema, RequirementOneOfSchema);

export type RequirementLeafType = (
  | {
      parentDetails: ParentRequirementsType;
      otherDetails: RequirementOtherSubType;
    }
  | { parentDetails: ParentRequirementsType; otherDetails?: never }
  | { parentDetails?: never; otherDetails: RequirementOtherSubType }
) & {
  type: commonRequirementTypeEnum.Inner;
  allOf?: never;
  oneOf?: never;
};
export type RequirementAllOfType = {
  type: commonRequirementTypeEnum.AllOf;
  allOf: NonTopRequirementsType[];
};
export type RequirementOneOfType = {
  type: commonRequirementTypeEnum.OneOf;
  oneOf: NonTopRequirementsType[];
};
export type NonTopRequirementsType =
  RequirementLeafType | RequirementAllOfType | RequirementOneOfType;
export type RequirementsType = RequirementAllOfType | RequirementOneOfType;
