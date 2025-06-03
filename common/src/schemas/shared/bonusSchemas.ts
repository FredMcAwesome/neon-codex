import { type } from "arktype";
import {
  attributeTypeEnum,
  damageTypeEnum,
  limbSlotEnum,
  limitCategoryEnum,
  mathOperatorEnum,
  spellCategoryEnum,
  weaponTypeEnum,
} from "../../enums.js";
import { EssenceCostSchema } from "./commonSchemas.js";
const RatingCalculationSchema = type(
  type.or(
    "number",
    {
      option: "'Rating'",
    },
    { operator: type.valueOf(mathOperatorEnum) }
  )
).array();

const SelectSkillSchema = type.or(
  {
    selectSkill: "true",
    exceptions: "string[]",
  },
  {
    selectSkill: "false",
    name: "string",
  }
);
export type SelectSkillType = typeof SelectSkillSchema.infer;

export const BonusGenericListSchema = type(
  type({
    name: "string",
    "rating?": "number",
  })
).array();
export type BonusGenericListType = typeof BonusGenericListSchema.infer;

export const ForbiddenQualityListSchema = type("string[]");
export type ForbiddenQualityListType = typeof ForbiddenQualityListSchema.infer;

const AddictionResistanceSchema = type({
  "physiological?": type({
    initialTest: type(
      type.or(
        "number",
        type({
          option: "'Rating'",
        }),
        type({
          operator: type.valueOf(mathOperatorEnum),
        })
      )
    ).array(),
    progressingTest: type(
      type.or(
        "number",
        type({
          option: "'Rating'",
        }),
        type({
          operator: type.valueOf(mathOperatorEnum),
        })
      )
    ).array(),
  }),
  "psychological?": type({
    initialTest: type(
      type.or(
        "number",
        type({
          option: "'Rating'",
        }),
        type({
          operator: type.valueOf(mathOperatorEnum),
        })
      )
    ).array(),
    progressingTest: type(
      type.or(
        "number",
        type({
          option: "'Rating'",
        }),
        type({
          operator: type.valueOf(mathOperatorEnum),
        })
      )
    ).array(),
  }),
});
export type AddictionResistanceType = typeof AddictionResistanceSchema.infer;

export const InitiativeSchema = type({
  "bonus?": type.or({ ratingLinked: "number[]" }, "number"),
  "bonusDice?": type.or(
    { ratingLinked: "number[]" },
    type({
      option: "'Rating'",
    }),
    "number"
  ),
});
export type InitiativeType = typeof InitiativeSchema.infer;

