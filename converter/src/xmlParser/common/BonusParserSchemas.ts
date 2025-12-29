import {
  augmentationGradeEnum,
  critterPowerEnum,
  gearCategoryEnum,
  skillCategoryEnum,
  spellDescriptorEnum,
  vehicleCategoryEnum,
} from "@neon-codex/common";
import {
  attributeXMLEnum,
  augmentationXmlGradeEnum,
  GenericNameValueSchema,
  limbSlotXmlEnum,
  LimitModifierSchema,
  lockedAttributeXmlEnum,
  NaturalWeaponXmlSchema,
  NumberOrAnyRatingSchema,
  NumberOrRatingOrAttributeSchema,
  NumberOrRatingSchema,
  SkillXMLSchema,
  spellXmlCategoryEnum,
  SpiritSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "./ParserCommonDefines.js";
import { type } from "arktype";
import { weaponSubtypeEnum } from "@neon-codex/common";
import { cyberwareXmlCategoryEnum } from "../bodyModification/CyberwareParserSchemas.js";

const SkillXmlObjectSchema = type({
  "+": "reject",
  // check if name is ""
  name: "string",
  // For string, may be in form of:
  //           <val>-number(Rating >= 2)</val>
  // This means the Rating of the item giving the bonus...
  val: StringOrNumberSchema,
  // Minimum rating/level at which bonus applies
  "min?": "number",
  // Maximum rating/level before bonus stops applies
  "max?": "number",
  // Specific to quality
  // TODO: make this an enum with meaning given to all choices
  "condition?": "string",
});

const SelectAttributeXMLSchema = type.or(
  type({
    "+": "reject",
    excludeattribute: type.or(
      type.valueOf(attributeXMLEnum),
      type.valueOf(attributeXMLEnum).array()
    ),
    "max?": "number",
  }),
  type({
    "+": "reject",
    attribute: type.or(
      type.valueOf(attributeXMLEnum),
      type.valueOf(attributeXMLEnum).array()
    ),
    "val?": NumberOrRatingSchema,
  })
);

const SelectQualityXMLSchema = type.or(
  type({
    "+": "reject",
    _contributetobp: "'True'",
    _forced: "'True'",
    xmltext: "string",
  }),
  "string"
);

const PowersXMLSchema = type.or(
  type
    .or(
      type({
        "+": "reject",
        xmltext: "string",
        _select: "string",
      }),
      type({
        "+": "reject",
        xmltext: "string",
        _rating: "string",
      }),
      "string"
    )
    .array(),
  type.or(
    type({
      "+": "reject",
      xmltext: "string",
      _select: "string",
    }),
    type({
      "+": "reject",
      xmltext: "string",
      _rating: "string",
    }),
    "string"
  )
);

const MovementMultiplierXMLSchema = type({
  "+": "reject",
  category: type.or("'Swim'", "'Ground'"),
  "val?": "number",
  "percent?": "number",
});

const SelectSkillXMLSchema = type.or(
  type({
    "+": "reject",
    // Only listed skills are available
    "_limittoskill?": "string",
    // Listed skills are not available
    "_excludeskill?": "string",
    // Only listed groups are available
    "_skillgroup?": "string",
    // Skills in this categories are not available
    "_excludecategory?": "string",
    // Only skills in this categories are available
    "_skillcategory?": "string",
    // Only skills in these categories are available
    "skillcategories?": {
      category: "string[]",
    },
    // Either only knowledge skills or no knowledge skills
    "_knowledgeskills?": type.or("'True'", "'False'"),
    // Only skills of these attributes are available
    "_limittoattribute?": "string",
    // Only skills at or below this rating are available
    "_maximumrating?": "string",
    // Only skills at or above this rating are available
    "_minimumrating?": "string",
    // Placeholder text for the selection (don't select skill from list)
    "_prompt?": "string",
    // If 'True' then directly increase rating, otherwise add as a dice pool modifier
    "applytorating?": "string",
    // Amount to increase rating/dice pool by
    "val?": NumberOrRatingOrAttributeSchema,
    // Increase maximum rating by this amount
    "max?": "number",
    // Disable specialisation bonuses
    "disablespecializationeffects?": "''",
  }),
  "''"
);
export type SelectSkillXMLType = typeof SelectSkillXMLSchema.infer;

const WeaponSkillAccuracyXMLSchema = type({
  "+": "reject",
  "name?": "string",
  "selectskill?": SelectSkillXMLSchema,
  value: "number",
});
export type WeaponSkillAccuracyXMLType =
  typeof WeaponSkillAccuracyXMLSchema.infer;

const BonusOverrideSkillXMLSchema = type({
  "+": "reject",
  selectskill: SelectSkillXMLSchema,
});
const BonusOverrideAttributeXMLSchema = type({
  "+": "reject",
  selectattribute: {
    attribute: type.valueOf(attributeXMLEnum),
  },
});
const SpecificPowerXMLSchema = type({
  "+": "reject",
  name: "string",
  // power level bonus (which may be a power that increases an ability or skill)
  "val?": "number",
  "bonusoverride?": type.or(
    BonusOverrideSkillXMLSchema,
    BonusOverrideAttributeXMLSchema
  ),
});
export type SpecificPowerXMLType = typeof SpecificPowerXMLSchema.infer;

const AddQualityListXMLSchema = type.or(
  "string",
  type({
    "+": "reject",
    "_select?": "string",
    "_forced?": "'True'",
    xmltext: "string",
  })
);

const MovementReplacementXmlSchema = type({
  "+": "reject",
  // Swim is not used but included for completeness
  category: type.or("'Fly'", "'Ground'", "'Swim'"),
  speed: type.or("'sprint'", "'run'", "'walk'"),
  val: "number",
});
export type MovementReplacementXmlType =
  typeof MovementReplacementXmlSchema.infer;

// https://github.com/chummer5a/chummer5a/wiki/Improvement-Manager explains bonus properties
export const BonusXmlSchema = type.or(
  type({
    "+": "reject",
    // Attribute Bonuses and Modifiers
    // --------------------------------------------------------------------------------------------
    // bonus to an attribute
    "attribute?": type.or(
      GenericNameValueSchema,
      GenericNameValueSchema.array()
    ),
    // bonus to an attribute
    "specificattribute?": type.or(
      GenericNameValueSchema,
      GenericNameValueSchema.array()
    ),
    // Choose an attribute to link to
    "selectattributes?": type({
      "+": "reject",
      selectattribute: type.or(
        SelectAttributeXMLSchema,
        SelectAttributeXMLSchema.array()
      ),
    }),
    // Choose an attribute to link to
    // TODO: standardise this in chummer
    "selectattribute?": SelectAttributeXMLSchema,
    // Enable magic or resonance attributes
    "enableattribute?": type({
      "+": "reject",
      name: type.valueOf(lockedAttributeXmlEnum),
      // These are only for critters
      "min?": type.or("'F'", "number"),
      "max?": type.or("'F'", "number"),
      "aug?": type.or("'F'", "number"),
      "val?": type.or("'F'", "number"),
    }),
    // Replace standard min/max/augmented with new values
    "replaceattributes?": type({
      "+": "reject",
      replaceattribute: type.or(
        GenericNameValueSchema,
        GenericNameValueSchema.array()
      ),
    }),
    // modify the cost to improve an attribute
    "attributekarmacost?": type.or(
      GenericNameValueSchema,
      GenericNameValueSchema.array()
    ),
    // Limit related
    // -------------
    // modifications to test limits
    "limit?": type.or(GenericNameValueSchema, GenericNameValueSchema.array()),
    // modifications to test limits (normally with conditions)
    "limitmodifier?": type.or(LimitModifierSchema, LimitModifierSchema.array()),
    // Add levels (rank) to a limit (physical, social, mental), also increasing the maximum limit if needed
    "selectlimit?": type({
      "+": "reject",
      val: "number",
    }),
    // bonus to social limit
    "sociallimit?": NumberOrAnyRatingSchema,
    // bonus to physical limit
    "physicallimit?": NumberOrRatingSchema,
    // bonus to mental limit
    "mentallimit?": NumberOrRatingSchema,
    // increase native language limit
    "nativelanguagelimit?": "number",

    // Skill Bonuses and Modifiers
    // --------------------------------------------------------------------------------------------
    // Choose a skill to link to
    "selectskill?": SelectSkillXMLSchema,
    // Select skill expertise
    "selectexpertise?": type({
      "+": "reject",
      _limittoskill: "string",
    }),
    // bonus to a specific skill
    "specificskill?": type.or(SkillXMLSchema, SkillXMLSchema.array()),
    // bonus to tests with an attribute
    "skillattribute?": type.or(SkillXMLSchema, SkillXMLSchema.array()),
    // bonus to tests with an attribute
    "skilllinkedattribute?": type.or(SkillXMLSchema, SkillXMLSchema.array()),
    // bonus to these skill categories
    "skillcategory?": type.or(SkillXMLSchema, SkillXMLSchema.array()),
    // bonus to these skill groups (groups and categories and different...)
    "skillgroup?": type.or(SkillXMLSchema, SkillXMLSchema.array()),
    // add levels/ranks to these skill groups (so not a modifier but an actual increase)
    "skillgrouplevel?": type({
      "+": "reject",
      name: "string",
      val: "number",
    }),
    // For critters (cannot normally default on a skill), allows treating skills as untrained i.e. all defaulting
    "allowskilldefaulting?": "''",
    // Add a specialisation... not sure why it says option maybe because you can only use 1 specialisation at a time?
    "addskillspecializationoption?": type.or(
      type({
        "+": "reject",
        spec: "string",
        skill: "string",
      }),
      type({
        "+": "reject",
        spec: "string",
        skills: type({
          "+": "reject",
          // specialisation will apply to 1 of these e.g. Gun style with 1 type of gun
          skill: type.or("string[]", "string"),
        }),
      })
    ),
    // Bonus knowledge skill points
    "knowledgeskillpoints?": type({
      "+": "reject",
      val: "number",
    }),
    // You can no longer default on skills in a skill group
    // and all skills have a max rank of 0
    "blockskillgroupdefaulting?": "string",
    // You can no longer default on skills in these skill categories
    // and all skills within have a max rank of 0
    "blockskillcategorydefaulting?": StringArrayOrStringSchema,
    // skillsoft for physical active skills
    "activesoft?": type({
      "+": "reject",
      val: "'Rating'",
    }),
    // skillsoft for any skill
    "skillsoft?": type({
      "+": "reject",
      val: "'Rating'",
      "_excludecategory?": "string",
      "_skillcategory?": "string",
    }),
    // Allow using skillsofts (activesofts can only be used as knowledge not active through this)
    "skillsoftaccess?": type({
      "+": "reject",
      // Maximum skillsoft rating
      xmltext: "'Rating'",
      _precedence: "'0'",
    }),
    // max activesoft rating
    "skillwire?": type.or(
      type({
        xmltext: "string",
        _precedence: "'0'",
      }),
      "string"
    ),
    // max skillsoft/activesoft rating (only supports 1)
    "hardwires?": type.or(
      type({
        "+": "reject",
        xmltext: "'Rating'",
        _knowledgeskill: "'True'",
      }),

      type({
        "+": "reject",
        xmltext: "'Rating'",
        _excludecategory: "string",
      })
    ),
    // Karma cost related
    // TODO: in chummer source work out what ones are correct, if there is appropraite errata,
    // especially skillcategorypointcostmultiplier and skillgroupcategorykarmacostmultiplier
    // as they seem to sometimes only apply during character creation?
    // ------------------
    // Karma cost increase or decrease per category
    "skillcategorykarmacost?": type.or(
      SkillXmlObjectSchema,
      SkillXmlObjectSchema.array()
    ),
    // Karma cost multiplier times 100 for these categories
    "skillcategorykarmacostmultiplier?": type.or(
      SkillXmlObjectSchema,
      SkillXmlObjectSchema.array()
    ),
    // Karma cost multiplier times 100 for specialisations in these categories
    "skillcategoryspecializationkarmacostmultiplier?": type.or(
      SkillXmlObjectSchema,
      SkillXmlObjectSchema.array()
    ),
    // Skill cost multiplier times 100 for these categories
    // When paying with skill points (normally only available in character creation)
    "skillcategorypointcostmultiplier?": type.or(
      GenericNameValueSchema,
      GenericNameValueSchema.array()
    ),
    // Cost multiplier times 100 for skill group within these skill categories
    "skillgroupcategorykarmacostmultiplier?": type.or(
      GenericNameValueSchema.array(),
      GenericNameValueSchema
    ),
    // modify the cost to improve a active skill
    "activeskillkarmacost?": type.or(
      SkillXmlObjectSchema,
      SkillXmlObjectSchema.array()
    ),
    // modify the cost to improve a knowledge skill
    "knowledgeskillkarmacost?": type.or(
      SkillXmlObjectSchema,
      SkillXmlObjectSchema.array()
    ),
    // Karma cost cannot be reduced below minimum
    // Doesn't apply to activeskillkarmacost because that is only used
    // once so therefore can't stack to have a cost below 1
    // (as active skills lowest cost is normally 2 and actveskillkarmacost
    // is only ever -1 in practice)
    "knowledgeskillkarmacostmin?": type.or(
      SkillXmlObjectSchema,
      SkillXmlObjectSchema.array()
    ),
    // Cannot put points into the skill groups under this category
    "skillgroupcategorydisable?": type.valueOf(skillCategoryEnum),
    // Cannot put points into this skill group
    "skillgroupdisable?": StringArrayOrStringSchema,
    // Can not use the skill
    "skilldisable?": StringArrayOrStringSchema,
    // Allows taking ranks in skills if not previously able to
    "unlockskills?": type.or(
      type.or(
        "string",
        type({
          "+": "reject",
          xmltext: "string",
          _name: "string",
        })
      ),
      type
        .or("string", {
          xmltext: "string",
          _name: "string",
        })
        .array()
    ),
    // When using a certain skill use a different attribute
    "swapskillattribute?": type({
      "+": "reject",
      attribute: type.valueOf(attributeXMLEnum),
      limittoskill: "string",
    }),
    // When using a certain specialisation of a certain skill
    // use a different attribute
    "swapskillspecattribute?": type({
      "+": "reject",
      attribute: type.valueOf(attributeXMLEnum),
      limittoskill: "string",
      spec: "string",
    }),

    // Power Related Bonuses
    // --------------------------------------------------------------------------------------------
    // Choose a power to link to
    "selectpowers?": type({
      "+": "reject",
      selectpower: type({
        "+": "reject",
        // Only listed powers are available
        "_limittopowers?": "string",
        // Power can be taken multiple times
        // generally to represent multiple ranks in a power when you may choose multiple powers or the same multiple times
        "ignorerating?": "'True'",
        // Power rank bonus
        val: NumberOrRatingSchema,
        // Limit the selections where Power Points are required based on the Rating, where 1 Rating = "pointsperlevel" PP (currently always 0.25).
        "limit?": "'Rating'",
        // linked to limit
        "pointsperlevel?": "number",
      }),
    }),
    // Gives a power/bonus to a power
    "specificpower?": type.or(
      SpecificPowerXMLSchema,
      SpecificPowerXMLSchema.array()
    ),
    // Gain bonus power points
    "adeptpowerpoints?": "number",
    // Optional powers that can be bought after chargen
    "optionalpowers?": type({
      "+": "reject",
      optionalpower: PowersXMLSchema,
      // number or format like floor({MAG} div 3)
      "_count?": "string",
    }),
    // Included critter powers
    "critterpowers?": type({
      "+": "reject",
      power: PowersXMLSchema,
    }),
    "critterpowerlevels?": type({
      "+": "reject",
      power: type.or(
        type({
          "+": "reject",
          name: "string",
          val: "number",
        }),
        type({ "+": "reject", name: "string", val: "number" }).array()
      ),
    }),
    // Can add critter powers, but only from this category
    // Only "Drake" and "Infected" by default...
    "limitcritterpowercategory?": type.valueOf(critterPowerEnum),

    // Spell and Magic Bonuses
    // --------------------------------------------------------------------------------------------
    // Learn a spell
    "addspell?": type({
      "+": "reject",
      _alchemical: "'True'",
      xmltext: "string",
    }),
    // Add free spells
    "freespells?": type.or(
      // free spells equal to attribute modified by limit
      type({
        "+": "reject",
        _attribute: "string",
        _limit: "string",
      }),
      // free spells equal to ranks in a skill
      type({
        "+": "reject",
        _skill: "string",
      })
    ),
    // Choose a spell to link to
    "selectspell?": type.or(
      "''",
      type({
        "+": "reject",
        _ignorerequirements: "'True'",
      })
    ),
    // bonus to a specific spell category
    "spellcategory?": type.or(
      type({
        "+": "reject",
        // When optional it means pick a spell category
        name: "string",
        val: NumberOrRatingSchema,
      }).array(),
      type({
        "+": "reject",
        // When optional it means pick a spell category
        name: "string",
        val: NumberOrRatingSchema,
      })
    ),
    // Allows casting spells from a spell category
    "allowspellcategory?": "string",
    "spelldicepool?": type.or(
      GenericNameValueSchema,
      GenericNameValueSchema.array()
    ),
    // Cannot cast spells with this spell descriptor
    // TODO: this only applies to adepts is it correct?
    "blockspelldescriptor?": type.valueOf(spellDescriptorEnum),
    // Bonus to damage of spells using the descriptor
    "spelldescriptordamage?": type({
      "+": "reject",
      descriptor: "string",
      val: "number",
    }),
    // Bonus to damage of spells in the category
    "spellcategorydamage?": type({
      "+": "reject",
      category: type.valueOf(spellXmlCategoryEnum),
      val: "number",
    }),
    // Bonus to drain of spells using the descriptor
    "spelldescriptordrain?": type({
      "+": "reject",
      descriptor: "string",
      val: "number",
    }),
    // Bonus to drain of spells in the category
    "spellcategorydrain?": type({
      "+": "reject",
      // When optional it means pick a spell category
      "category?": type.valueOf(spellXmlCategoryEnum),
      val: "number",
    }),
    // Can only use 1 spell category
    "limitspellcategory?": type.or(
      // Empty i.e. "" for select a category
      "''",
      type.valueOf(spellXmlCategoryEnum),
      type.valueOf(spellXmlCategoryEnum).array(),
      type({
        "+": "reject",
        _exclude: type.valueOf(spellXmlCategoryEnum),
      })
    ),
    // Learn metamagic
    "addmetamagic?": type.or(
      type({ "+": "reject", _forced: "'True'", xmltext: "string" }).array(),
      type({
        "+": "reject",
        _forced: "'True'",
        xmltext: "string",
      })
    ),
    // When initiating you must take only the metamagic in
    // this list, in the order given
    "metamagiclimit?": type({
      "+": "reject",
      metamagic: type({
        "+": "reject",
        _grade: "string",
        xmltext: "string",
      }).array(),
    }),
    // Remove penalty for sustaining spells up to a certain count (round down)
    // (normally -2 dice pool to all tests while sustaining)
    "penaltyfreesustain?": type({
      "+": "reject",
      count: "string",
    }),
    // Used in conjuction with freespells to show what type of spell are available
    "allowspellrange?": StringArrayOrStringSchema,
    // Modify Karma cost
    "newspellkarmacost?": type({
      "+": "reject",
      _type: type.or("'Spells'", "'Alchemical'", "'Rituals'"),
      xmltext: "number",
    }),
    // Karma discount on binding a focus
    "focusbindingkarmacost?": type.or(
      type({
        "+": "reject",
        name: "string",
        val: "number",
        // The name/description must contain this text
        "extracontains?": "string",
      }).array(),
      type({
        "+": "reject",
        name: "string",
        val: "number",
        "extracontains?": "string",
      })
    ),
    // Modify drain value
    "drainvalue?": "number",
    // add spirits?
    "addspirit?": type.or(SpiritSchema, SpiritSchema.array()),
    // Can only use these spirit categories
    "limitspiritcategory?": type.or(
      type({
        "+": "reject",
        spirit: "string",
      }),
      type({ "+": "reject", spirit: "string" }).array(),
      "''"
    ),
    // Choose a mentor spirit to link to
    "selectmentorspirit?": "''",
    // Choose a tradition to link to
    "selecttradition?": "''",

    // Technomancer and Matrix
    // --------------------------------------------------------------------------------------------
    // Fading modification
    "fadingvalue?": type.or(
      type({ "+": "reject", _specific: "string", xmltext: "number" }).array(),
      "number"
    ),
    // Select a sprite type
    "selectsprite?": "''",
    // Select a paragon (from paragons.xml)
    "selectparagon?": "''",
    // Add an echo
    "addecho?": "string",
    // Bonus to matrix attribute
    "livingpersona?": type({
      "+": "reject",
      "attack?": "number",
      "dataprocessing?": "number",
      "firewall?": "number",
      "sleaze?": "number",
    }),
    // Resonance loss due to augmentation multiplier (divided by 100)
    "specialattburnmultiplier?": "number",

    // Combat and Weapon Bonuses
    // --------------------------------------------------------------------------------------------
    "addweapon?": type({
      "+": "reject",
      name: "string",
    }),
    // Choose a weapon to link to
    "selectweapon?": type.or(
      type({
        "+": "reject",
        _weapondetails: "string",
      }),
      "''"
    ),
    "naturalweapon?": NaturalWeaponXmlSchema,
    // bonus to a weapon attack dice pool that needs to be selected
    "weaponspecificdice?": type({
      "+": "reject",
      xmltext: "'Rating'",
      _type: "'Melee'",
    }),
    // increases the accuracy of a weapon, by increasing the physical limit for that weapon
    "weaponaccuracy?": type({
      name: "string",
      value: "number",
    }),
    // increases the accuracy of all weapons linked to a skill
    // select means this is chosen when bought
    "weaponskillaccuracy?": type.or(
      WeaponSkillAccuracyXMLSchema,
      WeaponSkillAccuracyXMLSchema.array()
    ),
    // bonus damage to weapons using specific skills
    "weaponcategorydv?": type({
      "+": "reject",
      bonus: "number",
      selectskill: SelectSkillXMLSchema,
    }),
    // bonus dice for all weapons in a category
    "weaponcategorydice?": type({
      "+": "reject",
      category: type({
        "+": "reject",
        name: type.valueOf(weaponSubtypeEnum),
        value: "number",
      }),
    }),
    "throwstr?": "number",
    "throwrangestr?": "string",
    // smartlink accuracy bonus for smartgun systems
    "smartlink?": "number",
    // Armour and Defences
    // -------------------
    // Choose an armour to link to
    "selectarmor?": "''",
    // Armour bonus, only one from each group applies
    "armor?": type.or(
      type({
        "+": "reject",
        xmltext: type.or("'Rating'", "number"),
        _group: "'0'",
      }),
      NumberOrRatingSchema,
      "'+Rating'"
    ),
    // Armour bonus against fire attacks/damage
    "firearmor?": NumberOrRatingSchema,
    // Armour bonus against electricity attacks/damage
    "electricityarmor?": NumberOrRatingSchema,
    // Armour bonus against cold attacks/damage
    "coldarmor?": NumberOrRatingSchema,
    // bonus to ranged and melee defense tests
    "defensetest?": "number",
    // bonus to all defense tests
    "dodge?": NumberOrAnyRatingSchema,
    // bonus damage
    "unarmeddv?": StringOrNumberSchema,
    // unarmed does physical instead of stun
    "unarmeddvphysical?": "string",
    "unarmedap?": NumberOrAnyRatingSchema,
    // Unarmed reach bonus
    "unarmedreach?": "number",
    // Reach with a specific bioware or quality (that likely merges limbs)
    "reach?": type.or(GenericNameValueSchema, "number"),
    // Add a martial art
    "martialart?": "string",
    // add dice for damage resistance
    "damageresistance?": NumberOrRatingSchema,
    // add dice for radiation resistance
    "radiationresist?": NumberOrRatingSchema,
    // add dice for sonic resistance
    "sonicresist?": "number",
    // Toxin and pathogen resistances/immunities
    "toxincontactresist?": NumberOrRatingSchema,
    "pathogencontactresist?": NumberOrRatingSchema,
    "toxincontactimmune?": "''",
    "pathogencontactimmune?": "''",
    "toxininhalationresist?": NumberOrRatingSchema,
    "pathogeninhalationresist?": NumberOrRatingSchema,
    "toxininhalationimmune?": "''",
    "pathogeninhalationimmune?": "''",
    "toxiningestionresist?": NumberOrRatingSchema,
    "pathogeningestionresist?": NumberOrRatingSchema,
    "toxiningestionimmune?": "''",
    "pathogeningestionimmune?": "''",
    "toxininjectionresist?": NumberOrRatingSchema,
    "pathogeninjectionresist?": NumberOrRatingSchema,
    "toxininjectionimmune?": "''",
    "pathogeninjectionimmune?": "''",

    // Condition and Recovery
    // --------------------------------------------------------------------------------------------
    // modify the condition modifier track
    "conditionmonitor?": type({
      "+": "reject",
      // ignore the negative effects of a number of boxes in any combination of track
      "sharedthresholdoffset?": NumberOrRatingSchema,
      // ignore the negative effects of a number of boxes on one track
      "thresholdoffset?": NumberOrRatingSchema,
      // reduce the number of boxes in each level when determining negative offsets
      // e.g. if -1 then every 2 boxes increase negative effects
      "threshold?": "number",
      // add boxes to physical track
      "physical?": NumberOrAnyRatingSchema,
      // add boxes to stun track
      "stun?": NumberOrRatingSchema,
      // add overflow boxes (used to determine death only)
      "overflow?": "number",
    }),
    // stun condition modifier dice bonus
    "stuncmrecovery?": NumberOrRatingSchema,
    // physical condition modifier dice bonus
    "physicalcmrecovery?": NumberOrRatingSchema,
    // Add essence as dice pool modifier to natural recovery rolls
    "addesstophysicalcmrecovery?": "''",
    // Add essence as dice pool modifier to natural recovery rolls
    "addesstostuncmrecovery?": "''",
    // Addiction and Psychological Effects
    // -----------------------------------
    // Bonus to avoid physiological addiction starting
    "physiologicaladdictionfirsttime?": NumberOrAnyRatingSchema,
    // Bonus to avoid psychological addiction starting
    "psychologicaladdictionfirsttime?": NumberOrAnyRatingSchema,
    // Bonus to avoid physiological addiction progressing
    "physiologicaladdictionalreadyaddicted?": NumberOrAnyRatingSchema,
    // Bonus to avoid psychological addiction progressing
    "psychologicaladdictionalreadyaddicted?": NumberOrAnyRatingSchema,

    // Movement and Lifestyle
    // --------------------------------------------------------------------------------------------
    // Replace movement
    "movementreplace?": type.or(
      MovementReplacementXmlSchema.array(),
      MovementReplacementXmlSchema
    ),
    // Swim and walk speed modifiers
    "walkmultiplier?": type.or(
      MovementMultiplierXMLSchema.array(),
      MovementMultiplierXMLSchema
    ),
    // Run speed modifier
    "runmultiplier?": MovementMultiplierXMLSchema,
    // Sprint speed modifier
    "sprintbonus?": MovementMultiplierXMLSchema,
    // increase to lifestyle cost
    "lifestylecost?": type.or(
      type(
        type.or(
          "number",
          type({
            "+": "reject",
            _lifestyle: "string",
            xmltext: "number",
          })
        )
      ).array(),
      type.or(
        "number",
        type({
          "+": "reject",
          _lifestyle: "string",
          xmltext: "number",
        })
      )
    ),
    // Seems to be redundant with lifestylecost
    "basiclifestylecost?": "number",

    // Test and Resistance Bonuses
    // --------------------------------------------------------------------------------------------
    // Bonuses to attribute-only tests
    // bonus to composure tests
    "composure?": "number",
    // bonus to defense for judge intentions test
    "judgeintentionsdefense?": NumberOrAnyRatingSchema,
    // bonus to offense for judge intentions test
    "judgeintentionsoffense?": NumberOrAnyRatingSchema,
    // bonus to all judge intentions test
    "judgeintentions?": NumberOrAnyRatingSchema,
    // bonus to memory tests
    "memory?": NumberOrAnyRatingSchema,
    // resist drain
    "drainresist?": NumberOrAnyRatingSchema,
    // resist fading
    "fadingresist?": NumberOrAnyRatingSchema,
    // resist all spells
    "spellresistance?": NumberOrAnyRatingSchema,
    // resist direct combat mana spells (you are attacked)
    "directmanaspellresist?": NumberOrAnyRatingSchema,
    // resist detection spells (you are being detected)
    "detectionspellresist?": NumberOrAnyRatingSchema,
    // resist illusion - mana illusion spells (try to detect mind illusion)
    "manaillusionresist?": NumberOrAnyRatingSchema,
    // resist illusion - physical illusion spells (try to detect in world illusion)
    "physicalillusionresist?": NumberOrAnyRatingSchema,
    // resist manipulation mental spells
    "mentalmanipulationresist?": NumberOrAnyRatingSchema,
    // Resist spell: Decrease [Attribute]
    "decreasebodresist?": NumberOrAnyRatingSchema,
    "decreaseagiresist?": NumberOrAnyRatingSchema,
    "decreaserearesist?": NumberOrAnyRatingSchema,
    "decreasestrresist?": NumberOrAnyRatingSchema,
    "decreasecharesist?": NumberOrAnyRatingSchema,
    "decreaseintresist?": NumberOrAnyRatingSchema,
    "decreaselogresist?": NumberOrAnyRatingSchema,
    "decreasewilresist?": NumberOrAnyRatingSchema,
    // fatigue test bonus
    "fatigueresist?": NumberOrRatingSchema,

    // Initiative and Matrix
    // --------------------------------------------------------------------------------------------
    // additional initiative (not dice)
    "initiative?": type.or("number", GenericNameValueSchema),
    // additional initiative dice
    "initiativedice?": "number",
    // additional initiative dice
    "initiativepass?": type.or(GenericNameValueSchema, "number"),
    // additional initiative (not dice, applies directly to final intiative score)
    "matrixinitiative?": "number",
    // additional matrix initiative dice
    "matrixinitiativedice?": type({
      "+": "reject",
      xmltext: "number",
      _precedence: "string",
    }),
    // additional matrix initiative dice?
    "matrixinitiativediceadd?": "number",
    // bonus for surprise tests
    "surprise?": NumberOrAnyRatingSchema,

    // Gear and Vehicles
    // --------------------------------------------------------------------------------------------
    // Add certain gear
    "addgear?": type({
      "+": "reject",
      name: "string",
      category: type.valueOf(gearCategoryEnum),
      "rating?": "number",
      "children?": type({
        "+": "reject",
        child: type({
          "+": "reject",
          name: "string",
          category: type.valueOf(gearCategoryEnum),
          rating: "number",
        }).array(),
      }),
    }),
    // Add a number of restricted gear up to an amount
    // up to an availability
    "restrictedgear?": type({
      "+": "reject",
      availability: "number",
      amount: "number",
    }),
    // Device rating bonus
    // -------------------
    "devicerating?": "number",
    // Vehicle bonuses
    // ---------------
    "seats?": StringOrNumberSchema,
    "speed?": StringOrNumberSchema,
    "offroadspeed?": StringOrNumberSchema,
    "accel?": StringOrNumberSchema,
    "offroadaccel?": StringOrNumberSchema,
    "handling?": StringOrNumberSchema,
    "offroadhandling?": StringOrNumberSchema,
    "pilot?": "string",
    "sensor?": StringOrNumberSchema,
    "body?": StringOrNumberSchema,

    // Essence and Augmentation
    // --------------------------------------------------------------------------------------------
    // Choose a cyberware to link to
    "selectcyberware?": type.or(
      type({
        "+": "reject",
        category: "string",
      }),
      "''"
    ),
    // Select side of body this applies to
    "selectside?": "''",
    // Add certain augmentation
    "addware?": type({
      "+": "reject",
      name: "string",
      grade: type.valueOf(augmentationXmlGradeEnum),
      type: "'Cyberware' | 'Bioware' | 'Genetech'",
    }),
    // cost multiplier times 100 for genetech installed
    "genetechcostmultiplier?": "number",
    // Limit of all special modification
    // This is only gained from qualities but doesn't use
    // limitwithinclusions as it is needed in weapons
    // Links with required specialmodificationlimit
    "specialmodificationlimit?": "number",
    // Modifier to essence maximum
    "essencemax?": "number",
    // essence cost
    "essencepenalty?": "number",
    // essence cost times 100 (to avoid float issues)
    // These are negative for cost, positive for bonus
    "essencepenaltyt100?": StringOrNumberSchema,
    // essence cost times 100 to determine if essence loss affects magic rating
    "essencepenaltymagonlyt100?": StringOrNumberSchema,
    // cyberware installed (multiplier is like above T100)
    "cyberwaretotalessmultiplier?": "number",
    // This seems like it needs to be combined with the above
    "cyberwareessmultiplier?": "number",
    // essence cost multiplier times 100 for bioware installed
    "biowareessmultiplier?": "number",
    "genetechessmultiplier?": "number",
    // Cannot add bioware to this character
    "disablebioware?": "''",
    // Cannot use these bioware grades
    "disablebiowaregrade?": StringArrayOrStringSchema,
    // Cannot use these cyberware grades
    "disablecyberwaregrade?": StringArrayOrStringSchema,

    // Contact and Reputation
    // --------------------------------------------------------------------------------------------
    // Add contact
    "addcontact?": type({
      "+": "reject",
      // contact loyalty
      "loyalty?": "number",
      // contact connection
      "connection?": "number",
      // seems to be an override to loyalty unless removed, then gives just loyalty... lets simplify
      "forcedloyalty?": "number",
      "forcegroup?": "''",
      "free?": "''",
      "group?": "''",
    }),
    // Choose a contact to link to
    "selectcontact?": "''",
    // Increase to Notoriety level
    "notoriety?": "number",
    // Increase astral reputation
    // Negative is good here (you don't want astral reputation)
    "astralreputation?": "number",
    // Increase public awareness
    "publicawareness?": "number",
    // Badly named, when determining street cred divide the character's lifetime karma gained
    // by 10 + this number to determine street cred instead of the normal 10
    "streetcredmultiplier?": "number",
    // Modify karma cost of adding a contact by this amount
    "contactkarma?": "number",
    // Minimum karma cost of a contact
    "contactkarmaminimum?": "number",

    // Quality
    // --------------------------------------------------------------------------------------------
    // add a quality (mainly temporary from drugs)
    "quality?": type({
      "+": "reject",
      xmltext: "string",
      _rating: "string",
    }),
    // add a quality
    "addqualities?": type({
      "+": "reject",
      addquality: type.or(
        AddQualityListXMLSchema,
        AddQualityListXMLSchema.array()
      ),
    }),
    // add a quality (by id), probably also note that if it has been added already
    // give a karma refund
    "freequality?": "string",
    // Choose a quality for no cost/bonus
    "selectquality?": type({
      "+": "reject",
      quality: type.or(SelectQualityXMLSchema, SelectQualityXMLSchema.array()),
      // if discountqualities is listed, must gain the normal quality for no cost
      // but then must select one of the discount qualities at a reduced karma bonus
      "discountqualities?": type({
        "+": "reject",
        quality: type.or(
          type({
            "+": "reject",
            _discount: "string",
            xmltext: "string",
          }).array(),
          type({
            "+": "reject",
            _discount: "string",
            xmltext: "string",
          })
        ),
      }),
    }),
    // Points that can be spent on metagenic qualities
    "metageniclimit?": "number",
    // disable quality (sometimes uses the quality guid)
    "disablequality?": StringArrayOrStringSchema,

    // specific qualities
    // --------------------------------------------------------------------------------------------
    // Reduces future cyberware essence cost
    "adapsin?": "''",
    // one of the resonace streams (like ways for adepts)
    // Allows spirit fettering to be used on a sprite
    "allowspritefettering?": "''",
    // no offhand penalty
    "ambidextrous?": "''",
    // contact with discount for a type of gear/vehicle
    "blackmarketdiscount?": "''",
    // standard grade augmentations are treated as alphagrade for essence cost
    "burnoutsway?": "''",
    // one of the resonace streams (like ways for adepts)
    // restore resonance lost through cyberware
    "cyberadeptdaemon?": "''",
    // +1 to the ability/-3 physical boxes (normally +2, so total is -1) for every 2 limbs replaced
    "cyberseeker?": StringArrayOrStringSchema,
    // discount on one type of vehicle
    "dealerconnection?": type({
      "+": "reject",
      category: type.or(type.valueOf(vehicleCategoryEnum), "'Drones'").array(),
    }),
    // no SIN
    "erased?": "''",
    // have a criminal sin and a parole officer
    "excon?": "''",
    // multiple levels of fame
    "fame?": "''",
    // additional charisma * 4 karma for contacts, no connection lower than 8
    "friendsinhighplaces?": "''",
    // discount for any power, mystical adepts also get another bonus
    "magicianswaydiscount?": "''",
    // crime syndicate contact and fence for stolen goods
    "mademan?": "''",
    // add one to one of the cyberdeck's ASDF attributes, can be reassigned
    "overclocker?": "''",
    // one extra essence exclusively for bioware but must pick from a list of
    // negative qualities (without getting the karma)
    "prototypetranshuman?": "number",
    // Quickening metamagic
    "quickeningmetamagic?": "''",
    // avoid default penalty (-1) on skills without ranks when
    // you have reflex recorder for a skill in its group
    "reflexrecorderoptimization?": "''",
    // select program that runs at all times and can't be crashed
    "selectinherentaiprogram?": "''",
    // karma given to cover a lifestyle + extra, variable depending on karma spent
    "trustfund?": "number",
    // Uneducated critter power
    "uneducated?": "''",

    // Misc
    // --------------------------------------------------------------------------------------------
    // This bonus does not stack with other bonuses of the same type
    "_unique?": "string",
    // for wireless bonus, replace normal bonus
    "_mode?": "'replace'",
    // Select from a list or...
    "selecttext?": type.or(
      type({
        _xml: "string",
        _xpath: "string",
        "_allowedit?": "string",
      }),
      // Enter a name for this item
      "''"
    ),
    // Don't show selection next to name in UI
    "_useselected?": "'False'",
    // Bonus nuyen that must be spent on gear
    "nuyenamt?": type.or(
      "number",
      type({
        "+": "reject",
        // Your gear is stolen
        _condition: "'Stolen'",
        xmltext: "number",
      })
    ),
    // Bonus to number of karma points that can be
    // converted to nuyen in character creation
    "nuyenmaxbp?": "number",
    // Choose a license to link to
    "selectrestricted?": "''",
    // Enable a tab in chummer e.g. magician tab
    "enabletab?": type({
      "+": "reject",
      name: StringArrayOrStringSchema,
      "reach?": "number",
    }),
    // Bonus dice for actions of a specific category
    "actiondicepool?": type.or(
      type({
        "+": "reject",
        _category: "'Matrix'",
      }),
      type({
        "+": "reject",
        name: "string",
        val: "number",
      })
    ),
    // add limb slot
    "addlimb?": type({
      "+": "reject",
      limbslot: type.valueOf(limbSlotXmlEnum),
      val: "number",
      "_precedence?": "'0'",
    }),
  }),
  "''"
);

export const BonusXmlWrappedSchema = type({
  "+": "reject",
  // Bonus applied by Metatype
  "bonus?": BonusXmlSchema,
});
export type BonusXmlType = typeof BonusXmlSchema.infer;
