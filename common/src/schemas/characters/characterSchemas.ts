import { z as zod } from "zod";
import {
  heritageCategoryEnum,
  mentorCategoryEnum,
  priorityLetterEnum,
  talentCategoryEnum,
} from "../../enums.js";
import { HeritageSchema } from "../abilities/heritageSchemas.js";
import type { HeritageType } from "../abilities/heritageSchemas.js";
import { CustomisedWeaponListSchema } from "../equipment/combat/weaponSchemas.js";
import type { CustomisedWeaponListType } from "../equipment/combat/weaponSchemas.js";
import { CustomisedArmourListSchema } from "../equipment/combat/armourSchemas.js";
import type { CustomisedArmourListType } from "../equipment/combat/armourSchemas.js";
import { CustomisedGearListSchema } from "../equipment/other/gearSchemas.js";
import type { CustomisedGearListType } from "../equipment/other/gearSchemas.js";
import { CustomisedAugmentationListSchema } from "../equipment/bodyModification/augmentationSchemas.js";
import type { CustomisedAugmentationListType } from "../equipment/bodyModification/augmentationSchemas.js";
import { CustomisedVehicleListSchema } from "../equipment/rigger/vehicleSchemas.js";
import type { CustomisedVehicleListType } from "../equipment/rigger/vehicleSchemas.js";
import { CustomSkillListSchema } from "../abilities/skillSchemas.js";
import type { CustomSkillListType } from "../abilities/skillSchemas.js";
import { CustomQualityListSchema } from "../abilities/qualitySchemas.js";
import type { CustomQualityListType } from "../abilities/qualitySchemas.js";
import { AttributeRangeSchema } from "../shared/commonSchemas.js";
import {
  MentorBaseSchema,
  MentorChoiceSchema,
} from "../abilities/talent/mentorSchemas.js";
import { RequirementsSchema } from "../shared/requiredSchemas.js";
import {
  MartialArtSchema,
  MartialArtTechniqueListSchema,
} from "../abilities/martialArtSchemas.js";

export enum PrioritiesEnum {
  Heritage,
  Attributes,
  Talents,
  Skills,
  Resources,
}

export const PriorityLevelsSchema = zod
  .object({
    heritage: zod.nativeEnum(priorityLetterEnum),
    attributes: zod.nativeEnum(priorityLetterEnum),
    talent: zod.nativeEnum(priorityLetterEnum),
    skills: zod.nativeEnum(priorityLetterEnum),
    resources: zod.nativeEnum(priorityLetterEnum),
  })
  .strict();
export type PriorityLevelsType = zod.infer<typeof PriorityLevelsSchema>;

export const AttributesSchema = zod
  .object({
    body: zod.number(),
    agility: zod.number(),
    reaction: zod.number(),
    strength: zod.number(),
    willpower: zod.number(),
    logic: zod.number(),
    intuition: zod.number(),
    charisma: zod.number(),
  })
  .strict();
export type AttributesType = zod.infer<typeof AttributesSchema>;

export const SpecialAttributesSchema = zod
  .object({
    edge: zod.number(),
    talent: zod.discriminatedUnion("type", [
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Magic),
          magic: zod.number(),
        })
        .strict(),
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Resonance),
          resonance: zod.number(),
        })
        .strict(),
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Depth),
          depth: zod.number(),
        })
        .strict(),
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Mundane),
        })
        .strict(),
    ]),
  })
  .strict();
export type SpecialAttributesType = zod.infer<typeof SpecialAttributesSchema>;

const CustomSpiritsSchema = zod.discriminatedUnion("customSpirits", [
  zod.object({ customSpirits: zod.literal(false) }).strict(),
  zod
    .object({
      customSpirits: zod.literal(true),
      selectedSpiritTypes: zod
        .object({
          combat: zod.string(),
          detection: zod.string(),
          health: zod.string(),
          illusion: zod.string(),
          manipulation: zod.string(),
        })
        .strict(),
    })
    .strict(),
]);
export type CustomSpiritsType = zod.infer<typeof CustomSpiritsSchema>;

