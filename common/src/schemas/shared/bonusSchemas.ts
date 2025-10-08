import { type } from "arktype";
import {
  ammoSourceEnum,
  attributeTypeEnum,
  bonusCostModifierConditionEnum,
  bonusCostModifierTypeEnum,
  bonusSkillModifierTypeEnum,
  critterAttributePowerEnum,
  damageTypeEnum,
  limbSlotEnum,
  limitCategoryEnum,
  listTypeEnum,
  listTypeModifierEnum,
  mathOperatorEnum,
  skillCategoryEnum,
  skillTypeEnum,
  specialAttributeTypeEnum,
  spellCategoryEnum,
  weaponTypeEnum,
} from "../../enums.js";
import { EssenceCostSchema } from "./commonSchemas.js";

const RatingCalculationSchema = type(
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
      operator: type.valueOf(mathOperatorEnum),
    })
  )
);
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
    "enterName?": "true",
  }),
  type({
    "+": "reject",
    "allowEdit?": "true",
    "optionList?": type({
      "+": "reject",
      base: type.valueOf(listTypeEnum),
      "modifier?": BonusSelectionOptionModifierSchema.array(),
    }).array(),
  })
);
export type BonusSelectionType = typeof BonusSelectionSchema.infer;

const BonusSkillSchema = type({
  "+": "reject",
  name: "string",
  bonus: RatingBonusSchema,
  "precedence?": type.or("'-1'", "'0'", "'1'"),
  "condition?": "string",
  "exclude?": "string",
  modifierType: type
    .valueOf(bonusSkillModifierTypeEnum)
    .exclude(type.unit(bonusSkillModifierTypeEnum.Linked)),
});

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

