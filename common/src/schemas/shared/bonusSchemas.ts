import { Type, type } from "arktype";
import {
  ammoSourceEnum,
  attributeTypeEnum,
  augmentationGradeEnum,
  augmentationCategoryEnum,
  bonusConditionEnum,
  bonusCostModifierTypeEnum,
  bonusSkillModifierTypeEnum,
  critterAttributePowerEnum,
  critterPowerCategoryEnum,
  cyberwareCategoryEnum,
  damageTypeEnum,
  focusTypeEnum,
  freeSpellRateEnum,
  gearCategoryEnum,
  limbSlotEnum,
  limitCategoryEnum,
  listTypeEnum,
  listTypeModifierEnum,
  magicalFormulaeCategoryEnum,
  mathOperatorEnum,
  skillCategoryEnum,
  skillTypeEnum,
  specialAttributeTypeEnum,
  spellCategoryEnum,
  spellDescriptorEnum,
  spellPowerRangeEnum,
  vehicleCategoryEnum,
  weaponCategoryEnum,
  inclusionTypeEnum,
  talentSkillUnlockCategoryEnum,
} from "../../enums.js";
import {
  EssenceCostSchema,
  spellRangeSchema,
  WeaponClassificationSchema,
} from "./commonSchemas.js";
import { NaturalWeaponSchema } from "./weaponSharedSchemas.js";

const RatingCalculationInnerSchema = type(
  type.or(
    "number",
    // TODO: should we allow Seats here, or have a separate schema for seatsModifier in bonus?
    type({
      "+": "reject",
      option: "'Seats'",
    }),
    type({
      "+": "reject",
      option: "'Rating'",
    }),
    type({
      "+": "reject",
      option: "'-Rating'",
    }),
    type({
      "+": "reject",
      operator: type.valueOf(mathOperatorEnum),
    })
  )
);
const { RatingCalculationSchema } = type.module({
  RatingCalculationSchema: [
    [
      RatingCalculationInnerSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "RatingCalculationSchema",
      },
    ],
    "[]",
  ],
});
export type RatingCalculationType = typeof RatingCalculationSchema.infer;

const RatingBonusSchema = type(
  type.or(
    "number",
    type({
      "+": "reject",
      option: "'Rating'",
    }),
    type({
      "+": "reject",
      option: "'-Rating'",
    })
  )
);
export type RatingBonusType = typeof RatingBonusSchema.infer;

const RatingBonusWithAttributeSchema = type(
  type.or(
    "number",
    type({
      "+": "reject",
      option: "'Rating'",
    }),
    type({
      "+": "reject",
      option: "'-Rating'",
    }),
    type({
      "+": "reject",
      option: type.valueOf(attributeTypeEnum),
    })
  )
);

export const BonusGenericListSchema = type(
  type({ "+": "reject", name: "string", "rating?": "number" })
).array();
export type BonusGenericListType = typeof BonusGenericListSchema.infer;

export const ForbiddenQualityListSchema = type("string[]");
export type ForbiddenQualityListType = typeof ForbiddenQualityListSchema.infer;

const AddictionResistanceSchema = type({
  "+": "reject",
  "physiological?": type({
    "+": "reject",
    initialTest: RatingBonusSchema,
    progressingTest: RatingBonusSchema,
  }),
  "psychological?": type({
    "+": "reject",
    initialTest: RatingBonusSchema,
    progressingTest: RatingBonusSchema,
  }),
});
export type AddictionResistanceType = typeof AddictionResistanceSchema.infer;

export const InitiativeSchema = type({
  "+": "reject",
  "bonus?": type.or(
    type({
      "+": "reject",
      ratingLinked: "number[]",
    }),
    "number"
  ),
  "bonusDice?": type.or(
    type({
      "+": "reject",
      ratingLinked: "number[]",
    }),
    type({ "+": "reject", option: "'Rating'" }),
    "number"
  ),
});
export type InitiativeType = typeof InitiativeSchema.infer;

const BonusSelectionOptionModifierSchema = type({
  "+": "reject",
  type: type.valueOf(listTypeModifierEnum),
  negated: "boolean",
});
export type BonusSelectionOptionModifierType =
  typeof BonusSelectionOptionModifierSchema.infer;

export const BonusSelectionSchema = type.or(
  type({
    "+": "reject",
    enterName: "true",
  }),
  type({
    "+": "reject",
    enterName: "false",
    "allowEdit?": "true",
    "optionList?": type({
      "+": "reject",
      base: type.valueOf(listTypeEnum),
      "modifier?": BonusSelectionOptionModifierSchema.array(),
    }).array(),
  })
);
export type BonusSelectionType = typeof BonusSelectionSchema.infer;

const BonusSkillCategorySchema = type({
  "+": "reject",
  name: type.valueOf(skillCategoryEnum),
  bonus: RatingBonusSchema,
  "precedence?": type.or("'-1'", "'0'", "'1'"),
  "condition?": "string",
  modifierType: type.or(
    type.unit(bonusSkillModifierTypeEnum.ApplyBonusToLevel),
    type.unit(bonusSkillModifierTypeEnum.DicePoolIncrease),
    type.unit(bonusSkillModifierTypeEnum.LevelIncrease)
  ),
  "excludeSkill?": "string",
});

const BonusSkillGroupSchema = type({
  "+": "reject",
  name: "string",
  bonus: RatingBonusSchema,
  "precedence?": type.or("'-1'", "'0'", "'1'"),
  "condition?": "string",
  modifierType: type.or(
    type.unit(bonusSkillModifierTypeEnum.ApplyBonusToLevel),
    type.unit(bonusSkillModifierTypeEnum.DicePoolIncrease),
    type.unit(bonusSkillModifierTypeEnum.LevelIncrease)
  ),
  "excludeSkill?": "string",
});

