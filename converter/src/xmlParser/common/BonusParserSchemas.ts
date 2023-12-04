import { z as zod } from "zod";
import {
  attributeXMLEnum,
  GenericNameValueSchema,
  limbSlotXmlEnum,
  LimitModifierSchema,
  NumberOrRatingSchema,
  SkillSchema,
  SpiritSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "./ParserCommonDefines.js";

// https://github.com/chummer5a/chummer5a/wiki/Improvement-Manager explains bonus properties
export const BonusXmlSchema = zod.union([
  zod
    .object({
      // unique bonus... these don't seem to be used?
      _unique: zod.optional(zod.string()),
      // for wireless bonus, replace normal bonus
      _mode: zod.optional(zod.literal("replace")),
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
      // Choose an attribute to link to
      selectattribute: zod.optional(
        zod
          .object({
            excludeattribute: zod.array(zod.nativeEnum(attributeXMLEnum)),
          })
          .strict()
      ),
      // Choose a skill to link to
      selectskill: zod.optional(
        zod
          .object({
            _limittoskill: zod.optional(zod.string()),
            _knowledgeskills: zod.optional(zod.string()),
            _skillcategory: zod.optional(zod.string()),
            _limittoattribute: zod.optional(zod.string()),
            _maximumrating: zod.optional(zod.string()),
            applytorating: zod.optional(zod.string()),
            val: zod.optional(zod.number()),
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
      // bonus to these skill categories
      skillcategory: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
      // bonus to these skill groups (groups and categories and different...)
      skillgroup: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
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
      // bonus to an attribute
      attribute: zod.optional(
        zod.union([zod.array(GenericNameValueSchema), GenericNameValueSchema])
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
      // bonus to a specific spell category
      spellcategory: zod.optional(
        zod
          .object({
            name: zod.string(),
            val: zod.literal("Rating"),
          })
          .strict()
      ),
      // essence cost times 100 (to avoid float issues)
      essencepenaltyt100: zod.optional(zod.string()),
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
                })
                .strict()
            ),
            value: zod.number(),
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
      sociallimit: zod.optional(StringOrNumberSchema),
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
            addquality: zod.union([zod.string(), zod.array(zod.string())]),
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
      // modify the cost to improve a knowledge skill
      knowledgeskillkarmacost: zod.optional(
        zod.union([GenericNameValueSchema, zod.array(GenericNameValueSchema)])
      ),
      // modify the condition modifier track
      conditionmonitor: zod.optional(
        zod
          .object({
            // ignore the negative effects of a number of boxes on one track
            sharedthresholdoffset: zod.optional(NumberOrRatingSchema),
            // add boxes to physical track
            physical: zod.optional(zod.number()),
          })
          .strict()
      ),
      // Swim and walk speed modifiers
      walkmultiplier: zod.optional(
        zod
          .object({
            category: zod.union([zod.literal("Ground"), zod.literal("Swim")]),
            val: zod.optional(zod.number()),
            percent: zod.optional(zod.number()),
          })
          .strict()
      ),
      // Run speed modifier
      runmultiplier: zod.optional(
        zod
          .object({
            category: zod.string(),
            val: zod.optional(zod.number()),
            percent: zod.optional(zod.number()),
          })
          .strict()
      ),
      // Sprint speed modifier
      sprintbonus: zod.optional(
        zod
          .object({
            category: zod.string(),
            val: zod.optional(zod.number()),
            percent: zod.optional(zod.number()),
          })
          .strict()
      ),
      // increase to lifestyle cost
      lifestylecost: zod.optional(zod.number()),
      // stun condition modifier dice bonus
      stuncmrecovery: zod.optional(NumberOrRatingSchema),
      // physical condition modifier dice bonus
      physicalcmrecovery: zod.optional(NumberOrRatingSchema),
      // Armour bonus, only one from each group applies
      armor: zod.optional(
        zod.union([
          zod
            .object({
              xmltext: zod.literal("Rating"),
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
      dodge: zod.optional(zod.number()),
      // Unarmed reach bonus
      unarmedreach: zod.optional(zod.number()),
      // Reach with a specific bioware
      reach: zod.optional(GenericNameValueSchema),

      // Addiction Bonuses
      // Bonus to avoid physiological addiction starting
      physiologicaladdictionfirsttime: zod.optional(NumberOrRatingSchema),
      // Bonus to avoid psychological addiction starting
      psychologicaladdictionfirsttime: zod.optional(NumberOrRatingSchema),
      // Bonus to avoid physiological addiction progressing
      physiologicaladdictionalreadyaddicted: zod.optional(NumberOrRatingSchema),
      // Bonus to avoid psychological addiction progressing
      psychologicaladdictionalreadyaddicted: zod.optional(NumberOrRatingSchema),

      // Bonuses to attribute-only tests
      // bonus to composure tests
      composure: zod.optional(zod.number()),
      // bonus to defense for judge intentions test
      judgeintentionsdefense: zod.optional(zod.number()),
      // bonus to memory tests
      memory: zod.optional(NumberOrRatingSchema),

      // resist drain
      drainresist: zod.optional(zod.number()),
      // resist fading
      fadingresist: zod.optional(zod.number()),
      // resist direct combat mana spells (you are attacked)
      directmanaspellresist: zod.optional(zod.number()),
      // resist detection spells (you are being detected)
      detectionspellresist: zod.optional(zod.number()),
      // resist illusion - mana illusion spells (try to detect illusion)
      manaillusionresist: zod.optional(zod.number()),
      // resist manipulation mental spells
      mentalmanipulationresist: zod.optional(zod.number()),
      // Resist spell: Decrease [Attribute]
      decreasebodresist: zod.optional(zod.number()),
      decreaseagiresist: zod.optional(zod.number()),
      decreaserearesist: zod.optional(zod.number()),
      decreasestrresist: zod.optional(zod.number()),
      decreasecharesist: zod.optional(zod.number()),
      decreaseintresist: zod.optional(zod.number()),
      decreaselogresist: zod.optional(zod.number()),
      decreasewilresist: zod.optional(zod.number()),
      // add limb slot
      addlimb: zod.optional(
        zod
          .object({
            limbslot: zod.nativeEnum(limbSlotXmlEnum),
            val: zod.number(),
            _precedence: zod.literal("0"),
          })
          .strict()
      ),
      // add spirits?
      addspirit: zod.optional(
        zod.union([zod.array(SpiritSchema), SpiritSchema])
      ),
      devicerating: zod.optional(zod.number()),
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
    })
    .strict(),
  zod.literal(""),
]);

export type BonusXmlType = zod.infer<typeof BonusXmlSchema>;