export const BonusSchema = type({
  "enterName?": "true",
  "selection?": {
    "customAllowed?": "true",
    optionList: "string[]",
  },
  "linkWeapon?": "true",
  "linkArmour?": "true",
  "linkSkill?": "true",
  "linkParagon?": "true",
  "linkPower?": "true",
  "linkMentorSpirit?": "true",
  "linkTradition?": "true",
  "linkLicense?": "true",
  "linkCyberware?": "true",
  // TODO: fix these, should also have condition
  "skillCategories?": type({
    category: "string",
    bonus: type(
      type.or(
        "number",
        type({
          option: "'Rating'",
        }),
        type({
          operator: type.valueOf(mathOperatorEnum),
        })
      )
    ).array(),
  }).array(),
  "skillGroups?": type(
    type({
      group: "string",
      bonus: type(
        type.or(
          "number",
          {
            option: "'Rating'",
          },
          {
            operator: type.valueOf(mathOperatorEnum),
          }
        )
      ).array(),
    })
  ).array(),
  "activeSoft?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "skillSoft?": type({
    bonus: type.or(
      "number",
      type({
        option: "'Rating'",
      })
    ),
    // don't apply bonus to this category
    "excludedCategory?": "string",
    // only apply bonus to this category
    "specificCategory?": "string",
  }),
  "skillSoftMaxRating?": type({
    bonus: type.or(
      "number",
      type({
        option: "'Rating'",
      })
    ),
    // only for hardwires
    "supportedSkillCategory?": type.valueOf(limitCategoryEnum),
  }),
  "activeSoftMaxRating?": type.or("number", {
    option: "'Rating'",
  }),
  "limit?": {
    limitCategory: type.valueOf(limitCategoryEnum),
    bonus: type.or("number", {
      option: "'Rating'",
    }),
    // TODO: fix the conditions?
    "condition?": "string",
  },

  // TODO: fix, this can also change the max and other things..
  "attribute?": type({
    name: type.valueOf(attributeTypeEnum),
    bonus: type.or("number", {
      option: "'Rating'",
    }),
  }).array(),
  "skill?": type({
    group: "string",
    bonus: type.or("number", {
      option: "'Rating'",
    }),
  }).array(),
  "spellCategoryList?": type({
    category: type.or(type.valueOf(spellCategoryEnum), {
      option: "'SelectCategory'",
    }),
    bonus: type.or("number", {
      option: "'Rating'",
    }),
  }).array(),

  "essenceCostTimes100?": EssenceCostSchema,
  "specificPowerList?": type({
    name: "string",
    "level?": "number",
  }).array(),
  "specificWeapon?": {
    weaponType: type.valueOf(weaponTypeEnum),
    bonus: type.or(
      "number",
      type({
        option: "'Rating'",
      })
    ),
  },
  "weaponAccuracy?": {
    weapon: "string",
    bonus: type.or(
      "number",
      type({
        option: "'Rating'",
      })
    ),
  },

  "weaponSkillAccuracyList?": type({
    skill: SelectSkillSchema,
    bonus: type.or("number", {
      option: "'Rating'",
    }),
  }).array(),
  "smartlinkAccuracy?": "number",
  "initiative?": InitiativeSchema,
  "matrixInitiative?": {
    bonusDice: "number",
  },

  "toxinContactResist?": type.or("number", {
    option: "'Rating'",
  }),
  "pathogenContactResist?": type.or("number", {
    option: "'Rating'",
  }),
  "toxinContactImmune?": "true",
  "pathogenContactImmune?": "true",
  "toxinInhalationResist?": type.or("number", {
    option: "'Rating'",
  }),
  "pathogenInhalationResist?": type.or("number", {
    option: "'Rating'",
  }),
  "toxinInhalationImmune?": "true",
  "pathogenInhalationImmune?": "true",
  "toxinIngestionResist?": type.or("number", {
    option: "'Rating'",
  }),
  "pathogenIngestionResist?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "toxinIngestionImmune?": "true",
  "pathogenIngestionImmune?": "true",
  "toxinInjectionResist?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "pathogenInjectionResist?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "toxinInjectionImmune?": "true",
  "pathogenInjectionImmune?": "true",
  "fatigueResist?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "socialLimit?": type(
    type.or(
      "number",
      type({
        option: "'Rating'",
      }),
      { operator: type.valueOf(mathOperatorEnum) }
    )
  ).array(),

  "physicalLimit?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "mentalLimit?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  // TODO: needs to be linked to a quality
  "qualityList?": BonusGenericListSchema,
  "disableQualities?": type(
    type({
      name: "string",
    })
  ).array(),
  "damageResistance?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "radiationResistance?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "sonicResistance?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "unarmedDamage?": type(
    type.or(
      "number",
      type({
        option: "'Rating'",
      }),
      { operator: type.valueOf(mathOperatorEnum) }
    )
  ).array(),
  "unarmedDamageType?": type.valueOf(damageTypeEnum),
  "modifyAttributeImprovementKarmaCost?": type({
    name: type.valueOf(attributeTypeEnum),
    bonus: type.or("number", {
      option: "'Rating'",
    }),
  }).array(),

  "modifySkillImprovementKarmaCost?": type({
    skillRating: type.or(
      {
        minimum: "number",
      },
      {
        maximum: "number",
      }
    ),
    conditionalBonus: type.or("number", {
      RatingRequired: "number",
    }),
  }).array(),
  "ignoreConditionModifierNegativeEffects?": type.or("number", {
    option: "'Rating'",
  }),
  "addPhysicalBoxes?": type.or(
    "number",
    type({
      option: type.or("'Rating'", "'-Rating'"),
    })
  ),
  // Note: percentage speed increases stack so 50% + 50% = 100%
  "swimSpeedPercentageModifier?": "number",
  "walkSpeedPercentageModifier?": "number",
  "runSpeedPercentageModifier?": "number",
  "sprintSpeedPercentageModifier?": "number",
  "lifestyleCostModifier?": type(
    type({
      "lifestyle?": "string",
      cost: "number",
    })
  ).array(),
  "stunHealing?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "physicalHealing?": type.or(
    "number",
    type({
      option: "'Rating'",
    })
  ),
  "armour?": {
    "nonStacking?": "true",
    bonus: type.or("number", {
      option: "'Rating'",
    }),
  },

  "fireArmour?": type.or("number", {
    option: "'Rating'",
  }),
  "electricityArmour?": type.or("number", {
    option: "'Rating'",
  }),
  "coldArmour?": type.or("number", {
    option: "'Rating'",
  }),
  "dodge?": type(
    type.or(
      "number",
      {
        option: "'Rating'",
      },
      {
        operator: type.valueOf(mathOperatorEnum),
      }
    )
  ).array(),

  "unarmedReach?": "number",
  "addictionResistance?": AddictionResistanceSchema,
  "composure?": "number",
  "judgeIntentionsDefense?": RatingCalculationSchema,
  "memory?": RatingCalculationSchema,
  "drainResist?": RatingCalculationSchema,
  "fadingResist?": RatingCalculationSchema,
  "directManaResist?": RatingCalculationSchema,
  "detectionResist?": RatingCalculationSchema,
  "manaIllusionResist?": RatingCalculationSchema,

  "mentalManipulationResist?": RatingCalculationSchema,
  "decreaseBodyResist?": RatingCalculationSchema,
  "decreaseAgilityResist?": RatingCalculationSchema,
  "decreaseReasonanceResist?": RatingCalculationSchema,
  "decreaseStrengthResist?": RatingCalculationSchema,
  "decreaseCharismaResist?": RatingCalculationSchema,
  "decreaseIntuitionResist?": RatingCalculationSchema,
  "decreaseLogicResist?": RatingCalculationSchema,
  "decreaseWillpowerResist?": RatingCalculationSchema,
  "addLimb?": type({
    limbSlot: type.valueOf(limbSlotEnum),
    numberOfLimbs: "number",
  }),

  "adapsin?": "true",
  "reflex?": "true",
  "ambidextrous?": "true",
});
export type BonusType = typeof BonusSchema.infer;

export const WirelessSchema = BonusSchema.and({
  "replaceNonWireless?": "true",
});