const BonusSkillBaseSchema = type({
  "+": "reject",
  bonus: RatingBonusSchema,
  "precedence?": type.or("'-1'", "'0'", "'1'"),
  "condition?": "string",
  modifierType: type.or(
    type.unit(bonusSkillModifierTypeEnum.ApplyBonusToLevel),
    type.unit(bonusSkillModifierTypeEnum.DicePoolIncrease),
    type.unit(bonusSkillModifierTypeEnum.LevelIncrease)
  ),
});
const BonusSkillSchema = BonusSkillBaseSchema.merge({
  "+": "reject",
  name: "string",
});
export type BonusSkillType = typeof BonusSkillSchema.infer;

const BonusSkillForAttributeSchema = BonusSkillBaseSchema.merge({
  "+": "reject",
  name: type.valueOf(attributeTypeEnum),
});
export type BonusSkillForAttributeType =
  typeof BonusSkillForAttributeSchema.infer;

const SpecificAttributeBonusSchema = type({
  "+": "reject",
  linkType: type.or(
    type({
      "+": "reject",
      // all except these attributes
      exclude: type.valueOf(attributeTypeEnum).array(),
    }),
    type({
      "+": "reject",
      // only these attributes
      include: type.valueOf(attributeTypeEnum).array(),
    }),
    type({
      "+": "reject",
      // only this attribute
      linkedAttribute: type.valueOf(attributeTypeEnum),
    })
  ),
  // None of these are required, some bonuses are just for reference
  // e.g. An spell that increases an attribute, but by a variable amount
  // and can be cast on anyone
  "attributeIncrease?": type.or(
    "number",
    type({
      "+": "reject",
      ratingLinked: "number[]",
    }),
    type({ "+": "reject", option: type.or("'Rating'", "'-Rating'") })
  ),
  "maximumIncrease?": type.or(
    "number",
    type({
      "+": "reject",
      ratingLinked: "number[]",
    }),
    type({ "+": "reject", option: type.or("'Rating'", "'-Rating'") })
  ),
  "minimumIncrease?": type.or(
    "number",
    type({
      "+": "reject",
      ratingLinked: "number[]",
    }),
    type({ "+": "reject", option: type.or("'Rating'", "'-Rating'") })
  ),
  "augmentatedIncrease?": type.or(
    "number",
    type({
      "+": "reject",
      ratingLinked: "number[]",
    }),
    type({ "+": "reject", option: type.or("'Rating'", "'-Rating'") })
  ),
});
export type SpecificAttributeBonusType =
  typeof SpecificAttributeBonusSchema.infer;

const SelectSkillRestrictionFalseSchema = type({
  "+": "reject",
  "skillList?": type({
    "+": "reject",
    // DB Linked
    skillList: "string[]",
    limit: type.valueOf(inclusionTypeEnum),
  }),
  "skillGroupList?": type({
    "+": "reject",
    // DB Linked
    skillGroupList: "string[]",
    limit: type.valueOf(inclusionTypeEnum),
  }),
  "skillCategoryList?": type({
    "+": "reject",
    skillCategoryList: type.valueOf(skillCategoryEnum).array(),
    limit: type.valueOf(inclusionTypeEnum),
  }),
  "attributeList?": type({
    "+": "reject",
    attributeList: type.valueOf(attributeTypeEnum).array(),
    limit: type.valueOf(inclusionTypeEnum),
  }),
  "knowledgeSkillRestriction?": type({
    "+": "reject",
    limit: type.valueOf(inclusionTypeEnum),
  }),
});

export interface SelectSkillRestrictionFalseType {
  skillList?: {
    skillList: string[];
    limit: inclusionTypeEnum;
  };
  skillGroupList?: {
    skillGroupList: string[];
    limit: inclusionTypeEnum;
  };
  skillCategoryList?: {
    skillCategoryList: Array<
      (typeof skillCategoryEnum)[keyof typeof skillCategoryEnum]
    >;
    limit: inclusionTypeEnum;
  };
  attributeList?: {
    attributeList: Array<
      (typeof attributeTypeEnum)[keyof typeof attributeTypeEnum]
    >;
    limit: inclusionTypeEnum;
  };
  knowledgeSkillRestriction?: {
    limit: inclusionTypeEnum;
  };
}

const SelectSkillRestrictionTrueSchema = type({
  knowledgeSkillRestriction: type({
    "+": "reject",
    limit: type.valueOf(inclusionTypeEnum),
  }),
});
export interface SelectSkillRestrictionTrueType {
  knowledgeSkillRestriction: {
    limit: inclusionTypeEnum;
  };
}

const SelectSkillFalseSchema = type({
  "+": "reject",
  enterName: "false",
  // These restrictions are NOT mutually exclusive
  // I think the order should be Attribute > Category > Group > Skill | Knowledge Skill?
  // So for example restrict to 3 attributes, exclude 1 category from them, but include a skill from somewhere else
  // Not a perfect format but flexible enough...
  "restriction?": SelectSkillRestrictionFalseSchema,
  "minimumRating?": "number",
  "maximumRating?": "number",
});
export interface SelectSkillFalseType {
  enterName: false;
  restriction?: SelectSkillRestrictionFalseType;
  minimumRating?: number;
  maximumRating?: number;
}

const SelectSkillTrueSchema = type({
  "+": "reject",
  enterName: "true",
  "restriction?": SelectSkillRestrictionTrueSchema,
});
export interface SelectSkillTrueType {
  enterName: true;
  restriction?: SelectSkillRestrictionTrueType;
}

export type SelectSkillType = SelectSkillFalseType | SelectSkillTrueType;
export const SelectSkillSchema: Type<SelectSkillType> = type.or(
  SelectSkillFalseSchema,
  SelectSkillTrueSchema
);

