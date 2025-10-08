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
import {
  CustomisedGearListSchema,
  type CustomisedGearListType,
} from "../equipment/other/gearSchemas.js";
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
import {
  LifestyleQualityListSchema,
  LifestyleSchema,
} from "../otherData/lifestyleSchemas.js";
import { type } from "arktype";

export enum PrioritiesEnum {
  Heritage,
  Attributes,
  Talents,
  Skills,
  Resources,
}

export const PriorityLevelsSchema = type({
  "+": "reject",
  heritage: type.valueOf(priorityLetterEnum),
  attributes: type.valueOf(priorityLetterEnum),
  talent: type.valueOf(priorityLetterEnum),
  skills: type.valueOf(priorityLetterEnum),
  resources: type.valueOf(priorityLetterEnum),
});
export type PriorityLevelsType = typeof PriorityLevelsSchema.infer;

export const AttributesSchema = type({
  "+": "reject",
  body: "number",
  agility: "number",
  reaction: "number",
  strength: "number",
  willpower: "number",
  logic: "number",
  intuition: "number",
  charisma: "number",
});
export type AttributesType = typeof AttributesSchema.infer;

export const SpecialAttributesSchema = type({
  "+": "reject",
  edge: "number",
  talent: type.or(
    type({
      "+": "reject",
      type: type.unit(talentCategoryEnum.Magic),
      magic: "number",
    }),
    type({
      "+": "reject",
      type: type.unit(talentCategoryEnum.Resonance),
      resonance: "number",
    }),
    type({
      "+": "reject",
      type: type.unit(talentCategoryEnum.Depth),
      depth: "number",
    }),
    type({
      "+": "reject",
      type: type.unit(talentCategoryEnum.Mundane),
    })
  ),
});
export type SpecialAttributesType = typeof SpecialAttributesSchema.infer;

const CustomSpiritsSchema = type.or(
  type({
    "+": "reject",
    customSpirits: "false",
  }),
  type({
    "+": "reject",
    customSpirits: "true",
    selectedSpiritTypes: type({
      "+": "reject",
      combat: "string",
      detection: "string",
      health: "string",
      illusion: "string",
      manipulation: "string",
    }),
  })
);
export type CustomSpiritsType = typeof CustomSpiritsSchema.infer;

const TraditionSelectedSchema = type({
  "+": "reject",
  name: "string",
  customSpirits: CustomSpiritsSchema,
});
export type TraditionSelectedType = typeof TraditionSelectedSchema.infer;

const FormulaListSelectedSchema = type.or(
  type({
    "+": "reject",
    selectFormulae: "false",
  }),
  type({
    "+": "reject",
    selectFormulae: "true",
    spells: "string[]",
    rituals: "string[]",
    alchemicalPreparations: "string[]",
  })
);
export type FormulaListSelectedType = typeof FormulaListSelectedSchema.infer;

const AdeptPowerListSelectedSchema = type.or(
  type({
    "+": "reject",
    selectAdeptPowers: "false",
  }),
  type({
    "+": "reject",
    selectAdeptPowers: "true",
    adeptPowers: "string[]",
  })
);
export type AdeptPowerListSelectedType =
  typeof AdeptPowerListSelectedSchema.infer;

const ProgramSelectedListSchema = type({
  "+": "reject",
  name: "string",
  "rating?": "number",
}).array();
export type ProgramSelectedListType = typeof ProgramSelectedListSchema.infer;

const MentorSpiritSelectedSchema = MentorBaseSchema.merge({
  category: type.unit(mentorCategoryEnum.MentorSpirit),
  choices: MentorChoiceSchema.array(),
  choiceCount: "number",
  "required?": RequirementsSchema,
});
export type MentorSpiritSelectedType = typeof MentorSpiritSelectedSchema.infer;

const ParagonSelectedSchema = MentorBaseSchema.merge({
  category: type.unit(mentorCategoryEnum.Paragon),
});

