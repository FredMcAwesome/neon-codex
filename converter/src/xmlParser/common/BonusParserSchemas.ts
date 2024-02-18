import { z as zod } from "zod";
import {
  attributeXMLEnum,
  GenericNameValueSchema,
  limbSlotXmlEnum,
  LimitModifierSchema,
  NumberOrAnyRatingSchema,
  NumberOrRatingSchema,
  SkillSchema,
  SpiritSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "./ParserCommonDefines.js";

const SkillXmlObjectSchema = zod
  .object({
    // check if name is ""
    name: zod.string(),
    val: StringOrNumberSchema,
    min: zod.optional(zod.number()),
    max: zod.optional(zod.number()),
    // Specific to quality
    // TODO: make this an enum with meaning given to all choices
    condition: zod.optional(zod.string()),
  })
  .strict();

const SelectAttributeSchema = zod.union([
  zod
    .object({
      excludeattribute: zod.union([
        zod.array(zod.nativeEnum(attributeXMLEnum)),
        zod.nativeEnum(attributeXMLEnum),
      ]),
      max: zod.optional(zod.number()),
    })
    .strict(),
  zod
    .object({
      attribute: zod.union([
        zod.array(zod.nativeEnum(attributeXMLEnum)),
        zod.nativeEnum(attributeXMLEnum),
      ]),
      val: zod.optional(zod.number()),
    })
    .strict(),
]);

const SelectQualitySchema = zod.union([
  zod
    .object({
      _contributetobp: zod.literal("True"),
      _forced: zod.literal("True"),
      xmltext: zod.string(),
    })
    .strict(),
  zod.string(),
]);

const PowersSchema = zod.union([
  zod.array(
    zod.union([
      zod
        .object({
          xmltext: zod.string(),
          _select: zod.string(),
        })
        .strict(),
      zod
        .object({
          xmltext: zod.string(),
          _rating: zod.string(),
        })
        .strict(),
      zod.string(),
    ])
  ),
  zod.union([
    zod
      .object({
        xmltext: zod.string(),
        _select: zod.string(),
      })
      .strict(),
    zod
      .object({
        xmltext: zod.string(),
        _rating: zod.string(),
      })
      .strict(),
    zod.string(),
  ]),
]);

const MovementMultiplierSchema = zod
  .object({
    category: zod.string(),
    val: zod.optional(zod.number()),
    percent: zod.optional(zod.number()),
  })
  .strict();

// https://github.com/chummer5a/chummer5a/wiki/Improvement-Manager explains bonus properties
export const BonusXmlSchema = zod.union([
  zod
    .object({
      // unique bonus... these don't seem to be used?
      _unique: zod.optional(zod.string()),
      // for wireless bonus, replace normal bonus
      _mode: zod.optional(zod.literal("replace")),
      _useselected: zod.optional(zod.literal("False")),
      // Enter a name for this item
      selecttext: zod.optional(
        zod.union([
          zod
            .object({
              _xml: zod.string(),
              _xpath: zod.string(),
              _allowedit: zod.optional(zod.string()),
            })
            .strict(),
          zod.literal(""),
        ])
      ),
      // Choose a weapon to link to
      selectweapon: zod.optional(
        zod.union([
          zod
            .object({
              _weapondetails: zod.string(),
            })
            .strict(),
          zod.literal(""),
        ])
      ),
      // Choose an armour to link to
      selectarmor: zod.optional(zod.literal("")),
      // Choose a contact to link to
      selectcontact: zod.optional(zod.literal("")),
      // Choose an attribute to link to
      selectattributes: zod.optional(
        zod
          .object({
            selectattribute: zod.union([
              zod.array(SelectAttributeSchema),
              SelectAttributeSchema,
            ]),
          })
          .strict()
      ),
      // Choose an attribute to link to
      // TODO: standardise this in chummer
      selectattribute: zod.optional(SelectAttributeSchema),
      // Choose a (negative) quality, if discount is not listed gain no karma
      // if discount is listed gain karma minus the discount amount
      selectquality: zod.optional(
        zod
          .object({
            quality: zod.union([
              zod.array(SelectQualitySchema),
              SelectQualitySchema,
            ]),
            discountqualities: zod.optional(
              zod
                .object({
                  quality: zod.union([
                    zod.array(
                      zod
                        .object({
                          _discount: zod.string(),
                          xmltext: zod.string(),
                        })
                        .strict()
                    ),
                    zod
                      .object({
                        _discount: zod.string(),
                        xmltext: zod.string(),
                      })
                      .strict(),
                  ]),
                })
                .strict()
            ),
          })
          .strict()
      ),
      // Select a sprite type
      selectsprite: zod.optional(zod.literal("")),
      // Select a paragon (from paragons.xml)
      selectparagon: zod.optional(zod.literal("")),
      // Choose a skill to link to
      selectskill: zod.optional(
        zod
          .object({
            _limittoskill: zod.optional(zod.string()),
            _knowledgeskills: zod.optional(zod.string()),
            _skillcategory: zod.optional(zod.string()),
            _limittoattribute: zod.optional(zod.string()),
            _maximumrating: zod.optional(zod.string()),
            _minimumrating: zod.optional(zod.string()),
            applytorating: zod.optional(zod.string()),
            val: zod.optional(zod.number()),
            max: zod.optional(zod.number()),
            disablespecializationeffects: zod.optional(zod.literal("")),
          })
          .strict()
      ),
      // Choose a power to link to
      selectpowers: zod.optional(
        zod
          .object({
            selectpower: zod
              .object({
                ignorerating: zod.literal("True"),
                val: zod.literal("Rating"),
                limit: zod.literal("Rating"),
                pointsperlevel: zod.number(),
              })
              .strict(),
          })
          .strict()
      ),
      selectmentorspirit: zod.optional(zod.literal("")),
      // Choose a tradition to link to
      selecttradition: zod.optional(zod.literal("")),
      // Choose a license to link to
      selectrestricted: zod.optional(zod.literal("")),
      // Choose a cyberware to link to
      selectcyberware: zod.optional(
        zod.union([
          zod
            .object({
              category: zod.string(),
            })
            .strict(),
          zod.literal(""),
        ])
      ),
      // Select side of body this applies to
      selectside: zod.optional(zod.literal("")),
      // Select skill expertise
      selectexpertise: zod.optional(
        zod
          .object({
            _limittoskill: zod.string(),
          })
          .strict()
      ),
      // Replace standard min/max/augmented with new values
      replaceattributes: zod.optional(
        zod
          .object({
            replaceattribute: zod.union([
              zod.array(GenericNameValueSchema),
              GenericNameValueSchema,
            ]),
          })
          .strict()
      ),
      // bonus to these skill categories
      skillcategory: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
      // bonus to these skill groups (groups and categories and different...)
      skillgroup: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
      addskillspecializationoption: zod.optional(
        zod
          .object({
            spec: zod.string(),
            skills: zod
              .object({
                skill: zod.union([zod.array(zod.string()), zod.string()]),
              })
              .strict(),
          })
          .strict()
      ),
      // Select a skill group, you can no longer default on skills in it
      // and all skills have a max rank of 0
      blockskillgroupdefaulting: zod.optional(zod.literal("")),
      // Select a skill category, you can no longer default on skills in it
      // and all skills have a max rank of 0
      blockskillcategorydefaulting: zod.optional(StringArrayOrStringSchema),
      // skillsoft for physical active skills
      activesoft: zod.optional(
        zod
          .object({
            val: zod.literal("Rating"),
          })
          .strict()
      ),
      // skillsoft for any skill
      skillsoft: zod.optional(
        zod
          .object({
            val: zod.literal("Rating"),
            _excludecategory: zod.optional(zod.string()),
            _skillcategory: zod.optional(zod.string()),
          })
          .strict()
      ),
      // max skillsoft rating
      skillsoftaccess: zod.optional(
        zod
          .object({
            xmltext: zod.literal("Rating"),
            _precedence: zod.literal("0"),
          })
          .strict()
      ),
      // max activesoft rating
      skillwire: zod.optional(
        zod.union([GenericNameValueSchema, zod.string()])
      ),
      // max skillsoft/activesoft rating (only supports 1)
      hardwires: zod.optional(
        zod.union([
          zod
            .object({
              xmltext: zod.literal("Rating"),
              _knowledgeskill: zod.literal("True"),
            })
            .strict(),

          zod
            .object({
              xmltext: zod.literal("Rating"),
              _excludecategory: zod.string(),
            })
            .strict(),
        ])
      ),
      // modifications to test limits
      limit: zod.optional(
        zod.union([zod.array(GenericNameValueSchema), GenericNameValueSchema])
      ),
      // modifications to test limits (normally with conditions)
      limitmodifier: zod.optional(
        zod.union([zod.array(LimitModifierSchema), LimitModifierSchema])
      ),
      // increase native language limit by 1
      nativelanguagelimit: zod.optional(zod.number()),
      // bonus to an attribute
      attribute: zod.optional(
        zod.union([zod.array(GenericNameValueSchema), GenericNameValueSchema])
      ),
      // Enable magic or resonance attributes
      enableattribute: zod.optional(
        zod
          .object({
            name: zod.union([zod.literal("MAG"), zod.literal("RES")]),
          })
          .strict()
      ),
      // bonus to an attribute
      specificattribute: zod.optional(
        zod.union([zod.array(GenericNameValueSchema), GenericNameValueSchema])
      ),
      // bonus to a specific skill
      specificskill: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
      // bonus to tests with an attribute
      skillattribute: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
      // bonus to tests with an attribute
      skilllinkedattribute: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
      // Allows taking ranks in skills if not previously able to
      unlockskills: zod.optional(
        zod.union([
          zod.union([
            zod.string(),
            zod
              .object({
                xmltext: zod.string(),
                _name: zod.string(),
              })
              .strict(),
          ]),
          zod.array(zod.string()),
        ])
      ),
      // bonus to a specific spell category
      spellcategory: zod.optional(
        zod
          .object({
            // When optional it means pick a spell category
            name: zod.optional(zod.string()),
            val: NumberOrRatingSchema,
          })
          .strict()
      ),
      // Allows casting spells from a spell category
      allowspellcategory: zod.optional(zod.string()),
      spelldicepool: zod.optional(
        zod
          .object({
            name: zod.string(),
            val: zod.number(),
          })
          .strict()
      ),
      // Cannot cast spells with this spell descriptor
      // TODO: this only applies to adepts is it correct?
      blockspelldescriptor: zod.optional(zod.string()),
      // Bonus to damage of spells using the descriptor
      spelldescriptordamage: zod.optional(
        zod
          .object({
            descriptor: zod.string(),
            val: zod.number(),
          })
          .strict()
      ),
      // Bonus to drain of spells using the descriptor
      spelldescriptordrain: zod.optional(
        zod
          .object({
            descriptor: zod.string(),
            val: zod.number(),
          })
          .strict()
      ),
      // Bonus to damage of spells in the category
      spellcategorydamage: zod.optional(
        zod
          .object({
            category: zod.string(),
            val: zod.number(),
          })
          .strict()
      ),
      // Bonus to drain of spells in the category
      spellcategorydrain: zod.optional(
        zod
          .object({
            // When optional it means pick a spell category
            category: zod.optional(zod.string()),
            val: zod.number(),
          })
          .strict()
      ),
      // Can only use 1 spell category
      limitspellcategory: zod.optional(
        zod.union([
          // Empty i.e. "" for select a category
          zod.string(),
          zod
            .object({
              _exclude: zod.string(),
            })
            .strict(),
        ])
      ),
      // Enable a tab in chummer e.g. magician tab
      enabletab: zod.optional(
        zod
          .object({
            name: StringArrayOrStringSchema,
          })
          .strict()
      ),
      // essence cost times 100 (to avoid float issues)
      // These are negative for cost, positive for bonus
      essencepenaltyt100: zod.optional(StringOrNumberSchema),
      // essence cost times 100 to determine if essence loss affects magic rating
      essencepenaltymagonlyt100: zod.optional(StringOrNumberSchema),
      // essence cost
      essencepenalty: zod.optional(zod.number()),
      // essence cost multiplier times 100 (not a copy paste error, it is times 100) for
      // cyberware installed
      cyberwaretotalessmultiplier: zod.optional(zod.number()),
      // This seems like it needs to be combined with the above
      cyberwareessmultiplier: zod.optional(zod.number()),
      // essence cost multiplier times 100 for bioware installed
      biowareessmultiplier: zod.optional(zod.number()),
      // Bonus dice for actions of a specific category
      actiondicepool: zod.optional(
        zod.object({
          _category: zod.literal("Matrix"),
        })
      ),
      // bonus to a weapon that needs to be selected
      weaponspecificdice: zod.optional(
        zod
          .object({
            xmltext: zod.literal("Rating"),
            _type: zod.literal("Melee"),
          })
          .strict()
      ),
      // increases the accuracy of a weapon
      weaponaccuracy: zod.optional(
        zod
          .object({
            name: zod.string(),
            value: zod.number(),
          })
          .strict()
      ),
      // increases the accuracy of all weapons linked to a skill
      // select means this is chosen when bought
      weaponskillaccuracy: zod.optional(
        zod
          .object({
            name: zod.optional(zod.string()),
            selectskill: zod.optional(
              zod
                .object({
                  _knowledgeskills: zod.optional(zod.literal("False")),
                  _exludecategory: zod.optional(zod.string()),
                  _skillcategory: zod.optional(zod.string()),
                  _excludeskill: zod.optional(zod.string()),
                  _excludecategory: zod.optional(zod.string()),
                })
                .strict()
            ),
            value: zod.number(),
          })
          .strict()
      ),
      // bonus damage to weapons using specific skills
      weaponcategorydv: zod.optional(
        zod
          .object({
            bonus: zod.number(),
            selectskill: zod
              .object({
                _limittoskill: zod.string(),
              })
              .strict(),
          })
          .strict()
      ),
      // smartlink accuracy bonus for smartgun systems
      smartlink: zod.optional(zod.number()),
      // additional initiative (not dice)
      initiative: zod.optional(
        zod.union([zod.number(), GenericNameValueSchema])
      ),
      // additional initiative dice
      initiativedice: zod.optional(zod.number()),
      // additional initiative dice
      initiativepass: zod.optional(GenericNameValueSchema),
      // additional matrix initiative dice
      matrixinitiativedice: zod.optional(
        zod
          .object({
            xmltext: zod.number(),
            _precedence: zod.string(),
          })
          .strict()
      ),

      // Toxin and pathogen resistances/immunities
      toxincontactresist: zod.optional(NumberOrRatingSchema),
      pathogencontactresist: zod.optional(NumberOrRatingSchema),
      toxincontactimmune: zod.optional(zod.literal("")),
      pathogencontactimmune: zod.optional(zod.literal("")),
      toxininhalationresist: zod.optional(NumberOrRatingSchema),
      pathogeninhalationresist: zod.optional(NumberOrRatingSchema),
      toxininhalationimmune: zod.optional(zod.literal("")),
      pathogeninhalationimmune: zod.optional(zod.literal("")),
      toxiningestionresist: zod.optional(NumberOrRatingSchema),
      pathogeningestionresist: zod.optional(NumberOrRatingSchema),
      toxiningestionimmune: zod.optional(zod.literal("")),
      pathogeningestionimmune: zod.optional(zod.literal("")),
      toxininjectionresist: zod.optional(NumberOrRatingSchema),
      pathogeninjectionresist: zod.optional(NumberOrRatingSchema),
      toxininjectionimmune: zod.optional(zod.literal("")),
      pathogeninjectionimmune: zod.optional(zod.literal("")),

      // fatigue test bonus
      fatigueresist: zod.optional(NumberOrRatingSchema),

      // Limit bonuses
      // bonus to social limit
      sociallimit: zod.optional(NumberOrAnyRatingSchema),
      // bonus to physical limit
      physicallimit: zod.optional(NumberOrRatingSchema),
      // bonus to mental limit
      mentallimit: zod.optional(NumberOrRatingSchema),

      // add a quality (mainly temporary from drugs)
      quality: zod.optional(
        zod
          .object({
            xmltext: zod.string(),
            _rating: zod.string(),
          })
          .strict()
      ),
      // add a quality
      addqualities: zod.optional(
        zod
          .object({
            addquality: zod.union([
              zod
                .object({
                  _forced: zod.literal("True"),
                  xmltext: zod.string(),
                })
                .strict(),
              zod.string(),
              zod.array(
                zod.union([
                  zod.string(),
                  zod
                    .object({
                      _select: zod.string(),
                      xmltext: zod.string(),
                    })
                    .strict(),
                ])
              ),
            ]),
          })
          .strict()
      ),
      // disable quality (sometimes uses the quality guid)
      disablequality: zod.optional(StringArrayOrStringSchema),
      // add dice for damage resistance
      damageresistance: zod.optional(NumberOrRatingSchema),
      // add dice for radiation resistance
      radiationresist: zod.optional(NumberOrRatingSchema),
      // add dice for sonic resistance
      sonicresist: zod.optional(zod.number()),
      // bonus damage
      unarmeddv: zod.optional(StringOrNumberSchema),
      // unarmed does physical instead of stun
      unarmeddvphysical: zod.optional(zod.string()),
      // modify the cost to improve an attribute
      attributekarmacost: zod.optional(
        zod.union([GenericNameValueSchema, zod.array(GenericNameValueSchema)])
      ),
      // modify the cost to improve a active skill
      activeskillkarmacost: zod.optional(
        zod.union([SkillXmlObjectSchema, zod.array(SkillXmlObjectSchema)])
      ),
      // modify the cost to improve a knowledge skill
      knowledgeskillkarmacost: zod.optional(
        zod.union([SkillXmlObjectSchema, zod.array(SkillXmlObjectSchema)])
      ),
      // Karma cost cannot be reduced below minimum
      knowledgeskillkarmacostmin: zod.optional(
        zod.union([SkillXmlObjectSchema, zod.array(SkillXmlObjectSchema)])
      ),
      // modify the condition modifier track
      conditionmonitor: zod.optional(
        zod
          .object({
            // ignore the negative effects of a number of boxes in any combination of track
            sharedthresholdoffset: zod.optional(NumberOrRatingSchema),
            // ignore the negative effects of a number of boxes on one track
            thresholdoffset: zod.optional(zod.number()),
            // reduce the number of boxes in each level when determining negative offsets
            // e.g. if -1 then every 2 boxes increase negative effects
            threshold: zod.optional(zod.number()),
            // add boxes to physical track
            physical: zod.optional(zod.number()),
            // add boxes to stun track
            stun: zod.optional(zod.number()),
            // add overflow boxes (used to determine death only)
            overflow: zod.optional(zod.number()),
          })
          .strict()
      ),
      // Replace movement
      movementreplace: zod.optional(
        zod.union([
          zod.array(
            zod
              .object({
                category: zod.union([
                  zod.literal("Fly"),
                  zod.literal("Ground"),
                ]),
                speed: zod.union([
                  zod.literal("sprint"),
                  zod.literal("run"),
                  zod.literal("walk"),
                ]),
                val: zod.number(),
              })
              .strict()
          ),
          zod
            .object({
              category: zod.union([zod.literal("Fly"), zod.literal("Ground")]),
              speed: zod.union([
                zod.literal("sprint"),
                zod.literal("run"),
                zod.literal("walk"),
              ]),
              val: zod.number(),
            })
            .strict(),
        ])
      ),
      // Swim and walk speed modifiers
      walkmultiplier: zod.optional(
        zod.union([
          zod.array(MovementMultiplierSchema),
          MovementMultiplierSchema,
        ])
      ),
      // Run speed modifier
      runmultiplier: zod.optional(MovementMultiplierSchema),
      // Sprint speed modifier
      sprintbonus: zod.optional(MovementMultiplierSchema),
      // increase to lifestyle cost
      lifestylecost: zod.optional(
        zod.union([
          zod.array(
            zod.union([
              zod.number(),
              zod
                .object({
                  _lifestyle: zod.string(),
                  xmltext: zod.number(),
                })
                .strict(),
            ])
          ),
          zod.union([
            zod.number(),
            zod
              .object({
                _lifestyle: zod.string(),
                xmltext: zod.number(),
              })
              .strict(),
          ]),
        ])
      ),
      // Seems to be redundant with lifestylecost
      basiclifestylecost: zod.optional(zod.number()),
      // stun condition modifier dice bonus
      stuncmrecovery: zod.optional(NumberOrRatingSchema),
      // physical condition modifier dice bonus
      physicalcmrecovery: zod.optional(NumberOrRatingSchema),
      // Armour bonus, only one from each group applies
      armor: zod.optional(
        zod.union([
          zod
            .object({
              xmltext: zod.union([zod.literal("Rating"), zod.number()]),
              _group: zod.literal("0"),
            })
            .strict(),
          NumberOrRatingSchema,
          zod.literal("+Rating"),
        ])
      ),
      // Armour bonus against fire attacks/damage
      firearmor: zod.optional(NumberOrRatingSchema),
      // Armour bonus against electricity attacks/damage
      electricityarmor: zod.optional(NumberOrRatingSchema),
      // Armour bonus against cold attacks/damage
      coldarmor: zod.optional(NumberOrRatingSchema),
      // bonus to ranged and melee defense tests
      defensetest: zod.optional(zod.number()),
      // bonus to all defense tests
      dodge: zod.optional(NumberOrAnyRatingSchema),
      // Unarmed reach bonus
      unarmedreach: zod.optional(zod.number()),
      // Reach with a specific bioware or quality (that likely extends limbs)
      reach: zod.optional(zod.union([GenericNameValueSchema, zod.number()])),

      // Addiction Bonuses
      // Bonus to avoid physiological addiction starting
      physiologicaladdictionfirsttime: zod.optional(NumberOrAnyRatingSchema),
      // Bonus to avoid psychological addiction starting
      psychologicaladdictionfirsttime: zod.optional(NumberOrAnyRatingSchema),
      // Bonus to avoid physiological addiction progressing
      physiologicaladdictionalreadyaddicted: zod.optional(
        NumberOrAnyRatingSchema
      ),
      // Bonus to avoid psychological addiction progressing
      psychologicaladdictionalreadyaddicted: zod.optional(
        NumberOrAnyRatingSchema
      ),

      // Bonuses to attribute-only tests
      // bonus to composure tests
      composure: zod.optional(zod.number()),
      // bonus to defense for judge intentions test
      judgeintentionsdefense: zod.optional(NumberOrAnyRatingSchema),
      // bonus to offense for judge intentions test
      judgeintentionsoffense: zod.optional(NumberOrAnyRatingSchema),
      // bonus to memory tests
      memory: zod.optional(NumberOrAnyRatingSchema),

      // resist drain
      drainresist: zod.optional(NumberOrAnyRatingSchema),
      // resist fading
      fadingresist: zod.optional(NumberOrAnyRatingSchema),
      // resist all spells
      spellresistance: zod.optional(NumberOrAnyRatingSchema),
      // resist direct combat mana spells (you are attacked)
      directmanaspellresist: zod.optional(NumberOrAnyRatingSchema),
      // resist detection spells (you are being detected)
      detectionspellresist: zod.optional(NumberOrAnyRatingSchema),
      // resist illusion - mana illusion spells (try to detect mind illusion)
      manaillusionresist: zod.optional(NumberOrAnyRatingSchema),
      // resist illusion - physical illusion spells (try to detect in world illusion)
      physicalillusionresist: zod.optional(NumberOrAnyRatingSchema),
      // resist manipulation mental spells
      mentalmanipulationresist: zod.optional(NumberOrAnyRatingSchema),
      // Resist spell: Decrease [Attribute]
      decreasebodresist: zod.optional(NumberOrAnyRatingSchema),
      decreaseagiresist: zod.optional(NumberOrAnyRatingSchema),
      decreaserearesist: zod.optional(NumberOrAnyRatingSchema),
      decreasestrresist: zod.optional(NumberOrAnyRatingSchema),
      decreasecharesist: zod.optional(NumberOrAnyRatingSchema),
      decreaseintresist: zod.optional(NumberOrAnyRatingSchema),
      decreaselogresist: zod.optional(NumberOrAnyRatingSchema),
      decreasewilresist: zod.optional(NumberOrAnyRatingSchema),
      // add limb slot
      addlimb: zod.optional(
        zod
          .object({
            limbslot: zod.nativeEnum(limbSlotXmlEnum),
            val: zod.number(),
            _precedence: zod.optional(zod.literal("0")),
          })
          .strict()
      ),
      // add spirits?
      addspirit: zod.optional(
        zod.union([zod.array(SpiritSchema), SpiritSchema])
      ),
      // Can only use 1 spirit category
      limitspiritcategory: zod.optional(
        zod.union([
          zod.object({
            spirit: zod.string(),
          }),
          zod.literal(""),
        ])
      ),
      // Add certain gear
      addgear: zod.optional(
        zod
          .object({
            name: zod.string(),
            category: zod.string(),
            rating: zod.optional(zod.number()),
            children: zod.optional(
              zod
                .object({
                  child: zod.array(
                    zod
                      .object({
                        name: zod.string(),
                        category: zod.string(),
                        rating: zod.number(),
                      })
                      .strict()
                  ),
                })
                .strict()
            ),
          })
          .strict()
      ),
      // Add certain augmentation
      addware: zod.optional(
        zod
          .object({
            name: zod.string(),
            grade: zod.string(),
            type: zod.string(),
          })
          .strict()
      ),
      // Add contact
      addcontact: zod.optional(
        zod
          .object({
            loyalty: zod.optional(zod.number()),
            connection: zod.optional(zod.number()),
            forcedloyalty: zod.optional(zod.number()),
            forcegroup: zod.optional(zod.literal("")),
            free: zod.literal(""),
            group: zod.literal(""),
          })
          .strict()
      ),
      // Device rating bonus
      devicerating: zod.optional(zod.number()),
      // Vehicle bonuses
      seats: zod.optional(StringOrNumberSchema),
      accel: zod.optional(StringOrNumberSchema),
      offroadaccel: zod.optional(StringOrNumberSchema),
      handling: zod.optional(StringOrNumberSchema),
      offroadhandling: zod.optional(StringOrNumberSchema),
      speed: zod.optional(StringOrNumberSchema),
      offroadspeed: zod.optional(StringOrNumberSchema),
      pilot: zod.optional(zod.string()),
      sensor: zod.optional(StringOrNumberSchema),
      body: zod.optional(StringOrNumberSchema),

      // One-off bonuses e.g. very specific to one thing
      // Reduces future cyberware essence cost
      adapsin: zod.optional(zod.literal("")),
      // avoid default penalty (-1) on skills without ranks when
      // you have reflex recorder for a skill in its group
      reflexrecorderoptimization: zod.optional(zod.literal("")),
      // no offhand penalty
      ambidextrous: zod.optional(zod.literal("")),
      // Increase to Notoriety level
      notoriety: zod.optional(zod.number()),
      // Increase astral reputation
      // Negative is good here (you don't want astral reputation)
      astralreputation: zod.optional(zod.number()),
      // Increase public awareness
      publicawareness: zod.optional(zod.number()),
      // bonus for surprise tests
      surprise: zod.optional(NumberOrAnyRatingSchema),
      // Add a martial art
      martialart: zod.optional(zod.string()),
      // Add a number of restricted gear up to an amount
      // up to an availability
      restrictedgear: zod.optional(
        zod
          .object({
            availability: zod.number(),
            amount: zod.number(),
          })
          .strict()
      ),

      // Cannot add bioware to this character
      disablebioware: zod.optional(zod.literal("")),
      // Cannot use these bioware grades
      disablebiowaregrade: zod.optional(StringArrayOrStringSchema),
      // Cannot use these cyberware grades
      disablecyberwaregrade: zod.optional(StringArrayOrStringSchema),
      // Karma cost increase or decrease per category
      skillcategorykarmacost: zod.optional(
        zod.union([zod.array(SkillXmlObjectSchema), SkillXmlObjectSchema])
      ),
      // Karma cost multiplier times 100 for these categories
      skillcategorykarmacostmultiplier: zod.optional(
        zod.union([zod.array(SkillXmlObjectSchema), SkillXmlObjectSchema])
      ),
      // Karma cost multiplier times 100 for these categories
      skillcategoryspecializationkarmacostmultiplier: zod.optional(
        zod.union([zod.array(SkillXmlObjectSchema), SkillXmlObjectSchema])
      ),
      // Skill cost multiplier times 100 for these categories
      // only applicable during character creation
      skillcategorypointcostmultiplier: zod.optional(
        zod.union([zod.array(GenericNameValueSchema), GenericNameValueSchema])
      ),
      // Skill group cost multiplier times 100 for these categories
      // only applicable during character creation
      skillgroupcategorykarmacostmultiplier: zod.optional(
        zod.union([zod.array(GenericNameValueSchema), GenericNameValueSchema])
      ),
      // Cannot put points into the skill groups under this category
      skillgroupcategorydisable: zod.optional(zod.string()),
      // Cannot put points into this skill group
      skillgroupdisable: zod.optional(StringArrayOrStringSchema),
      // Badly named, when determining street cred divide the karma gained
      // by 10 + this number to determine street cred instead of the normal 10
      streetcredmultiplier: zod.optional(zod.number()),
      // Karma discount on binding a focus
      focusbindingkarmacost: zod.optional(
        zod.union([
          zod.array(
            zod
              .object({
                name: zod.string(),
                val: zod.number(),
                extracontains: zod.optional(zod.string()),
              })
              .strict()
          ),
          zod
            .object({
              name: zod.string(),
              val: zod.number(),
              extracontains: zod.optional(zod.string()),
            })
            .strict(),
        ])
      ),
      // specific qualities
      freequality: zod.optional(zod.string()),
      burnoutsway: zod.optional(zod.literal("")),
      friendsinhighplaces: zod.optional(zod.literal("")),
      overclocker: zod.optional(zod.literal("")),
      trustfund: zod.optional(zod.number()),
      prototypetranshuman: zod.optional(zod.number()),
      excon: zod.optional(zod.literal("")),
      mademan: zod.optional(zod.literal("")),
      magicianswaydiscount: zod.optional(zod.literal("")),
      blackmarketdiscount: zod.optional(zod.literal("")),
      erased: zod.optional(zod.literal("")),
      fame: zod.optional(zod.literal("")),
      selectinherentaiprogram: zod.optional(zod.literal("")),
      dealerconnection: zod.optional(
        zod.object({ category: StringArrayOrStringSchema }).strict()
      ),
      cyberadeptdaemon: zod.optional(zod.literal("")),

      // Bonus knowledge skill points
      knowledgeskillpoints: zod.optional(
        zod.object({ val: zod.number() }).strict()
      ),
      // Points that can be spent on metagenic qualities
      metageniclimit: zod.optional(zod.number()),
      // Bonus nuyen that must be spent on gear
      nuyenamt: zod.optional(
        zod.union([
          zod.number(),
          zod
            .object({
              // Your gear is stolen
              _condition: zod.literal("Stolen"),
              xmltext: zod.number(),
            })
            .strict(),
        ])
      ),
      // Bonus to number of karma points that can be
      // converted to nuyen in character creation
      nuyenmaxbp: zod.optional(zod.number()),
      // Included critter powers
      critterpowers: zod.optional(
        zod
          .object({
            power: PowersSchema,
          })
          .strict()
      ),
      // Can add critter powers, but only from this category
      limitcritterpowercategory: zod.optional(
        zod.union([zod.literal("Drake"), zod.literal("Infected")])
      ),
      // Optional powers that can be bought after chargen
      optionalpowers: zod.optional(
        zod
          .object({
            optionalpower: PowersSchema,
          })
          .strict()
      ),
      // Add essense as dice pool modifier to natural recovery rolls
      addesstophysicalcmrecovery: zod.optional(zod.literal("")),
      // Add essense as dice pool modifier to natural recovery rolls
      addesstostuncmrecovery: zod.optional(zod.literal("")),
      // Modifier to essence maximum
      essencemax: zod.optional(zod.number()),
      // +1 to the ability for every 2 limbs replaced
      cyberseeker: zod.optional(StringArrayOrStringSchema),
      // When using a certain skill use a different attribute
      swapskillattribute: zod.optional(
        zod
          .object({
            attribute: zod.string(),
            limittoskill: zod.string(),
          })
          .strict()
      ),
      // When using a certain specialisation of a certain skill
      // use a different attribute
      swapskillspecattribute: zod.optional(
        zod
          .object({
            attribute: zod.string(),
            limittoskill: zod.string(),
            spec: zod.string(),
          })
          .strict()
      ),
      // Learn a spell
      addspell: zod.optional(
        zod
          .object({
            _alchemical: zod.literal("True"),
            xmltext: zod.string(),
          })
          .strict()
      ),
      // Learn metamagic
      addmetamagic: zod.optional(
        zod.union([
          zod.array(
            zod
              .object({
                _forced: zod.literal("True"),
                xmltext: zod.string(),
              })
              .strict()
          ),
          zod
            .object({
              _forced: zod.literal("True"),
              xmltext: zod.string(),
            })
            .strict(),
        ])
      ),
      // Used in conjuction with freespells to show what type of spell are available
      allowspellrange: zod.optional(StringArrayOrStringSchema),
      // Add free spells
      freespells: zod.optional(
        zod.union([
          // free spells equal to attribute modified by limit
          zod
            .object({
              _attribute: zod.string(),
              _limit: zod.string(),
            })
            .strict(),
          // free spells equal to ranks in a skill
          zod
            .object({
              _skill: zod.string(),
            })
            .strict(),
        ])
      ),
      // Can not use the skill
      skilldisable: zod.optional(StringArrayOrStringSchema),
      // Modify Karma cost
      newspellkarmacost: zod.optional(
        zod
          .object({
            _type: zod.optional(zod.literal("Spells")),
            xmltext: zod.optional(zod.number()),
          })
          .strict()
      ),
      // Gain bonus power points
      adeptpowerpoints: zod.optional(zod.number()),
      // Modify drain value
      drainvalue: zod.optional(zod.number()),
      // Bonus to matrix attribute
      livingpersona: zod.optional(
        zod
          .object({
            attack: zod.optional(zod.number()),
            dataprocessing: zod.optional(zod.number()),
            firewall: zod.optional(zod.number()),
            sleaze: zod.optional(zod.number()),
          })
          .strict()
      ),
      // Allows spirit fettering to be used on a sprite
      allowspritefettering: zod.optional(zod.literal("")),
      // Add an echo
      addecho: zod.optional(zod.string()),
      // Resonance loss due to augmentation multiplier (times 100)
      specialattburnmultiplier: zod.optional(zod.number()),
      // Limit of all special modification
      // This is only gained from qualities but doesn't use
      // limitwithinclusions as it is needed in weapons
      // Links with required specialmodificationlimit
      specialmodificationlimit: zod.optional(zod.number()),
      // Modify karma cost of adding a contact by this amount
      contactkarma: zod.optional(zod.number()),
      // Minimum karma cost of a contact
      contactkarmaminimum: zod.optional(zod.number()),
      // Fading modification
      fadingvalue: zod.optional(
        zod.union([
          zod.array(
            zod
              .object({
                _specific: zod.string(),
                xmltext: zod.number(),
              })
              .strict()
          ),
          zod.number(),
        ])
      ),
    })
    .strict(),
  zod.literal(""),
]);

export type BonusXmlType = zod.infer<typeof BonusXmlSchema>;