const WeaponAccuracySkillListSkillSelectionSchema = type.or(
  type({
    "+": "reject",
    selectSkill: "false",
    name: "string",
  }),
  type({
    selectSkill: "true",
    selectionOptions: SelectSkillSchema,
  })
);
export type WeaponAccuracySkillListSkillSelectionType =
  typeof WeaponAccuracySkillListSkillSelectionSchema.infer;

const KarmaCostModificationSchema = type({
  "+": "reject",
  value: "number",
  costModifierType: type.valueOf(bonusCostModifierTypeEnum),
  "condition?": type.valueOf(bonusConditionEnum),
  "itemRatingRequired?": "number",
  "minimumLevelWhereBonusApplies?": "number",
  "maximumLevelBeforeBonusStopsApplying?": "number",
});

const BonusAttributeOptionSchema = type({
  "+": "reject",
  "linkAttributeList?": SpecificAttributeBonusSchema.array(),
  "enableAttribute?": type({
    "override?": {
      min: type.or("number", type.unit(critterAttributePowerEnum.Force)),
      max: type.or("number", type.unit(critterAttributePowerEnum.Force)),
      aug: type.or("number", type.unit(critterAttributePowerEnum.Force)),
      val: type.or("number", type.unit(critterAttributePowerEnum.Force)),
    },
    name: type.valueOf(specialAttributeTypeEnum),
  }),
  "replaceAttributeList?": type
    .or(
      type({
        "+": "reject",
        name: "string",
        value: "number",
      }),
      type({
        "+": "reject",
        name: "string",
        "min?": "number",
        "max?": "number",
        "aug?": "number",
      })
    )
    .array(),
  "modifyAttributeImprovementKarmaCost?": type({
    "+": "reject",
    name: type.valueOf(attributeTypeEnum),
    bonus: type.or(
      "number",
      type({
        "+": "reject",
        option: "'Rating'",
      })
    ),
  }).array(),
  "increaseNativeLanguageLimit?": "number",
  "limitIncrease?": type({
    "+": "reject",
    category: type.valueOf(limitCategoryEnum),
    value: "number",
  }).array(),
  "limitModifier?": type({
    "+": "reject",
    category: type.valueOf(limitCategoryEnum),
    value: RatingBonusSchema,
    "condition?": "string",
  }).array(),
  "increaseLimitIgnoreMaximum?": "number",
  "socialLimit?": RatingBonusSchema,

  "physicalLimit?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
  "mentalLimit?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
});

const BonusSkillOptionSchema = type({
  "+": "reject",
  "selectSkill?": type({
    "+": "reject",
    // DB Linked
    skill: SelectSkillSchema,
    bonus: type.or(
      type({
        "+": "reject",
        ratingIncreaseCount: RatingBonusWithAttributeSchema,
        modifierType: type
          .valueOf(bonusSkillModifierTypeEnum)
          .exclude(type.unit(bonusSkillModifierTypeEnum.Linked)),
      }),
      type({
        "+": "reject",
        modifierType: type.unit(bonusSkillModifierTypeEnum.Linked),
      })
    ),
    "disableSkillSpecialisation?": "true",
  }),
  // DB Linked
  "selectExpertise?": type({ availableSkillList: "string[]" }),
  // DB Linked
  "skillIncreaseList?": BonusSkillSchema.array(),
  // DB Linked
  "skillIncreaseForAttributeList?": BonusSkillForAttributeSchema.array(),
  // DB Linked
  "skillCategoryList?": BonusSkillCategorySchema.array(),
  // DB Linked
  "skillGroupList?": BonusSkillGroupSchema.array(),
  "allowSkillDefaulting?": "true",
  // DB Linked
  "addSkillSpecialisation?": type({
    spec: "string",
    skillList: "string[]",
  }),
  "bonusSkillPoints?": type({
    "+": "reject",
    points: "number",
    knowledgeSkillRestriction: type.or("'Exclude'", "'Only'"),
  }),
  // DB Linked - Not currently used
  "blockSkillGroupAndDefaulting?": "string",
  "blockSkillCategoryListAndDefaulting?": type
    .valueOf(skillCategoryEnum)
    .array(),
  "activeSoft?": type.or("number", type({ "+": "reject", option: "'Rating'" })),
  "skillSoft?": type({
    "+": "reject",
    bonus: type.or("number", type({ "+": "reject", option: "'Rating'" })),
    // don't apply bonus to this category
    "excludedCategory?": type.valueOf(skillCategoryEnum),
    // only apply bonus to this category
    "specificCategory?": type.valueOf(skillCategoryEnum),
  }),
  "skillSoftHost?": type({
    "+": "reject",
    maximumSkillSoftRating: type.or(
      "number",
      type({ "+": "reject", option: "'Rating'", precedence: "'0'" })
    ),
    // only for hardwires
    "supportedSkillCategory?": type.valueOf(limitCategoryEnum),
  }),
  // Skillsoft host for activesoft
  "skillwire?": type({
    maximumSkillSoftRating: RatingCalculationSchema,
    "precedence?": "'0'",
  }),
  // Skillsoft host that can only hold 1 skillsoft
  "hardwire?": type.or(
    type({
      maximumSkillSoftRating: RatingCalculationSchema,
      activeSkills: "boolean",
      excludeCategoryList: type.valueOf(skillCategoryEnum).array(),
    })
  ),
  "skillKarmaCostModifierList?": type({
    "+": "reject",
    "skillCategoryList?": KarmaCostModificationSchema.merge({
      "+": "reject",
      category: type.valueOf(skillCategoryEnum),
    }).array(),
    "skillCategorySpecialisationList?": KarmaCostModificationSchema.merge({
      "+": "reject",
      category: type.valueOf(skillCategoryEnum),
    }).array(),
    "skillGroupWithinSkillCategoryList?": KarmaCostModificationSchema.merge({
      "+": "reject",
      category: type.valueOf(skillCategoryEnum),
    }).array(),
    "allSkillList?": KarmaCostModificationSchema.merge({
      "+": "reject",
      skillType: type.valueOf(skillTypeEnum),
    }).array(),
    "allSkillMinimumCostList?": type({
      "+": "reject",
      skillType: type.valueOf(skillTypeEnum),
      minimumCost: "number",
      maximumLevelBeforeMinimumStopsApplying: "number",
      "condition?": type.valueOf(bonusConditionEnum),
    }).array(),
  }),
  "skillDisableList?": type({
    "+": "reject",
    "skillGroupWithinSkillCategoryList?": type
      .valueOf(skillCategoryEnum)
      .array(),
    // DB Linked
    "skillGroupList?": type("string").array(),
    // DB Linked
    "skillList?": type("string").array(),
    "selectSkillGroupToDisable?": "true",
  }),
  // DB Linked
  "unlockSkillList?": "string[]",
  "unlockTalentSkillCategoryList?": type
    .valueOf(talentSkillUnlockCategoryEnum)
    .array(),
  "swapSkillAttribute?": type({
    // DB Linked
    skill: "string",
    newAttribute: type.valueOf(attributeTypeEnum),
  }),
  "swapSkillSpecialisationAttribute?": type({
    // DB Linked
    skill: "string",
    specialisation: "string",
    newAttribute: type.valueOf(attributeTypeEnum),
  }),
});