const TraditionSelectedSchema = zod
  .object({
    name: zod.string(),
    customSpirits: CustomSpiritsSchema,
  })
  .strict();
export type TraditionSelectedType = zod.infer<typeof TraditionSelectedSchema>;

const FormulaListSelectedSchema = zod.discriminatedUnion("selectFormulae", [
  zod
    .object({
      selectFormulae: zod.literal(false),
    })
    .strict(),
  zod
    .object({
      selectFormulae: zod.literal(true),
      spells: zod.array(zod.string()),
      rituals: zod.array(zod.string()),
      alchemicalPreparations: zod.array(zod.string()),
    })
    .strict(),
]);
export type FormulaListSelectedType = zod.infer<
  typeof FormulaListSelectedSchema
>;

const AdeptPowerListSelectedSchema = zod.discriminatedUnion(
  "selectAdeptPowers",
  [
    zod
      .object({
        selectAdeptPowers: zod.literal(false),
      })
      .strict(),
    zod
      .object({
        selectAdeptPowers: zod.literal(true),
        adeptPowers: zod.array(zod.string()),
      })
      .strict(),
  ]
);
export type AdeptPowerListSelectedType = zod.infer<
  typeof AdeptPowerListSelectedSchema
>;
const ProgramSelectedListSchema = zod.array(
  zod
    .object({
      name: zod.string(),
      rating: zod.optional(zod.number()),
    })
    .strict()
);
export type ProgramSelectedListType = zod.infer<
  typeof ProgramSelectedListSchema
>;

const MentorSpiritSelectedSchema = MentorBaseSchema.extend({
  category: zod.literal(mentorCategoryEnum.MentorSpirit),
  choices: zod.array(MentorChoiceSchema),
  choiceCount: zod.number(),
  required: zod.optional(RequirementsSchema),
}).strict();
export type MentorSpiritSelectedType = zod.infer<
  typeof MentorSpiritSelectedSchema
>;
const ParagonSelectedSchema = MentorBaseSchema.extend({
  category: zod.literal(mentorCategoryEnum.Paragon),
}).strict();

export const TalentInfoSchema = zod.discriminatedUnion("type", [
  zod
    .object({
      type: zod.literal(talentCategoryEnum.Magic),
      selectedTradition: TraditionSelectedSchema,
      selectedFormulae: FormulaListSelectedSchema,
      selectedAdeptPowers: AdeptPowerListSelectedSchema,
      selectedMentor: zod.optional(MentorSpiritSelectedSchema),
    })
    .strict(),
  zod
    .object({
      type: zod.literal(talentCategoryEnum.Resonance),
      complexForms: zod.array(zod.string()),
      selectedMentor: zod.optional(ParagonSelectedSchema),
    })
    .strict(),
  zod
    .object({
      type: zod.literal(talentCategoryEnum.Depth),
      programs: ProgramSelectedListSchema,
    })
    .strict(),
  zod
    .object({
      type: zod.literal(talentCategoryEnum.Mundane),
    })
    .strict(),
]);
export type TalentInfoType = zod.infer<typeof TalentInfoSchema>;
export type MagicTalentInfoType = TalentInfoType & {
  type: talentCategoryEnum.Magic;
};
export type ResonanceTalentInfoType = TalentInfoType & {
  type: talentCategoryEnum.Resonance;
};
export type DepthTalentInfoType = TalentInfoType & {
  type: talentCategoryEnum.Depth;
};
export type MundaneTalentInfoType = TalentInfoType & {
  type: talentCategoryEnum.Mundane;
};

export const QualitySelectedListSchema = zod.array(
  zod
    .object({
      name: zod.string(),
      rating: zod.optional(zod.number()),
    })
    .strict()
);
export type QualitySelectedListType = zod.infer<
  typeof QualitySelectedListSchema
>;

export const HeritagePrioritySelectedSchema = zod
  .object({
    heritage: zod.string(),
    metavariant: zod.optional(zod.string()),
    specialAttributePoints: zod.number(),
  })
  .strict();

