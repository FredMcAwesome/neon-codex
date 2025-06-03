import {
  attributeXMLEnum,
  GenericNameValueSchema,
  limbSlotXmlEnum,
  LimitModifierSchema,
  lockedAttributeXmlEnum,
  NaturalWeaponSchema,
  NumberOrAnyRatingSchema,
  NumberOrRatingSchema,
  SkillSchema,
  SpiritSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "./ParserCommonDefines.js";
import { type } from "arktype";

const SkillXmlObjectSchema = type({
  // check if name is ""
  name: "string",
  val: StringOrNumberSchema,
  "min?": "number",
  "max?": "number",
  // Specific to quality
  // TODO: make this an enum with meaning given to all choices
  "condition?": "string",
});

const SelectAttributeSchema = type.or(
  {
    excludeattribute: type.or(
      type.valueOf(attributeXMLEnum),
      type.valueOf(attributeXMLEnum).array()
    ),
    "max?": "number",
  },
  {
    attribute: type.or(
      type.valueOf(attributeXMLEnum),
      type.valueOf(attributeXMLEnum).array()
    ),
    "val?": NumberOrRatingSchema,
  }
);

const SelectQualitySchema = type.or(
  {
    _contributetobp: "'True'",
    _forced: "'True'",
    xmltext: "string",
  },
  "string"
);

const PowersSchema = type.or(
  type
    .or(
      {
        xmltext: "string",
        _select: "string",
      },
      {
        xmltext: "string",
        _rating: "string",
      },
      "string"
    )
    .array(),
  type.or(
    {
      xmltext: "string",
      _select: "string",
    },
    {
      xmltext: "string",
      _rating: "string",
    },
    "string"
  )
);

const MovementMultiplierSchema = type({
  category: "string",
  "val?": "number",
  "percent?": "number",
});

const SelectSkillSchema = type.or(
  {
    "_limittoskill?": "string",
    "_excludeskill?": "string",
    "_excludecategory?": "string",
    "_knowledgeskills?": "string",
    "_skillcategory?": "string",
    "_limittoattribute?": "string",
    "_maximumrating?": "string",
    "_minimumrating?": "string",
    "_prompt?": "string",
    "skillcategories?": {
      category: "string[]",
    },
    "applytorating?": "string",
    "val?": StringOrNumberSchema,
    "max?": "number",
    "disablespecializationeffects?": "''",
  },
  "''"
);

const WeaponSkillAccuracyXMLSchema = type({
  "name?": "string",
  "selectskill?": SelectSkillSchema,
  value: "number",
});
export type WeaponSkillAccuracyXMLType =
  typeof WeaponSkillAccuracyXMLSchema.infer;

const BonusOverrideSkillXMLSchema = type({
  selectskill: {
    "_skillcategory?": "string",
    "_skillgroup?": "string",
    "_limittoskill?": "string",
    "_minimumrating?": "string",
    val: NumberOrRatingSchema,
    "skillcategories?": {
      category: "string[]",
    },
  },
});
const BonusOverrideAttributeXMLSchema = type({
  selectattribute: {
    attribute: type.valueOf(attributeXMLEnum),
  },
});
const SpecificPowerXMLSchema = type({
  name: "string",
  // How many levels of the power are given
  "val?": "number",
  "bonusoverride?": type.or(
    BonusOverrideSkillXMLSchema,
    BonusOverrideAttributeXMLSchema
  ),
});
export type SpecificPowerXMLType = typeof SpecificPowerXMLSchema.infer;

const AddQualityListXMLSchema = type.or("string", {
  "_select?": "string",
  "_forced?": "'True'",
  xmltext: "string",
});

// https://github.com/chummer5a/chummer5a/wiki/Improvement-Manager explains bonus properties
export const BonusXmlSchema = type.or(
  {
    // unique bonus... these don't seem to be used?
    "_unique?": "string",
    // for wireless bonus, replace normal bonus
    "_mode?": "'replace'",
    "_useselected?": "'False'",
    // Enter a name for this item
    "selecttext?": type.or(
      {
        _xml: "string",
        _xpath: "string",
        "_allowedit?": "string",
      },
      "''"
    ),
    // Choose a weapon to link to
    "selectweapon?": type.or(
      {
        _weapondetails: "string",
      },
      "''"
    ),
    // Choose an armour to link to
    "selectarmor?": "''",
    // Choose a contact to link to
    "selectcontact?": "''",
    // Choose an attribute to link to
    "selectattributes?": {
      selectattribute: type.or(
        SelectAttributeSchema,
        SelectAttributeSchema.array()
      ),
    },
    // Choose an attribute to link to
    // TODO: standardise this in chummer
    "selectattribute?": SelectAttributeSchema,
    // Choose a (negative) quality, if discount is not listed gain no karma
    // if discount is listed gain karma minus the discount amount
    "selectquality?": {
      quality: type.or(SelectQualitySchema, SelectQualitySchema.array()),
      "discountqualities?": {
        quality: type.or(
          type({
            _discount: "string",
            xmltext: "string",
          }).array(),
          {
            _discount: "string",
            xmltext: "string",
          }
        ),
      },
    },
    // Select a sprite type
    "selectsprite?": "''",
    // Select a paragon (from paragons.xml)
    "selectparagon?": "''",
    // Choose a skill to link to
    "selectskill?": SelectSkillSchema,
    "selectspell?": type.or("''", {
      _ignorerequirements: "'True'",
    }),
    // Choose a power to link to
    "selectpowers?": {
      selectpower: {
        "_limittopowers?": "string",
        "ignorerating?": "'True'",
        val: NumberOrRatingSchema,
        "limit?": "'Rating'",
        "pointsperlevel?": "number",
      },
    },
    "selectmentorspirit?": "''",
    // Choose a tradition to link to
    "selecttradition?": "''",
    // Choose a license to link to
    "selectrestricted?": "''",
    // Choose a cyberware to link to
    "selectcyberware?": type.or(
      {
        category: "string",
      },
      "''"
    ),
    // Select side of body this applies to
    "selectside?": "''",
    // Select skill expertise
    "selectexpertise?": {
      _limittoskill: "string",
    },
    // Replace standard min/max/augmented with new values
    "replaceattributes?": {
      replaceattribute: type.or(
        GenericNameValueSchema,
        GenericNameValueSchema.array()
      ),
    },
    // bonus to these skill categories
    "skillcategory?": type.or(SkillSchema, SkillSchema.array()),
    // bonus to these skill groups (groups and categories and different...)
    "skillgroup?": type.or(SkillSchema, SkillSchema.array()),
    "allowskilldefaulting?": "''",
    "selectlimit?": { val: "number" },
    "addskillspecializationoption?": type.or(
      {
        spec: "string",
        skill: "string",
      },
      {
        spec: "string",
        skills: {
          skill: type.or("string[]", "string"),
        },
      }
    ),
    // Select a skill group, you can no longer default on skills in it
    // and all skills have a max rank of 0
    "blockskillgroupdefaulting?": "''",
    // Select a skill category, you can no longer default on skills in it
    // and all skills have a max rank of 0
    "blockskillcategorydefaulting?": StringArrayOrStringSchema,
    // skillsoft for physical active skills
    "activesoft?": {
      val: "'Rating'",
    },
    // skillsoft for any skill
    "skillsoft?": {
      val: "'Rating'",
      "_excludecategory?": "string",
      "_skillcategory?": "string",
    },
    // max skillsoft rating
    "skillsoftaccess?": {
      xmltext: "'Rating'",
      _precedence: "'0'",
    },
    // max activesoft rating
    "skillwire?": type.or(GenericNameValueSchema, "string"),
    // max skillsoft/activesoft rating (only supports 1)
    "hardwires?": type.or(
      {
        xmltext: "'Rating'",
        _knowledgeskill: "'True'",
      },

      {
        xmltext: "'Rating'",
        _excludecategory: "string",
      }
    ),
    // modifications to test limits
    "limit?": type.or(GenericNameValueSchema, GenericNameValueSchema.array()),
    // modifications to test limits (normally with conditions)
    "limitmodifier?": type.or(LimitModifierSchema, LimitModifierSchema.array()),
    // increase native language limit by 1
    "nativelanguagelimit?": "number",
    // bonus to an attribute
    "attribute?": type.or(
      GenericNameValueSchema,
      GenericNameValueSchema.array()
    ),
    // Enable magic or resonance attributes
    "enableattribute?": {
      name: type.valueOf(lockedAttributeXmlEnum),
      "min?": type.or("'F'", "number"),
      "max?": type.or("'F'", "number"),
      "aug?": type.or("'F'", "number"),
      "val?": type.or("'F'", "number"),
    },
    // bonus to an attribute
    "specificattribute?": type.or(
      GenericNameValueSchema,
      GenericNameValueSchema.array()
    ),
    // Gives a power/bonus to a power
    "specificpower?": type.or(
      SpecificPowerXMLSchema,
      SpecificPowerXMLSchema.array()
    ),
    // bonus to a specific skill
    "specificskill?": type.or(SkillSchema, SkillSchema.array()),
    // bonus to tests with an attribute
    "skillattribute?": type.or(SkillSchema, SkillSchema.array()),
    // bonus to tests with an attribute
    "skilllinkedattribute?": type.or(SkillSchema, SkillSchema.array()),
    // Allows taking ranks in skills if not previously able to
    "unlockskills?": type.or(
      type.or("string", {
        xmltext: "string",
        _name: "string",
      }),
      type
        .or("string", {
          xmltext: "string",
          _name: "string",
        })
        .array()
    ),
    // bonus to a specific spell category
    "spellcategory?": type.or(
      type({
        // When optional it means pick a spell category
        name: "string",
        val: NumberOrRatingSchema,
      }).array(),
      {
        // When optional it means pick a spell category
        name: "string",
        val: NumberOrRatingSchema,
      }
    ),
    // Allows casting spells from a spell category
    "allowspellcategory?": "string",
    "spelldicepool?": type.or(
      GenericNameValueSchema,
      GenericNameValueSchema.array()
    ),
    // Cannot cast spells with this spell descriptor
    // TODO: this only applies to adepts is it correct?
    "blockspelldescriptor?": "string",
    // Bonus to damage of spells using the descriptor
    "spelldescriptordamage?": {
      descriptor: "string",
      val: "number",
    },
    // Bonus to drain of spells using the descriptor
    "spelldescriptordrain?": {
      descriptor: "string",
      val: "number",
    },
    // Bonus to damage of spells in the category
    "spellcategorydamage?": {
      category: "string",
      val: "number",
    },
    // Bonus to drain of spells in the category
    "spellcategorydrain?": {
      // When optional it means pick a spell category
      "category?": "string",
      val: "number",
    },
    // Can only use 1 spell category
    "limitspellcategory?": type.or(
      // Empty i.e. "" for select a category
      "string",
      "string[]",
      {
        _exclude: "string",
      }
    ),
    "metamagiclimit?": {
      metamagic: type({
        _grade: "string",
        xmltext: "string",
      }).array(),
    },
    // Enable a tab in chummer e.g. magician tab
    "enabletab?": {
      name: StringArrayOrStringSchema,
    },
    "genetechcostmultiplier?": "number",
    "genetechessmultiplier?": "number",
    // essence cost times 100 (to avoid float issues)
    // These are negative for cost, positive for bonus
    "essencepenaltyt100?": StringOrNumberSchema,
    // essence cost times 100 to determine if essence loss affects magic rating
    "essencepenaltymagonlyt100?": StringOrNumberSchema,
    // essence cost
    "essencepenalty?": "number",
    // essence cost multiplier times 100 (not a copy paste error, it is times 100) for
    // cyberware installed
    "cyberwaretotalessmultiplier?": "number",
    // This seems like it needs to be combined with the above
    "cyberwareessmultiplier?": "number",
    // essence cost multiplier times 100 for bioware installed
    "biowareessmultiplier?": "number",
    // Bonus dice for actions of a specific category
    "actiondicepool?": type.or(
      {
        _category: "'Matrix'",
      },
      {
        name: "string",
        val: "number",
      }
    ),
    // bonus to a weapon that needs to be selected
    "weaponspecificdice?": {
      xmltext: "'Rating'",
      _type: "'Melee'",
    },
    // increases the accuracy of a weapon
    "weaponaccuracy?": {
      name: "string",
      value: "number",
    },
    // increases the accuracy of all weapons linked to a skill
    // select means this is chosen when bought
    "weaponskillaccuracy?": type.or(
      WeaponSkillAccuracyXMLSchema,
      WeaponSkillAccuracyXMLSchema.array()
    ),
    // bonus damage to weapons using specific skills
    "weaponcategorydv?": {
      bonus: "number",
      selectskill: SelectSkillSchema,
    },
    "weaponcategorydice?": {
      category: {
        name: "string",
        value: "number",
      },
    },
    "throwstr?": "number",
    "throwrangestr?": "string",
    // smartlink accuracy bonus for smartgun systems
    "smartlink?": "number",
    // additional initiative (not dice)
    "initiative?": type.or("number", GenericNameValueSchema),
    // additional initiative dice
    "initiativedice?": "number",
    // additional initiative dice
    "initiativepass?": type.or(GenericNameValueSchema, "number"),
    // additional initiative (not dice)
    "matrixinitiative?": "number",
    // additional matrix initiative dice
    "matrixinitiativedice?": {
      xmltext: "number",
      _precedence: "string",
    },

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

    // fatigue test bonus
    "fatigueresist?": NumberOrRatingSchema,

    // Limit bonuses
    // bonus to social limit
    "sociallimit?": NumberOrAnyRatingSchema,
    // bonus to physical limit
    "physicallimit?": NumberOrRatingSchema,
    // bonus to mental limit
    "mentallimit?": NumberOrRatingSchema,

    // add a quality (mainly temporary from drugs)
    "quality?": {
      xmltext: "string",
      _rating: "string",
    },
    // add a quality
    "addqualities?": {
      addquality: type.or(
        AddQualityListXMLSchema,
        AddQualityListXMLSchema.array()
      ),
    },
    // disable quality (sometimes uses the quality guid)
    "disablequality?": StringArrayOrStringSchema,
    // add dice for damage resistance
    "damageresistance?": NumberOrRatingSchema,
    // add dice for radiation resistance
    "radiationresist?": NumberOrRatingSchema,
    // add dice for sonic resistance
    "sonicresist?": "number",
    // bonus damage
    "unarmeddv?": StringOrNumberSchema,
    // unarmed does physical instead of stun
    "unarmeddvphysical?": "string",
    "unarmedap?": NumberOrAnyRatingSchema,
    // modify the cost to improve an attribute
    "attributekarmacost?": type.or(
      GenericNameValueSchema,
      GenericNameValueSchema.array()
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
    "knowledgeskillkarmacostmin?": type.or(
      SkillXmlObjectSchema,
      SkillXmlObjectSchema.array()
    ),
    // modify the condition modifier track
    "conditionmonitor?": {
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
    },
    // Replace movement
    "movementreplace?": type.or(
      type({
        category: type.or("'Fly'", "'Ground'"),
        speed: type.or("'sprint'", "'run'", "'walk'"),
        val: "number",
      }).array(),
      {
        category: type.or("'Fly'", "'Ground'"),
        speed: type.or("'sprint'", "'run'", "'walk'"),
        val: "number",
      }
    ),
    // Swim and walk speed modifiers
    "walkmultiplier?": type.or(
      MovementMultiplierSchema.array(),
      MovementMultiplierSchema
    ),
    // Run speed modifier
    "runmultiplier?": MovementMultiplierSchema,
    // Sprint speed modifier
    "sprintbonus?": MovementMultiplierSchema,
    // increase to lifestyle cost
    "lifestylecost?": type.or(
      type(
        type.or("number", {
          _lifestyle: "string",
          xmltext: "number",
        })
      ).array(),
      type.or("number", {
        _lifestyle: "string",
        xmltext: "number",
      })
    ),
    // Seems to be redundant with lifestylecost
    "basiclifestylecost?": "number",
    // stun condition modifier dice bonus
    "stuncmrecovery?": NumberOrRatingSchema,
    // physical condition modifier dice bonus
    "physicalcmrecovery?": NumberOrRatingSchema,
    // Armour bonus, only one from each group applies
    "armor?": type.or(
      {
        xmltext: type.or("'Rating'", "number"),
        _group: "'0'",
      },
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
    // Unarmed reach bonus
    "unarmedreach?": "number",
    // Reach with a specific bioware or quality (that likely merges limbs)
    "reach?": type.or(GenericNameValueSchema, "number"),
    // Addiction Bonuses
    // Bonus to avoid physiological addiction starting
    "physiologicaladdictionfirsttime?": NumberOrAnyRatingSchema,
    // Bonus to avoid psychological addiction starting
    "psychologicaladdictionfirsttime?": NumberOrAnyRatingSchema,
    // Bonus to avoid physiological addiction progressing
    "physiologicaladdictionalreadyaddicted?": NumberOrAnyRatingSchema,
    // Bonus to avoid psychological addiction progressing
    "psychologicaladdictionalreadyaddicted?": NumberOrAnyRatingSchema,

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
    // add limb slot
    "addlimb?": {
      limbslot: type.valueOf(limbSlotXmlEnum),
      val: "number",
      "_precedence?": "'0'",
    },
    "addweapon?": { name: "string" },
    "naturalweapon?": NaturalWeaponSchema,
    // add spirits?
    "addspirit?": type.or(SpiritSchema, SpiritSchema.array()),
    // Can only use 1 spirit category
    "limitspiritcategory?": type.or(
      {
        spirit: "string",
      },
      type({
        spirit: "string",
      }).array(),
      "''"
    ),
    // Add certain gear
    "addgear?": {
      name: "string",
      category: "string",
      "rating?": "number",
      "children?": {
        child: type({
          name: "string",
          category: "string",
          rating: "number",
        }).array(),
      },
    },
    // Add certain augmentation
    "addware?": {
      name: "string",
      grade: "string",
      type: "string",
    },
    // Add contact
    "addcontact?": {
      "loyalty?": "number",
      "connection?": "number",
      "forcedloyalty?": "number",
      "forcegroup?": "''",
      "free?": "''",
      "group?": "''",
    },
    // Device rating bonus
    "devicerating?": "number",
    // Vehicle bonuses
    "seats?": StringOrNumberSchema,
    "accel?": StringOrNumberSchema,
    "offroadaccel?": StringOrNumberSchema,
    "handling?": StringOrNumberSchema,
    "offroadhandling?": StringOrNumberSchema,
    "speed?": StringOrNumberSchema,
    "offroadspeed?": StringOrNumberSchema,
    "pilot?": "string",
    "sensor?": StringOrNumberSchema,
    "body?": StringOrNumberSchema,

    // One-off bonuses e.g. very specific to one thing
    // Reduces future cyberware essence cost
    "adapsin?": "''",
    // avoid default penalty (-1) on skills without ranks when
    // you have reflex recorder for a skill in its group
    "reflexrecorderoptimization?": "''",
    // no offhand penalty
    "ambidextrous?": "''",
    // Increase to Notoriety level
    "notoriety?": "number",
    // Increase astral reputation
    // Negative is good here (you don't want astral reputation)
    "astralreputation?": "number",
    // Increase public awareness
    "publicawareness?": "number",
    // bonus for surprise tests
    "surprise?": NumberOrAnyRatingSchema,
    // Add a martial art
    "martialart?": "string",
    // Add a number of restricted gear up to an amount
    // up to an availability
    "restrictedgear?": {
      availability: "number",
      amount: "number",
    },

    // Cannot add bioware to this character
    "disablebioware?": "''",
    // Cannot use these bioware grades
    "disablebiowaregrade?": StringArrayOrStringSchema,
    // Cannot use these cyberware grades
    "disablecyberwaregrade?": StringArrayOrStringSchema,
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
    // Karma cost multiplier times 100 for these categories
    "skillcategoryspecializationkarmacostmultiplier?": type.or(
      SkillXmlObjectSchema,
      SkillXmlObjectSchema.array()
    ),
    // Skill cost multiplier times 100 for these categories
    // only applicable during character creation
    "skillcategorypointcostmultiplier?": type.or(
      GenericNameValueSchema,
      GenericNameValueSchema.array()
    ),
    "skillgrouplevel?": {
      name: "string",
      val: "number",
    },
    // Skill group cost multiplier times 100 for these categories
    // only applicable during character creation
    "skillgroupcategorykarmacostmultiplier?": type.or(
      GenericNameValueSchema.array(),
      GenericNameValueSchema
    ),
    // Cannot put points into the skill groups under this category
    "skillgroupcategorydisable?": "string",
    // Cannot put points into this skill group
    "skillgroupdisable?": StringArrayOrStringSchema,
    // Badly named, when determining street cred divide the karma gained
    // by 10 + this number to determine street cred instead of the normal 10
    "streetcredmultiplier?": "number",
    // Karma discount on binding a focus
    "focusbindingkarmacost?": type.or(
      type({
        name: "string",
        val: "number",
        "extracontains?": "string",
      }).array(),
      {
        name: "string",
        val: "number",
        "extracontains?": "string",
      }
    ),
    // specific qualities
    "freequality?": "string",
    "burnoutsway?": "''",
    "friendsinhighplaces?": "''",
    "overclocker?": "''",
    "trustfund?": "number",
    "prototypetranshuman?": "number",
    "excon?": "''",
    "mademan?": "''",
    "magicianswaydiscount?": "''",
    "blackmarketdiscount?": "''",
    "erased?": "''",
    "fame?": "''",
    "selectinherentaiprogram?": "''",
    "dealerconnection?": { category: StringArrayOrStringSchema },
    "cyberadeptdaemon?": "''",

    // Bonus knowledge skill points
    "knowledgeskillpoints?": { val: "number" },
    // Points that can be spent on metagenic qualities
    "metageniclimit?": "number",
    // Bonus nuyen that must be spent on gear
    "nuyenamt?": type.or("number", {
      // Your gear is stolen
      _condition: "'Stolen'",
      xmltext: "number",
    }),
    // Bonus to number of karma points that can be
    // converted to nuyen in character creation
    "nuyenmaxbp?": "number",
    // Included critter powers
    "critterpowers?": {
      power: PowersSchema,
    },
    "critterpowerlevels?": {
      power: type.or(
        {
          name: "string",
          val: "number",
        },
        type({
          name: "string",
          val: "number",
        }).array()
      ),
    },
    // Can add critter powers, but only from this category
    "limitcritterpowercategory?": type.or("'Drake'", "'Infected'"),
    // Optional powers that can be bought after chargen
    "optionalpowers?": {
      optionalpower: PowersSchema,
      "_count?": "string",
    },
    // Add essense as dice pool modifier to natural recovery rolls
    "addesstophysicalcmrecovery?": "''",
    // Add essense as dice pool modifier to natural recovery rolls
    "addesstostuncmrecovery?": "''",
    // Modifier to essence maximum
    "essencemax?": "number",
    // +1 to the ability for every 2 limbs replaced
    "cyberseeker?": StringArrayOrStringSchema,
    // When using a certain skill use a different attribute
    "swapskillattribute?": {
      attribute: "string",
      limittoskill: "string",
    },
    // When using a certain specialisation of a certain skill
    // use a different attribute
    "swapskillspecattribute?": {
      attribute: "string",
      limittoskill: "string",
      spec: "string",
    },
    // Learn a spell
    "addspell?": {
      _alchemical: "'True'",
      xmltext: "string",
    },
    // Learn metamagic
    "addmetamagic?": type.or(
      type({
        _forced: "'True'",
        xmltext: "string",
      }).array(),
      {
        _forced: "'True'",
        xmltext: "string",
      }
    ),
    // Used in conjuction with freespells to show what type of spell are available
    "allowspellrange?": StringArrayOrStringSchema,
    // Add free spells
    "freespells?": type.or(
      // free spells equal to attribute modified by limit
      {
        _attribute: "string",
        _limit: "string",
      },
      // free spells equal to ranks in a skill
      {
        _skill: "string",
      }
    ),
    // Can not use the skill
    "skilldisable?": StringArrayOrStringSchema,
    // Modify Karma cost
    "newspellkarmacost?": {
      _type: "'Spells'",
      xmltext: "number",
    },
    // Gain bonus power points
    "adeptpowerpoints?": "number",
    // Modify drain value
    "drainvalue?": "number",
    // Bonus to matrix attribute
    "livingpersona?": {
      "attack?": "number",
      "dataprocessing?": "number",
      "firewall?": "number",
      "sleaze?": "number",
    },
    // Allows spirit fettering to be used on a sprite
    "allowspritefettering?": "''",
    // Add an echo
    "addecho?": "string",
    // Resonance loss due to augmentation multiplier (times 100)
    "specialattburnmultiplier?": "number",
    // Limit of all special modification
    // This is only gained from qualities but doesn't use
    // limitwithinclusions as it is needed in weapons
    // Links with required specialmodificationlimit
    "specialmodificationlimit?": "number",
    // Modify karma cost of adding a contact by this amount
    "contactkarma?": "number",
    // Minimum karma cost of a contact
    "contactkarmaminimum?": "number",
    // Fading modification
    "fadingvalue?": type.or(
      type({
        _specific: "string",
        xmltext: "number",
      }).array(),
      "number"
    ),
    // Uneducated critter power
    "uneducated?": "''",
  },
  "''"
);

export const BonusXmlWrappedSchema = type({
  // Bonus applied by Metatype
  "bonus?": BonusXmlSchema,
});
export type BonusXmlType = typeof BonusXmlSchema.infer;