const BonusSelectPowerSchema = type({
  "+": "reject",
  // DB Linked
  "limitedPowerList?": "string[]",
  "ignorePowerLimit?": "true",
  powerLevelBonus: RatingBonusSchema,
  "powerPointLimit?": type({
    "+": "reject",
    limit: RatingBonusSchema,
    powerPointsPerLevel: "number",
  }),
});
export type BonusSelectPowerType = typeof BonusSelectPowerSchema.infer;

const BonusUnlockOptionalPowerSchema = type.or(
  // A set number of optional powers (only used for sprites currently)
  "number",
  type({
    "+": "reject",
    // Summoned spirits have an amount based on the Force they are summoned with
    // Force divided by 3, rounded down
    calc: "'floor({MAG} div 3)'",
  })
);
export type BonusUnlockOptionalPowerType =
  typeof BonusUnlockOptionalPowerSchema.infer;

const BonusLimitSpellOptionsToCategoryListSchema = type
  .or(
    type({
      "+": "reject",
      category: type.valueOf(spellCategoryEnum),
    }),
    type({
      "+": "reject",
      selectCategory: "true",
    })
  )
  .array();
export type BonusLimitSpellOptionsToCategoryListType =
  typeof BonusLimitSpellOptionsToCategoryListSchema.infer;

const BonusLimitSpiritOptionsToListSchema = type
  .or(
    type({
      "+": "reject",
      category: type.valueOf(spellCategoryEnum),
    }),
    type({
      "+": "reject",
      selectCategory: "true",
    }),
    // DB Linked
    type({
      "+": "reject",
      spirit: "string",
    })
  )
  .array();
export type BonusLimitSpiritOptionsToListType =
  typeof BonusLimitSpiritOptionsToListSchema.infer;

const BonusPowerOptionSchema = type({
  "+": "reject",
  "selectPower?": BonusSelectPowerSchema,
  "specificPowerList?": type({
    "+": "reject",
    // DB Linked
    name: "string",
    "bonusOverride?": type({
      "+": "reject",
      value: "number",
      "select?": type.or(
        type({
          "+": "reject",
          // DB Linked
          skill: SelectSkillSchema,
        }),
        type({
          "+": "reject",
          attribute: type.valueOf(attributeTypeEnum),
          limit: type.valueOf(inclusionTypeEnum),
        })
      ),
    }),
  }).array(),
  "unlockOptionalCritterPowerList?": type({
    "+": "reject",
    // Critters start with a set amount of optional powers specified here
    // If not specified here then it must be an infected quality that
    // allows you to buy these optional powers later for karma
    "selectOptionalPowerCount?": BonusUnlockOptionalPowerSchema,
    // DB Linked
    optionalPowerList: type({
      "+": "reject",
      name: "string",
      "select?": "string",
    }).array(),
  }),
  "unlockCritterPowerCategory?": type.valueOf(critterPowerCategoryEnum),
  // DB Linked
  "addCritterPowerList?": type({
    "+": "reject",
    name: "string",
    "select?": "string",
    "rating?": "number",
  }).array(),
  "bonusAdeptPowerPoints?": "number",
});
const BonusFreeSpellOngoingBonusSchema = type({
  "+": "reject",
  linkType: type.or(
    type({
      "+": "reject",
      attributeLinked: type.valueOf(attributeTypeEnum),
    }),
    // DB Linked
    type({
      "+": "reject",
      skillLinked: "string",
    })
  ),
  freeSpellRate: type.valueOf(freeSpellRateEnum),
  "spellRange?": type.valueOf(spellPowerRangeEnum),
});
export type BonusFreeSpellOngoingBonusType =
  typeof BonusFreeSpellOngoingBonusSchema.infer;