const SelectSkillSchema = type.or(
  type({
    "+": "reject",
    // These restrictions are NOT mutually exclusive
    // I think the order should be Attribute > Category > Group > Skill | Knowledge Skill?
    // So for example restrict to 3 attributes, exclude 1 category from them, but include a skill from somewhere else
    // Not a perfect format but flexible enough...
    restriction: type({
      "+": "reject",
      "skillList?": type({
        "+": "reject",
        skillList: "string[]",
        limit: type.or("'Exclude'", "'Only'"),
      }),
      "skillGroupList?": type({
        "+": "reject",
        skillGroupList: "string[]",
        limit: type.or("'Exclude'", "'Only'"),
      }),
      "skillCategoryList?": type({
        "+": "reject",
        skillCategoryList: "string[]",
        limit: type.or("'Exclude'", "'Only'"),
      }),
      "attributeList?": type({
        "+": "reject",
        attributeList: "string[]",
      }),
      "knowledgeSkillRestriction?": type({
        "+": "reject",
        limit: type.or("'Exclude'", "'Only'"),
      }),
    }),
    "minimumRating?": "number",
    "maximumRating?": "number",
  }),
  type({
    "+": "reject",
    "enterName?": "true",
    restriction: type({
      "knowledgeSkillRestriction?": type({
        "+": "reject",
        limit: type.or("'Exclude'", "'Only'"),
      }),
    }),
  })
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
  "condition?": type.valueOf(bonusCostModifierConditionEnum),
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
  "selectExpertise?": type({ availableSkillList: "string[]" }),
  "skillIncreaseList?": BonusSkillSchema.array(),
  "skillIncreaseForAttributeList?": BonusSkillSchema.array(),
  "skillCategoryList?": BonusSkillSchema.array(),
  "skillGroupList?": BonusSkillSchema.array(),
  "allowSkillDefaulting?": "true",
  "addSkillSpecialistion?": type({
    spec: "string",
    skillList: "string[]",
  }),
  "bonusSkillPoints?": type({
    "+": "reject",
    points: "number",
    knowledgeSkillRestriction: type.or("'Exclude'", "'Only'"),
  }),
  // Not currently used
  "blockSkillGroupAndDefaulting?": "string",
  "blockSkillCategoryListAndDefaulting?": "string[]",
  "activeSoft?": type.or("number", type({ "+": "reject", option: "'Rating'" })),
  "skillSoft?": type({
    "+": "reject",
    bonus: type.or("number", type({ "+": "reject", option: "'Rating'" })),
    // don't apply bonus to this category
    "excludedCategory?": "string",
    // only apply bonus to this category
    "specificCategory?": "string",
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
    maximumSkillSoftRating: RatingCalculationSchema.array(),
    "precedence?": "'0'",
  }),
  // Skillsoft host that can only hold 1 skillsoft
  "hardwire?": type.or(
    type({
      maximumSkillSoftRating: RatingCalculationSchema,
      activeSkills: "boolean",
      excludeCategoryList: "string[]",
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
      "condition?": type.valueOf(bonusCostModifierConditionEnum),
    }).array(),
  }),
  "skillDisableList?": type({
    "+": "reject",
    "skillGroupWithinSkillCategoryList?": type
      .valueOf(skillCategoryEnum)
      .array(),
    "skillGroupList?": type("string").array(),
    "skillList?": type("string").array(),
  }),
  "unlockSkillList?": "string[]",
  "swapSkillAttribute?": type({
    skill: "string",
    newAttribute: type.valueOf(attributeTypeEnum),
  }),
  "swapSkillSpecialisationAttribute?": type({
    skill: "string",
    specialisation: "string",
    newAttribute: type.valueOf(attributeTypeEnum),
  }),
});
const BonusPowerOptionSchema = type({
  "+": "reject",
  "selectPower?": type({
    "+": "reject",
    "limitedPowerList?": "string[]",
    "ignorePowerLimit?": "true",
    powerLevelBonus: RatingBonusSchema,
    "powerPointLimit?": type({
      "+": "reject",
      limit: RatingBonusSchema,
      powerPointsPerLevel: "number",
    }),
  }),
  "specificPowerList?": type({
    "+": "reject",
    name: "string",
    "bonus?": type({
      value: "number",
      "select?": type.or(
        type({
          "+": "reject",
          skill: SelectSkillSchema,
        }),
        type({
          "+": "reject",
          attribute: type.valueOf(attributeTypeEnum),
        })
      ),
    }),
  }).array(),
});
const BonusSpellAndMagicOptionSchema = type({
  "+": "reject",
  "linkSpell?": type({
    "+": "reject",
    ignoreRequirements: "boolean",
  }),
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
  "allowSpellCategory?": type.valueOf(spellCategoryEnum),
  "linkMentorSpirit?": "true",
  "linkTradition?": "true",
});
const BonusTechnomancerOptionSchema = type({
  "+": "reject",
  "linkSprite?": "true",
  "linkParagon?": "true",
});
const BonusCombatAndWeaponOptionSchema = type({
  "+": "reject",
  "specificWeapon?": {
    weaponType: type.valueOf(weaponTypeEnum),
    bonus: type.or("number", type({ "+": "reject", option: "'Rating'" })),
  },
  "weaponAccuracy?": {
    weapon: "string",
    bonus: type.or("number", type({ "+": "reject", option: "'Rating'" })),
  },
  "linkWeapon?": type.or(
    type({ restrictions: "false" }),
    type({
      restrictions: "true",
      weaponRequirements: type({
        "+": "reject",
        reloadMethodList: type.valueOf(ammoSourceEnum).array(),
        "disallowedWeaponList?": "string[]",
      }),
    })
  ),
  "linkArmour?": "true",
  "weaponSkillAccuracyList?": type({
    "+": "reject",
    skill: WeaponAccuracySkillListSkillSelectionSchema,
    bonus: type.or(
      "number",
      type({
        "+": "reject",
        option: "'Rating'",
      })
    ),
  }).array(),
  "weaponSkillDamage?": type({
    selectionOptions: SelectSkillSchema,
    bonus: "number",
  }),
  "smartlinkAccuracy?": "number",
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
  "dodge?": RatingBonusSchema,
  "unarmedDamage?": type(
    type.or(
      "number",
      type({ "+": "reject", option: "'Rating'" }),
      type({
        "+": "reject",
        operator: type.valueOf(mathOperatorEnum),
      })
    )
  ).array(),
  "unarmedDamageType?": type.valueOf(damageTypeEnum),
  "unarmedReach?": "number",
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
const BonusConditionAndRecoveryOptionSchema = type({
  "+": "reject",
  "addictionResistance?": AddictionResistanceSchema,
  "ignoreConditionModifierNegativeEffects?": type.or(
    "number",
    type({
      "+": "reject",
      option: "'Rating'",
    })
  ),
  "addPhysicalBoxes?": type.or(
    "number",
    type({ "+": "reject", option: type.or("'Rating'", "'-Rating'") })
  ),
  "stunHealing?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
  "physicalHealing?": type.or(
    "number",
    type({ "+": "reject", option: "'Rating'" })
  ),
});
const BonusMovementAndLifestyleOptionSchema = type({
  "+": "reject",
  // Note: percentage speed increases stack so 50% + 50% = 100%
  "swimSpeedPercentageModifier?": "number",
  "walkSpeedPercentageModifier?": "number",
  "runSpeedPercentageModifier?": "number",
  "sprintSpeedPercentageModifier?": "number",
  "lifestyleCostModifier?": type(
    type({ "+": "reject", "lifestyle?": "string", cost: "number" })
  ).array(),
});

const BonusTestAndResistanceOptionSchema = type({
  "+": "reject",
  "composure?": "number",
  "judgeIntentionsDefense?": RatingBonusSchema,
  "memory?": RatingBonusSchema,
  "drainResist?": RatingBonusSchema,
  "fadingResist?": RatingBonusSchema,
  "directManaResist?": RatingBonusSchema,
  "detectionResist?": RatingBonusSchema,
  "manaIllusionResist?": RatingBonusSchema,

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
    bonusDice: "number",
  }),
});
const BonusGearAndVehicleOptionSchema = type({
  "+": "reject",
});
const BonusEssenceAndAugmentationSchema = type({
  "+": "reject",
  "selectCyberware?": type.or(
    type({
      "+": "reject",
      restrictCategory: "true",
      category: "string",
    }),
    type({ "+": "reject", restrictCategory: "false" })
  ),
  "selectSideOfBody?": "true",

  "essenceCostTimes100?": EssenceCostSchema,
});
const BonusContactAndReputationSchema = type({
  "+": "reject",
  "linkContact?": "true",
});
const BonusQualitySchema = type({
  "+": "reject",
  "selectQualityFromList?": type({
    "+": "reject",
    bonusQualityList: BonusGenericListSchema,
    "reducedBonusQualityList?": type({
      "+": "reject",
      name: "string",
      karmaReduction: "number",
    }).array(),
  }),
  // TODO: needs to be linked to a quality
  "addQualityList?": BonusGenericListSchema,
  "disableQualityList?": type({ "+": "reject", name: "string" }).array(),
});
const BonusSpecificQualitySchema = type({
  "+": "reject",
  "adapsin?": "true",
  "reflex?": "true",
  "ambidextrous?": "true",
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
});

export type BonusAttributeOptionType = typeof BonusAttributeOptionSchema.infer;
export type BonusSkillOptionType = typeof BonusSkillOptionSchema.infer;
export type BonusPowerOptionType = typeof BonusPowerOptionSchema.infer;
export type BonusSpellAndMagicOptionType =
  typeof BonusSpellAndMagicOptionSchema.infer;
export type BonusTechnomancerOptionType =
  typeof BonusTechnomancerOptionSchema.infer;
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
  "technomancer?": BonusTechnomancerOptionSchema,
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
