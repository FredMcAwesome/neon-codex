import { z as zod } from "zod";
import {
  attributeTypeEnum,
  damageTypeEnum,
  limbSlotEnum,
  limitCategoryEnum,
  mathOperatorEnum,
  spellCategoryEnum,
  weaponTypeEnum,
} from "../../enums.js";
import { DamageSchema } from "../equipment/combat/weaponSchemas.js";
import { EssenceCostSchema } from "./commonSchemas.js";

const SelectSkillSchema = zod.discriminatedUnion("selectSkill", [
  zod
    .object({
      selectSkill: zod.literal(true),
      exceptions: zod.array(zod.string()),
    })
    .strict(),
  zod
    .object({
      selectSkill: zod.literal(false),
      name: zod.string(),
    })
    .strict(),
]);
export type SelectSkillType = zod.infer<typeof SelectSkillSchema>;

export const BonusGenericListSchema = zod.array(
  zod
    .object({
      name: zod.string(),
      rating: zod.optional(zod.number()),
    })
    .strict()
);
export type BonusGenericListType = zod.infer<typeof BonusGenericListSchema>;

export const ForbiddenQualityListSchema = zod.array(zod.string());
export type ForbiddenQualityListType = zod.infer<
  typeof ForbiddenQualityListSchema
>;

const AddictionResistanceSchema = zod
  .object({
    physiological: zod.optional(
      zod
        .object({
          initialTest: zod.array(
            zod.union([
              zod.number(),
              zod
                .object({
                  option: zod.literal("Rating"),
                })
                .strict(),
              zod
                .object({
                  operator: zod.nativeEnum(mathOperatorEnum),
                })
                .strict(),
            ])
          ),
          progressingTest: zod.array(
            zod.union([
              zod.number(),
              zod
                .object({
                  option: zod.literal("Rating"),
                })
                .strict(),
              zod
                .object({
                  operator: zod.nativeEnum(mathOperatorEnum),
                })
                .strict(),
            ])
          ),
        })
        .strict()
    ),
    psychological: zod.optional(
      zod
        .object({
          initialTest: zod.array(
            zod.union([
              zod.number(),
              zod
                .object({
                  option: zod.literal("Rating"),
                })
                .strict(),
              zod
                .object({
                  operator: zod.nativeEnum(mathOperatorEnum),
                })
                .strict(),
            ])
          ),
          progressingTest: zod.array(
            zod.union([
              zod.number(),
              zod
                .object({
                  option: zod.literal("Rating"),
                })
                .strict(),
              zod
                .object({
                  operator: zod.nativeEnum(mathOperatorEnum),
                })
                .strict(),
            ])
          ),
        })
        .strict()
    ),
  })
  .strict();

export type AddictionResistanceType = zod.infer<
  typeof AddictionResistanceSchema
>;