const BonusSpellBonusDiceSchema = type({
  "+": "reject",
  // DB Linked
  "specificSpell?": type({
    "+": "reject",
    name: "string",
    bonus: "number",
  }).array(),
  "spellCategoryList?": type({
    "+": "reject",
    category: type.or(
      type.valueOf(spellCategoryEnum),
      type({
        "+": "reject",
        option: "'SelectCategory'",
      })
    ),
    bonus: type.or(
      "number",
      type({
        "+": "reject",
        option: "'Rating'",
      })
    ),
  }).array(),
}).array();
export type BonusSpellBonusDiceType = typeof BonusSpellBonusDiceSchema.infer;
const BonusUnlockSpellListSchema = type({
  "+": "reject",
  "allowSpellCategory?": type.valueOf(spellCategoryEnum),
  "allowSpellRangeList?": type(spellRangeSchema).array(),
}).array();
export type BonusUnlockSpellListType = typeof BonusUnlockSpellListSchema.infer;
const BonusSpellModifiersSchema = type({
  "+": "reject",
  "spellBonusDice?": BonusSpellBonusDiceSchema,
  "spellBonusDamage?": type({
    "+": "reject",
    "spellDescriptor?": type({
      "+": "reject",
      spellDescriptorListRequired: type.valueOf(spellDescriptorEnum).array(),
      bonusDamage: "number",
    }),
    "spellCategory?": type({
      "+": "reject",
      spellCategoryRequired: type.valueOf(spellCategoryEnum),
      bonusDamage: "number",
    }),
  }),
  "spellExtraDrain?": type({
    "+": "reject",
    "spellDescriptor?": type({
      "+": "reject",
      spellDescriptorListRequired: type.valueOf(spellDescriptorEnum).array(),
      extraDrain: "number",
    }),
    "spellCategory?": type({
      "+": "reject",
      spellCategoryRequired: type.or(
        type.valueOf(spellCategoryEnum),
        "'MatchLimitSpellCategory'"
      ),
      extraDrain: "number",
    }),
  }),
});
export type BonusSpellModifiersType = typeof BonusSpellModifiersSchema.infer;
const BonusNewSpellKarmaCostModificationSchema = type({
  "+": "reject",
  spellCategory: type.valueOf(magicalFormulaeCategoryEnum),
  modifier: "number",
});
export type BonusNewSpellKarmaCostModificationType =
  typeof BonusNewSpellKarmaCostModificationSchema.infer;
const BonusFocusBindingKarmaCostModificationSchema = type({
  "+": "reject",
  focusType: type.valueOf(focusTypeEnum),
  modifier: "number",
  "focusSubtypeText?": "string",
}).array();
export type BonusFocusBindingKarmaCostModificationType =
  typeof BonusFocusBindingKarmaCostModificationSchema.infer;
const LivingPersonaModificationSchema = type({
  "+": "reject",
  "attack?": "number",
  "dataProcessing?": "number",
  "firewall?": "number",
  "sleaze?": "number",
});
export type LivingPersonaModificationType =
  typeof LivingPersonaModificationSchema.infer;
const BonusSpellAndMagicOptionSchema = type({
  "+": "reject",
  // DB Linked
  "addSpell?": type({
    "+": "reject",
    name: "string",
    "alchemical?": "true",
  }),
  // DB Linked
  "addMetamagicList?": "string[]",
  // DB Linked
  "metamagicChoiceOrderRestriction?": type({
    "+": "reject",
    metamagic: "string",
    initiationOrder: "number",
  }).array(),
  // add spells linked to a condition
  // new spells are continually added as per condition
  "freeSpellOngoingBonus?": BonusFreeSpellOngoingBonusSchema,
  "linkSpell?": type({
    "+": "reject",
    ignoreRequirements: "boolean",
  }),
  "limitSpellOptionsToCategoryList?":
    BonusLimitSpellOptionsToCategoryListSchema,
  "limitSpiritOptionsToList?": BonusLimitSpiritOptionsToListSchema,
  "unlockSpellList?": BonusUnlockSpellListSchema,
  "spellModifiers?": BonusSpellModifiersSchema,
  "blockSpellDescriptorList?": type.valueOf(spellDescriptorEnum).array(),
  "linkMentorSpirit?": "true",
  "linkTradition?": "true",
  "penaltyFreeSustainCount?": RatingCalculationSchema,
  "newSpellKarmaCostModification?": BonusNewSpellKarmaCostModificationSchema,
  "focusBindingKarmaCostModificationList?":
    BonusFocusBindingKarmaCostModificationSchema,
  "drainModification?": "number",
  "addSpiritOptionList?": type(
    type.or(
      {
        "+": "reject",
        "selectSpirit?": "true",
      },
      // DB Linked
      type({
        "+": "reject",
        name: "string",
      })
    )
  ).array(),
  // Technomancer specific
  "linkSprite?": "true",
  "linkParagon?": "true",
  "fadingModificationList?": type({
    "+": "reject",
    // DB Linked
    "specificComplexForm?": "string",
    modifier: "number",
  }).array(),
  // DB Linked
  "addEcho?": "string",
  "livingPersonaModification?": LivingPersonaModificationSchema,
  "resonanceLossDueToAugmentationModificationPercentageIncrease?": "number",
});
const WeaponCategoryDicePoolModifierSchema = type({
  "+": "reject",
  weaponCategory: type.valueOf(weaponCategoryEnum),
  modifier: type.or("number", type({ "+": "reject", option: "'Rating'" })),
});
export type WeaponCategoryDicePoolModifierType =
  typeof WeaponCategoryDicePoolModifierSchema.infer;
const WeaponClassificationDicePoolModifierSchema =
  WeaponClassificationSchema.merge({
    "+": "reject",
    modifier: "number",
  });
export type WeaponClassificationDicePoolModifierType =
  typeof WeaponClassificationDicePoolModifierSchema.infer;
