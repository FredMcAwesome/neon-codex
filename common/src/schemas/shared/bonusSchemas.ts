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
import { DamageSchema } from "../weaponSchemas.js";

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

const QualityListSchema = zod.array(
  zod
    .object({
      name: zod.string(),
      rating: zod.optional(zod.number()),
    })
    .strict()
);
export type QualityListType = zod.infer<typeof QualityListSchema>;

const AddictionResistanceSchema = zod
  .object({
    physiological: zod.optional(
      zod
        .object({
          initialTest: zod.union([
            zod.number(),
            zod
              .object({
                option: zod.literal("Rating"),
              })
              .strict(),
          ]),
          progressingTest: zod.union([
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
    psychological: zod.optional(
      zod
        .object({
          initialTest: zod.union([
            zod.number(),
            zod
              .object({
                option: zod.literal("Rating"),
              })
              .strict(),
          ]),
          progressingTest: zod.union([
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
  })
  .strict();

export type AddictionResistanceType = zod.infer<
  typeof AddictionResistanceSchema
>;

const InnerEssenceCostSchema = zod.union([
  zod.number(),
  zod.object({ option: zod.literal("Rating") }).strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);
export type EssenceCostType = Array<
  zod.infer<typeof InnerEssenceCostSchema> | { subnumbers: EssenceCostType }
>;
export const EssenceCostSchema: zod.ZodType<EssenceCostType> = zod.array(
  zod.union([
    InnerEssenceCostSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => EssenceCostSchema),
      })
      .strict(),
  ])
);

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
    skillGroups: zod.optional(
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
    spellCategory: zod.optional(
      zod
        .object({
          limitCategory: zod.nativeEnum(spellCategoryEnum),
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
    essenceCostTimes100: zod.optional(EssenceCostSchema),
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
    initiative: zod.optional(
      zod
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
        .strict()
    ),
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
    qualities: zod.optional(QualityListSchema),
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
    addPhysicalBoxes: zod.optional(zod.number()),
    // Note: percentage speed increases stack so 50% + 50% = 100%
    swimSpeedPercentageModifier: zod.optional(zod.number()),
    walkSpeedPercentageModifier: zod.optional(zod.number()),
    runSpeedPercentageModifier: zod.optional(zod.number()),
    sprintSpeedPercentageModifier: zod.optional(zod.number()),
    lifestyleCostModifier: zod.optional(zod.number()),
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
    dodge: zod.optional(zod.number()),
    unarmedReach: zod.optional(zod.number()),
    addictionResistance: zod.optional(AddictionResistanceSchema),
    composure: zod.optional(zod.number()),
    judgeIntentionsDefense: zod.optional(zod.number()),
    memory: zod.optional(
      zod.union([
        zod.number(),
        zod
          .object({
            option: zod.literal("Rating"),
          })
          .strict(),
      ])
    ),
    drainResist: zod.optional(zod.number()),
    fadingResist: zod.optional(zod.number()),
    directManaResist: zod.optional(zod.number()),
    detectionResist: zod.optional(zod.number()),
    manaIllusionResist: zod.optional(zod.number()),
    mentalManipulationResist: zod.optional(zod.number()),
    decreaseBodyResist: zod.optional(zod.number()),
    decreaseAgilityResist: zod.optional(zod.number()),
    decreaseReasonanceResist: zod.optional(zod.number()),
    decreaseStrengthResist: zod.optional(zod.number()),
    decreaseCharismaResist: zod.optional(zod.number()),
    decreaseIntuitionResist: zod.optional(zod.number()),
    decreaseLogicResist: zod.optional(zod.number()),
    decreaseWillpowerResist: zod.optional(zod.number()),
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