export const InitiativeSchema = zod
  .object({
    bonus: zod.optional(
      zod.union([
        zod.object({ ratingLinked: zod.array(zod.number()) }).strict(),
        zod.number(),
      ])
    ),
    bonusDice: zod.optional(
      zod.union([
        zod.object({ ratingLinked: zod.array(zod.number()) }).strict(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
        zod.number(),
      ])
    ),
  })
  .strict();
export type InitiativeType = zod.infer<typeof InitiativeSchema>;

export const BonusSchema = zod
  .object({
    enterName: zod.optional(zod.boolean()),
    selection: zod.optional(
      zod.object({
        customAllowed: zod.optional(zod.literal(true)),
        optionList: zod.array(zod.string()),
      })
    ),
    linkWeapon: zod.optional(zod.boolean()),
    linkArmour: zod.optional(zod.boolean()),
    linkSkill: zod.optional(zod.boolean()),
    linkPower: zod.optional(zod.boolean()),
    linkTradition: zod.optional(zod.boolean()),
    linkLicense: zod.optional(zod.boolean()),
    linkCyberware: zod.optional(zod.boolean()),
    // TODO: fix these, should also have condition
    skillCategories: zod.optional(
      zod.array(
        zod
          .object({
            category: zod.string(),
            bonus: zod.array(
              zod.union([
                zod.number(),
                zod
                  .object({
                    option: zod.literal("Rating"),
                  })
                  .strict(),
                zod
                  .object({
                    operator: zod.nativeEnum(mathOperatorEnum),
                  })
                  .strict(),
              ])
            ),
          })
          .strict()
      )
    ),
    skillGroups: zod.optional(
      zod.array(
        zod
          .object({
            group: zod.string(),
            bonus: zod.array(
              zod.union([
                zod.number(),
                zod
                  .object({
                    option: zod.literal("Rating"),
                  })
                  .strict(),
                zod
                  .object({
                    operator: zod.nativeEnum(mathOperatorEnum),
                  })
                  .strict(),
              ])
            ),
          })
          .strict()
      )
    ),
    activeSoft: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    skillSoft: zod.optional(
      zod
        .object({
          bonus: zod.union([
            zod.number(),
            zod
              .object({
                option: zod.literal("Rating"),
              })
              .strict(),
          ]),
          // don't apply bonus to this category
          excludedCategory: zod.optional(zod.string()),
          // only apply bonus to this category
          specificCategory: zod.optional(zod.string()),
        })
        .strict()
    ),
    skillSoftMaxRating: zod.optional(
      zod
        .object({
          bonus: zod.union([
            zod.number(),
            zod
              .object({
                option: zod.literal("Rating"),
              })
              .strict(),
          ]),
          // only for hardwires
          supportedSkillCategory: zod.optional(
            zod.nativeEnum(limitCategoryEnum)
          ),
        })
        .strict()
    ),
    activeSoftMaxRating: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    limit: zod.optional(
      zod
        .object({
          limitCategory: zod.nativeEnum(limitCategoryEnum),
          bonus: zod.union([
            zod.number(),
            zod
              .object({
                option: zod.literal("Rating"),
              })
              .strict(),
          ]),
          // TODO: fix the conditions?
          condition: zod.optional(zod.string()),
        })
        .strict()
    ),
    // TODO: fix, this can also change the max and other things..
    attribute: zod.optional(
      zod.array(
        zod
          .object({
            name: zod.nativeEnum(attributeTypeEnum),
            bonus: zod.union([
              zod.number(),
              zod
                .object({
                  option: zod.literal("Rating"),
                })
                .strict(),
            ]),
          })
          .strict()
      )
    ),
    skill: zod.optional(
      zod.array(
        zod
          .object({
            group: zod.string(),
            bonus: zod.union([
              zod.number(),
              zod
                .object({
                  option: zod.literal("Rating"),
                })
                .strict(),
            ]),
          })
          .strict()
      )
    ),
    spellCategoryList: zod.optional(
      zod.array(
        zod
          .object({
            category: zod.union([
              zod.nativeEnum(spellCategoryEnum),
              zod.object({ option: zod.literal("SelectCategory") }).strict(),
            ]),
            bonus: zod.union([
              zod.number(),
              zod
                .object({
                  option: zod.literal("Rating"),
                })
                .strict(),
            ]),
          })
          .strict()
      )
    ),
    essenceCostTimes100: zod.optional(EssenceCostSchema),
    specificPower: zod.optional(zod.string()),
    specificWeapon: zod.optional(
      zod
        .object({
          weaponType: zod.nativeEnum(weaponTypeEnum),
          bonus: zod.union([
            zod.number(),
            zod
              .object({
                option: zod.literal("Rating"),
              })
              .strict(),
          ]),
        })
        .strict()
    ),
    weaponAccuracy: zod.optional(
      zod
        .object({
          weapon: zod.string(),
          bonus: zod.union([
            zod.number(),
            zod
              .object({
                option: zod.literal("Rating"),
              })
              .strict(),
          ]),
        })
        .strict()
    ),
    weaponSkillAccuracy: zod.optional(
      zod
        .object({
          skill: SelectSkillSchema,
          bonus: zod.union([
            zod.number(),
            zod
              .object({
                option: zod.literal("Rating"),
              })
              .strict(),
          ]),
        })
        .strict()
    ),
    smartlinkAccuracy: zod.optional(zod.number()),
    initiative: zod.optional(InitiativeSchema),
    matrixInitiative: zod.optional(
      zod
        .object({
          bonusDice: zod.number(),
        })
        .strict()
    ),
    toxinContactResist: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    pathogenContactResist: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    toxinContactImmune: zod.optional(zod.boolean()),
    pathogenContactImmune: zod.optional(zod.boolean()),
    toxinInhalationResist: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    pathogenInhalationResist: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    toxinInhalationImmune: zod.optional(zod.boolean()),
    pathogenInhalationImmune: zod.optional(zod.boolean()),
    toxinIngestionResist: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    pathogenIngestionResist: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    toxinIngestionImmune: zod.optional(zod.boolean()),
    pathogenIngestionImmune: zod.optional(zod.boolean()),
    toxinInjectionResist: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    pathogenInjectionResist: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    toxinInjectionImmune: zod.optional(zod.boolean()),
    pathogenInjectionImmune: zod.optional(zod.boolean()),
    fatigueResist: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    socialLimit: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
        ])
      )
    ),
    physicalLimit: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    mentalLimit: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    // TODO: needs to be linked to a quality
    qualities: zod.optional(BonusGenericListSchema),
    disableQualities: zod.optional(
      zod.array(
        zod
          .object({
            name: zod.string(),
          })
          .strict()
      )
    ),
    damageResistance: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    radiationResistance: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    sonicResistance: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    unarmedDamage: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
        ])
      )
    ),
    unarmedDamageType: zod.optional(zod.nativeEnum(damageTypeEnum)),
    modifyAttributeImprovementKarmaCost: zod.optional(
      zod.array(
        zod
          .object({
            name: zod.nativeEnum(attributeTypeEnum),
            bonus: zod.union([
              zod.number(),
              zod
                .object({
                  option: zod.literal("Rating"),
                })
                .strict(),
            ]),
          })
          .strict()
      )
    ),
    modifySkillImprovementKarmaCost: zod.optional(
      zod.array(
        zod
          .object({
            skillRating: zod.union([
              zod
                .object({
                  minimum: zod.number(),
                })
                .strict(),
              zod
                .object({
                  maximum: zod.number(),
                })
                .strict(),
            ]),
            conditionalBonus: zod.union([
              zod.number(),
              zod
                .object({
                  RatingRequired: zod.number(),
                })
                .strict(),
            ]),
          })
          .strict()
      )
    ),
    ignoreConditionModifierNegativeEffects: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    addPhysicalBoxes: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.union([zod.literal("Rating"), zod.literal("-Rating")]),
          })
          .strict(),
      ])
    ),
    // Note: percentage speed increases stack so 50% + 50% = 100%
    swimSpeedPercentageModifier: zod.optional(zod.number()),
    walkSpeedPercentageModifier: zod.optional(zod.number()),
    runSpeedPercentageModifier: zod.optional(zod.number()),
    sprintSpeedPercentageModifier: zod.optional(zod.number()),
    lifestyleCostModifier: zod.optional(
      zod.array(
        zod
          .object({
            lifestyle: zod.optional(zod.string()),
            cost: zod.number(),
          })
          .strict()
      )
    ),
    stunHealing: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    physicalHealing: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    armour: zod.optional(
      zod
        .object({
          nonStacking: zod.optional(zod.boolean()),
          bonus: zod.union([
            zod.number(),
            zod
              .object({
                option: zod.literal("Rating"),
              })
              .strict(),
          ]),
        })
        .strict()
    ),
    fireArmour: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    electricityArmour: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    coldArmour: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    dodge: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    unarmedReach: zod.optional(zod.number()),
    addictionResistance: zod.optional(AddictionResistanceSchema),
    composure: zod.optional(zod.number()),
    judgeIntentionsDefense: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    memory: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    drainResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    fadingResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    directManaResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    detectionResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    manaIllusionResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    mentalManipulationResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    decreaseBodyResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    decreaseAgilityResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    decreaseReasonanceResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    decreaseStrengthResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    decreaseCharismaResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    decreaseIntuitionResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    decreaseLogicResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    decreaseWillpowerResist: zod.optional(
      zod.array(
        zod.union([
          zod.number(),
          zod
            .object({
              option: zod.literal("Rating"),
            })
            .strict(),
          zod
            .object({
              operator: zod.nativeEnum(mathOperatorEnum),
            })
            .strict(),
        ])
      )
    ),
    addLimb: zod.optional(
      zod
        .object({
          limbSlot: zod.nativeEnum(limbSlotEnum),
          numberOfLimbs: zod.number(),
        })
        .strict()
    ),
    adapsin: zod.optional(zod.boolean()),
    reflex: zod.optional(zod.boolean()),
    ambidextrous: zod.optional(zod.boolean()),
  })
  .strict();
export type BonusType = zod.infer<typeof BonusSchema>;

export const WirelessSchema = BonusSchema.extend({
  replaceNonWireless: zod.optional(zod.boolean()),
});

export const WeaponBonusSchema = zod
  .object({
    ap: zod.optional(zod.number()),
    apReplace: zod.optional(zod.number()),
    damage: zod.optional(DamageSchema),
    damageReplace: zod.optional(zod.string()),
    damageType: zod.optional(zod.string()),
    modeReplace: zod.optional(zod.string()),
    useRange: zod.optional(zod.string()),
    accuracy: zod.optional(zod.number()),
    accuracyReplace: zod.optional(zod.number()),
    extraDiceIfSmartlinkEnabled: zod.optional(zod.number()),
  })
  .strict();
export type WeaponBonusType = zod.infer<typeof WeaponBonusSchema>;