const ArmourBonusSchema = type({
  "armour?": type({
    "+": "reject",
    "nonStacking?": "true",
    bonus: type.or(
      "number",
      type({
        "+": "reject",
        option: "'Rating'",
      })
    ),
  }),
  "fireArmour?": type.or(
    "number",
    type({
      "+": "reject",
      option: "'Rating'",
    })
  ),
  "electricityArmour?": type.or(
    "number",
    type({
      "+": "reject",
      option: "'Rating'",
    })
  ),
  "coldArmour?": type.or(
    "number",
    type({
      "+": "reject",
      option: "'Rating'",
    })
  ),
});
export type ArmourBonusType = typeof ArmourBonusSchema.infer;
const DamageResistanceBonusSchema = type({
  "damageResistance?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
  "radiationResistance?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
  "sonicResistance?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
});
export type DamageResistanceBonusType =
  typeof DamageResistanceBonusSchema.infer;

const ToxinAndPathogenBonusSchema = type({
  "toxinContactResist?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "pathogenContactResist?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "toxinContactImmune?": "true",
  "pathogenContactImmune?": "true",
  "toxinInhalationResist?": type.or(
    "number",
    type({
      "+": "reject",
      option: "'Rating'",
    })
  ),
  "pathogenInhalationResist?": type.or(
    "number",
    type({
      "+": "reject",
      option: "'Rating'",
    })
  ),
  "toxinInhalationImmune?": "true",
  "pathogenInhalationImmune?": "true",
  "toxinIngestionResist?": type.or(
    "number",
    type({
      "+": "reject",
      option: "'Rating'",
    })
  ),
  "pathogenIngestionResist?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
  "toxinIngestionImmune?": "true",
  "pathogenIngestionImmune?": "true",
  "toxinInjectionResist?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
  "pathogenInjectionResist?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
  "toxinInjectionImmune?": "true",
  "pathogenInjectionImmune?": "true",
});
export type ToxinAndPathogenBonusType =
  typeof ToxinAndPathogenBonusSchema.infer;

const BonusDamageValueModifiersSchema = type({
  "+": "reject",
  "thrownWeaponModifier?": "number",
  "unarmedModifier?": RatingCalculationSchema,
  // DB Linked
  "weaponSkillDamage?": type({
    selectionOptions: SelectSkillSchema,
    modifier: "number",
  }),
});
export type BonusDamageValueModifiersType =
  typeof BonusDamageValueModifiersSchema.infer;
const BonusCombatAndWeaponOptionSchema = type({
  "+": "reject",
  "addWeaponList?": type
    .or(
      // DB Linked
      type({
        "+": "reject",
        name: "string",
      }),
      type({
        "+": "reject",
        naturalWeapon: NaturalWeaponSchema,
      })
    )
    .array(),
  // DB Linked
  "addMartialArt?": "string",
  "attackModifiers?": type({
    "+": "reject",
    "weaponCategoryDicePoolModifier?": WeaponCategoryDicePoolModifierSchema,
    "weaponClassificationDicePoolModifier?":
      WeaponClassificationDicePoolModifierSchema,
    // DB Linked (exact) or JSON partial (partialName): flexible substring match, never a hardcoded list
    "weaponLimitModifier?": type({
      "+": "reject",
      weapon: "string",
      modifier: RatingBonusSchema,
      "partialName?": "true",
    }),
    "smartLinkModifier?": "number",
    "unarmedModifier?": RatingCalculationSchema,
    "weaponSkillAccuracyList?": type({
      "+": "reject",
      // DB Linked
      skill: WeaponAccuracySkillListSkillSelectionSchema,
      modifier: RatingBonusSchema,
    }).array(),
  }),
  "damageValueModifiers?": BonusDamageValueModifiersSchema,
  "unarmedDamageType?": type.valueOf(damageTypeEnum),
  "rangeModifiers?": type({
    "+": "reject",
    "thrownWeaponRangeModifier?": RatingCalculationSchema,
    "reach?": type({
      "+": "reject",
      modifier: "number",
      // DB Linked
      "weaponName?": "string",
    }),
    "unarmedReach?": "number",
  }),
  "linkWeapon?": type.or(
    type({
      "+": "reject",
      restrictions: "false",
    }),
    type({
      "+": "reject",
      restrictions: "true",
      weaponRequirements: type({
        "+": "reject",
        reloadMethodList: type.valueOf(ammoSourceEnum).array(),
        // DB Linked
        "disallowedWeaponList?": "string[]",
      }),
    })
  ),
  "defenseTestModifier?": RatingCalculationSchema,
  "linkArmour?": "true",
  "armourModifiers?": ArmourBonusSchema,
  "damageResistanceModifiers?": DamageResistanceBonusSchema,
  "toxinAndPathogen?": ToxinAndPathogenBonusSchema,
});
const BonusConditionAndRecoveryOptionSchema = type({
  "+": "reject",
  "addictionResistance?": AddictionResistanceSchema,
  "conditionModifierNegativeEffectsOffsetShared?": type.or(
    "number",
    type({
      "+": "reject",
      option: "'Rating'",
    })
  ),
  "conditionModifierNegativeEffectsOffsetPerTrack?": type.or(
    "number",
    type({
      "+": "reject",
      option: "'Rating'",
    })
  ),
  "conditionModifierBoxesPerLevelModifier?": "number",
  "addPhysicalTrackBoxes?": type.or(
    "number",
    type({ "+": "reject", option: type.or("'Rating'", "'-Rating'") })
  ),
  "addStunTrackBoxes?": type.or(
    "number",
    type({ "+": "reject", option: type.or("'Rating'", "'-Rating'") })
  ),
  "addOverflowBoxes?": "number",
  "stunConditionModifierHealingDiceModifier?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
  "physicalConditionModifierHealingDiceModifier?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
  "addEssenceToPhysicalConditionMonitorRecovery?": "true",
  "addEssenceToStunConditionMonitorRecovery?": "true",
});
const MovementReplacementSchema = type({
  "+": "reject",
  // All speeds are times Agility
  "sprint?": "number",
  "run?": "number",
  "walk?": "number",
});
export type MovementReplacementType = typeof MovementReplacementSchema.infer;