export const TalentInfoSchema = type.or(
  type({
    "+": "reject",
    type: type.unit(talentCategoryEnum.Magic),
    selectedTradition: TraditionSelectedSchema,
    selectedFormulae: FormulaListSelectedSchema,
    selectedAdeptPowers: AdeptPowerListSelectedSchema,
    "selectedMentor?": MentorSpiritSelectedSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(talentCategoryEnum.Resonance),
    complexForms: "string[]",
    "selectedMentor?": ParagonSelectedSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(talentCategoryEnum.Depth),
    programs: ProgramSelectedListSchema,
  }),
  type({
    "+": "reject",
    type: type.unit(talentCategoryEnum.Mundane),
  })
);
export type TalentInfoType = typeof TalentInfoSchema.infer;
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

export const QualitySelectedListSchema = type({
  "+": "reject",
  name: "string",
  "rating?": "number",
}).array();
export type QualitySelectedListType = typeof QualitySelectedListSchema.infer;

export const HeritagePrioritySelectedSchema = type({
  "+": "reject",
  heritage: "string",
  "metavariant?": "string",
  specialAttributePoints: "number",
});

export type HeritagePrioritySelectedType =
  typeof HeritagePrioritySelectedSchema.infer;

export const AttributeRangesSchema = type({
  "+": "reject",
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
});
export type AttributeRangesType = typeof AttributeRangesSchema.infer;

const CostRangeSchema = type("number[]");
export type CostRange = typeof CostRangeSchema.infer;

export const MartialArtSelectedSchema = type({
  "+": "reject",
  martialArt: MartialArtSchema,
  techniqueList: MartialArtTechniqueListSchema,
});
export type MartialArtSelectedType = typeof MartialArtSelectedSchema.infer;
export const MartialArtSelectedListSchema = MartialArtSelectedSchema.array();
export type MartialArtSelectedListType =
  typeof MartialArtSelectedListSchema.infer;

export const LifestyleSelectedSchema = type({
  "+": "reject",
  lifestyle: LifestyleSchema,
  lifestyleQualityList: LifestyleQualityListSchema,
  purchasedDuration: "number",
});
export type LifestyleSelectedType = typeof LifestyleSelectedSchema.infer;
export const LifestyleSelectedListSchema = LifestyleSelectedSchema.array();
export type LifestyleSelectedListType =
  typeof LifestyleSelectedListSchema.infer;

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
  lifestyleList: LifestyleSelectedListType;
};
export const CharacterSchema = type({
  "+": "reject",
  name: "string",
  heritage: HeritageSchema,
  priorities: PriorityLevelsSchema,
  attributes: AttributesSchema,
  specialAttributes: SpecialAttributesSchema,
  talentInfo: TalentInfoSchema,
  skillList: CustomSkillListSchema,
  qualityList: CustomQualityListSchema,
  nuyen: "number",
  karmaPoints: "number",
  weaponList: CustomisedWeaponListSchema,
  armourList: CustomisedArmourListSchema,
  gearList: CustomisedGearListSchema,
  augmentationList: CustomisedAugmentationListSchema,
  vehicleList: CustomisedVehicleListSchema,
  martialArtList: MartialArtSelectedSchema.array(),
  lifestyleList: LifestyleSelectedListSchema,
});

export const HeritageSummarySchema = type.or(
  type({
    "+": "reject",
    name: "string",
    category: type.unit(heritageCategoryEnum.Metavariant),
    baseHeritage: "string",
  }),
  type({
    "+": "reject",
    name: "string",
    category: type.unit(heritageCategoryEnum.Metahuman),
  }),
  type({
    "+": "reject",
    name: "string",
    category: type.unit(heritageCategoryEnum.Metasapient),
  }),
  type({
    "+": "reject",
    name: "string",
    category: type.unit(heritageCategoryEnum.Shapeshifter),
  })
);

export const CharacterSummarySchema = type({
  "+": "reject",
  id: "number",
  name: "string",
  heritage: HeritageSummarySchema,
});
export type CharacterSummaryType = typeof CharacterSummarySchema.infer;
export const CharacterSummaryListSchema = CharacterSummarySchema.array();
export type CharacterSummaryListType = typeof CharacterSummaryListSchema.infer;