export type HeritagePrioritySelectedType = zod.infer<
  typeof HeritagePrioritySelectedSchema
>;

export const AttributeRangesSchema = zod
  .object({
    body: AttributeRangeSchema,
    agility: AttributeRangeSchema,
    reaction: AttributeRangeSchema,
    strength: AttributeRangeSchema,
    willpower: AttributeRangeSchema,
    logic: AttributeRangeSchema,
    intuition: AttributeRangeSchema,
    charisma: AttributeRangeSchema,
    // Special Attributes
    edge: AttributeRangeSchema,
    magic: AttributeRangeSchema,
    resonance: AttributeRangeSchema,
    depth: AttributeRangeSchema,
  })
  .strict();
export type AttributeRangesType = zod.infer<typeof AttributeRangesSchema>;

const CostRangeSchema = zod.array(zod.number());
export type CostRange = zod.infer<typeof CostRangeSchema>;

export const MartialArtSelectedSchema = zod
  .object({
    martialArt: MartialArtSchema,
    techniqueList: MartialArtTechniqueListSchema,
  })
  .strict();
export type MartialArtSelectedType = zod.infer<typeof MartialArtSelectedSchema>;
export const MartialArtSelectedListSchema = zod.array(MartialArtSelectedSchema);
export type MartialArtSelectedListType = zod.infer<
  typeof MartialArtSelectedListSchema
>;

export type CharacterType = {
  name: string;
  heritage: HeritageType;
  priorities: PriorityLevelsType;
  attributes: AttributesType;
  specialAttributes: SpecialAttributesType;
  talentInfo: TalentInfoType;
  skillList: CustomSkillListType;
  qualityList: CustomQualityListType;
  nuyen: number;
  karmaPoints: number;
  weaponList: CustomisedWeaponListType;
  armourList: CustomisedArmourListType;
  gearList: CustomisedGearListType;
  augmentationList: CustomisedAugmentationListType;
  vehicleList: CustomisedVehicleListType;
  martialArtList: MartialArtSelectedListType;
};
export const CharacterSchema: zod.ZodType<CharacterType> = zod
  .object({
    name: zod.string(),
    heritage: HeritageSchema,
    priorities: PriorityLevelsSchema,
    attributes: AttributesSchema,
    specialAttributes: SpecialAttributesSchema,
    talentInfo: TalentInfoSchema,
    skillList: CustomSkillListSchema,
    qualityList: CustomQualityListSchema,
    nuyen: zod.number(),
    karmaPoints: zod.number(),
    weaponList: CustomisedWeaponListSchema,
    armourList: CustomisedArmourListSchema,
    gearList: CustomisedGearListSchema,
    augmentationList: CustomisedAugmentationListSchema,
    vehicleList: CustomisedVehicleListSchema,
    martialArtList: zod.array(MartialArtSelectedSchema),
  })
  .strict();

export const HeritageSummarySchema = zod.discriminatedUnion("category", [
  zod
    .object({
      name: zod.string(),
      category: zod.literal(heritageCategoryEnum.Metavariant),
      baseHeritage: zod.string(),
    })
    .strict(),
  zod
    .object({
      name: zod.string(),
      category: zod.literal(heritageCategoryEnum.Metahuman),
    })
    .strict(),
  zod
    .object({
      name: zod.string(),
      category: zod.literal(heritageCategoryEnum.Metasapient),
    })
    .strict(),
  zod
    .object({
      name: zod.string(),
      category: zod.literal(heritageCategoryEnum.Shapeshifter),
    })
    .strict(),
]);

export const CharacterSummarySchema = zod
  .object({
    id: zod.number(),
    name: zod.string(),
    heritage: HeritageSummarySchema,
  })
  .strict();
export type CharacterSummaryType = zod.infer<typeof CharacterSummarySchema>;
export const CharacterSummaryListSchema = zod.array(CharacterSummarySchema);
export type CharacterSummaryListType = zod.infer<
  typeof CharacterSummaryListSchema
>;