const BonusMovementAndLifestyleOptionSchema = type({
  "+": "reject",
  "groundBaseMovementReplacement?": MovementReplacementSchema,
  "flyBaseMovementReplacement?": MovementReplacementSchema,
  "swimBaseMovementReplacement?": MovementReplacementSchema,
  // Note: percentage speed increases stack so 50% + 50% = 100%
  "swimSpeedPercentageModifier?": "number",
  "walkSpeedPercentageModifier?": "number",
  "runSpeedPercentageModifier?": "number",
  "sprintSpeedPercentageModifier?": "number",
  "lifestyleCostModifierList?": type(
    type({
      "+": "reject",
      "basicLifestyle?": "true",
      // DB Linked
      "lifestyle?": "string",
      cost: "number",
    })
  ).array(),
  "availabilityCondition?": type.valueOf(bonusConditionEnum),
});

const BonusTestAndResistanceOptionSchema = type({
  "+": "reject",
  "composure?": "number",
  "judgeIntentions?": type({
    "defense?": RatingBonusSchema,
    "offense?": RatingBonusSchema,
  }),
  "memory?": RatingBonusSchema,
  "drainResist?": RatingBonusSchema,
  "fadingResist?": RatingBonusSchema,
  "allSpellResist?": RatingBonusSchema,
  "directManaResist?": RatingBonusSchema,
  "detectionResist?": RatingBonusSchema,
  "manaIllusionResist?": RatingBonusSchema,
  "physicalIllusionResist?": RatingBonusSchema,

  "mentalManipulationResist?": RatingBonusSchema,
  "decreaseBodyResist?": RatingBonusSchema,
  "decreaseAgilityResist?": RatingBonusSchema,
  "decreaseReasonanceResist?": RatingBonusSchema,
  "decreaseStrengthResist?": RatingBonusSchema,
  "decreaseCharismaResist?": RatingBonusSchema,
  "decreaseIntuitionResist?": RatingBonusSchema,
  "decreaseLogicResist?": RatingBonusSchema,
  "decreaseWillpowerResist?": RatingBonusSchema,

  "fatigueResist?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
});
const BonusInitiativeOptionSchema = type({
  "+": "reject",
  "initiative?": InitiativeSchema,
  "matrixInitiative?": type({
    "+": "reject",
    "scoreModifier?": "number",
    "bonusDice?": "number",
  }),
  "surpriseTest?": RatingCalculationSchema,
});
const BonusGearAndVehicleOptionSchema = type({
  "+": "reject",
  "addGear?": type({
    "+": "reject",
    // DB Linked
    name: "string",
    category: type.valueOf(gearCategoryEnum),
    "rating?": "number",
    "includedGearList?": type({
      "+": "reject",
      // DB Linked
      name: "string",
      category: type.valueOf(gearCategoryEnum),
      "rating?": "number",
    }).array(),
  }),
  "addRestrictedGear?": type({
    "+": "reject",
    availability: "number",
    amount: "number",
  }),
  "deviceRatingBonus?": "number",
  "seatsModifier?": RatingCalculationSchema,
  "speedModifier?": RatingCalculationSchema,
  "offRoadSpeedModifier?": RatingCalculationSchema,
  "accelerationModifier?": RatingCalculationSchema,
  "offRoadAccelerationModifier?": RatingCalculationSchema,
  "handlingModifier?": RatingCalculationSchema,
  "offRoadHandlingModifier?": RatingCalculationSchema,
  "pilotModifier?": RatingCalculationSchema,
  "sensorModifier?": RatingCalculationSchema,
  "bodyModifier?": RatingCalculationSchema,
});
const BonusEssenceAndAugmentationSchema = type({
  "+": "reject",
  "selectCyberware?": type.or(
    type({
      "+": "reject",
      restrictCategory: "true",
      category: type.valueOf(cyberwareCategoryEnum),
    }),
    type({ "+": "reject", restrictCategory: "false" })
  ),
  "selectSideOfBody?": "true",
  "addAugmentation?": type({
    "+": "reject",
    // DB Linked
    name: "string",
    grade: type.valueOf(augmentationGradeEnum),
    category: type.valueOf(augmentationCategoryEnum),
  }),
  "augmentationCostModifierPercentage?": type({
    "+": "reject",
    "bioware?": "number",
    "cyberware?": "number",
    "geneTech?": "number",
  }),
  "augmentationDisable?": type({
    "+": "reject",
    "disableBioware?": "true",
    "disableCyberware?": "true",
    "disableGeneTech?": "true",
    "disableBiowareGradeList?": type.valueOf(augmentationGradeEnum).array(),
    "disableCyberwareGradeList?": type.valueOf(augmentationGradeEnum).array(),
    "disableGeneTechGradeList?": type.valueOf(augmentationGradeEnum).array(),
  }),
  "specialModificationLimit?": "number",
  "essenceModifier?": "number",
  "essenceMaxModifier?": "number",
  "essenceCostOngoingPercentageModifier?": type({
    "+": "reject",
    "magOnly?": EssenceCostSchema,
    "cyberwareOnly?": EssenceCostSchema,
    "biowareOnly?": EssenceCostSchema,
    "geneTechOnly?": EssenceCostSchema,
    "base?": EssenceCostSchema,
  }),
});
const BonusContactAndReputationSchema = type({
  "+": "reject",
  "addContact?": type({
    "+": "reject",
    loyalty: "number",
    connection: "number",
    "group?": "true",
  }),
  "linkContact?": "true",
  "notorietyModifier?": "number",
  "astralReputationModifier?": "number",
  "publicAwarenessModifier?": "number",
  // street cred = 10 + this number to determine street cred instead of the normal 10
  "streetCredLifetimeKarmaModifier?": "number",
  "contactKarmaCostModifier?": "number",
  "contactMinimumKarmaCost?": "number",
});
const BonusQualitySchema = type({
  "+": "reject",
  "selectQualityFromList?": type({
    "+": "reject",
    // DB Linked
    bonusQualityList: type("string").array(),
    // DB Linked
    "reducedBonusQualityList?": type({
      "+": "reject",
      name: "string",
      karmaReduction: "number",
    }).array(),
  }),
  // DB Linked
  "addQualityList?": BonusGenericListSchema,
  // DB Linked
  "freeQuality?": "string",
  "metagenicLimitIncrease?": "number",
  // DB Linked
  "disableQualityList?": type("string").array(),
});
const BonusSpecificQualitySchema = type({
  "+": "reject",
  "adapsin?": "true",
  "allowSpriteFettering?": "true",
  "ambidextrous?": "true",
  "blackmarketDiscount?": "true",
  "burnoutsWay?": "true",
  "cyberAdeptDaemon?": "true",
  "cyberSeeker?": type({
    "+": "reject",
    attributeList: type.valueOf(attributeTypeEnum).array(),
    "loseOnePhysicalBoxInsteadOfGainingTwo?": "true",
  }),
  "dealerConnection?": type.valueOf(vehicleCategoryEnum).array(),
  "erased?": "true",
  "excon?": "true",
  "fame?": "true",
  "friendsInHighPlaces?": "true",
  "magiciansWayDiscount?": "true",
  "mademan?": "true",
  "overclocker?": "true",
  "prototypeTranshuman?": "number",
  "quickeningMetamagic?": "true",
  "reflexRecorderOptimisation?": "true",
  "selectInherentAiProgram?": "true",
  "trustfund?": "number",
  "uneducated?": "true",
});
const BonusMiscellaneousOptionSchema = type({
  "+": "reject",
  "uniqueBonusCategory?": "string",
  "displaySelection?": "false",
  "selection?": BonusSelectionSchema,
  "replaceNonWireless?": "true",
  "linkLicense?": "true",
  "addLimb?": type({
    "+": "reject",
    limbSlot: type.valueOf(limbSlotEnum),
    numberOfLimbs: "number",
  }),
  "characterCreator?": type({
    "+": "reject",
    "nuyenForGearModifier?": type({
      nuyen: "number",
      "gearPurchasedWithNuyenMarkedAsStolen?": "true",
    }),
    "maxKarmaThatCanBeConvertedToNuyenModifier?": "number",
  }),
  "dicePoolModifier?": type({
    "+": "reject",
    type: type({
      "+": "reject",
      specificTest: "string",
    }).or({
      "+": "reject",
      selectFromMatrixActions: "true",
    }),
    modifier: "number",
  }),
});

export type BonusAttributeOptionType = typeof BonusAttributeOptionSchema.infer;
export type BonusSkillOptionType = typeof BonusSkillOptionSchema.infer;
export type BonusPowerOptionType = typeof BonusPowerOptionSchema.infer;
export type BonusSpellAndMagicOptionType =
  typeof BonusSpellAndMagicOptionSchema.infer;
export type BonusCombatAndWeaponOptionType =
  typeof BonusCombatAndWeaponOptionSchema.infer;
export type BonusConditionAndRecoveryOptionType =
  typeof BonusConditionAndRecoveryOptionSchema.infer;
export type BonusMovementAndLifestyleOptionType =
  typeof BonusMovementAndLifestyleOptionSchema.infer;
export type BonusTestAndResistanceOptionType =
  typeof BonusTestAndResistanceOptionSchema.infer;
export type BonusInitiativeOptionType =
  typeof BonusInitiativeOptionSchema.infer;
export type BonusGearAndVehicleOptionType =
  typeof BonusGearAndVehicleOptionSchema.infer;
export type BonusEssenceAndAugmentationType =
  typeof BonusEssenceAndAugmentationSchema.infer;
export type BonusContactAndReputationType =
  typeof BonusContactAndReputationSchema.infer;
export type BonusQualityType = typeof BonusQualitySchema.infer;
export type BonusSpecificQualityType = typeof BonusSpecificQualitySchema.infer;
export type BonusMiscellaneousOptionType =
  typeof BonusMiscellaneousOptionSchema.infer;

export const BonusSchema = type({
  "+": "reject",
  "attribute?": BonusAttributeOptionSchema,
  "skill?": BonusSkillOptionSchema,
  "power?": BonusPowerOptionSchema,
  "spellAndMagic?": BonusSpellAndMagicOptionSchema,
  "combatAndWeapon?": BonusCombatAndWeaponOptionSchema,
  "conditionAndRecovery?": BonusConditionAndRecoveryOptionSchema,
  "movementAndLifestyle?": BonusMovementAndLifestyleOptionSchema,
  "testAndResistance?": BonusTestAndResistanceOptionSchema,
  "initiative?": BonusInitiativeOptionSchema,
  "gearAndVehicle?": BonusGearAndVehicleOptionSchema,
  "essenceAndAugmentation?": BonusEssenceAndAugmentationSchema,
  "contactAndReputation?": BonusContactAndReputationSchema,
  "quality?": BonusQualitySchema,
  "specificQuality?": BonusSpecificQualitySchema,
  "miscellaneous?": BonusMiscellaneousOptionSchema,
});
export type BonusType = typeof BonusSchema.infer;
