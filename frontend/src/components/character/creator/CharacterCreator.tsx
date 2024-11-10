import { useEffect, useState } from "react";
import AttributeListSelect from "./AttributesSelect.js";
import PriorityListSelect from "./PrioritySelect.js";
import "./CharacterCreator.css";
import { Fragment } from "react";
import { QualityListSelect } from "./QualitiesSelect.js";
import { SkillListSelect } from "./SkillsSelect.js";
import { EquipmentSelect } from "./EquipmentSelect.js";
import { trpc } from "../../../utils/trpc.js";
import type {
  CustomSkillGroupListType,
  CustomSkillListType,
} from "@neon-codex/common/build/schemas/abilities/skillSchemas.js";
import type { EquipmentListType } from "@neon-codex/common/build/schemas/equipment/other/equipmentSchemas.js";
import type {
  AttributesType,
  SpecialAttributesType,
  PriorityLevelsType,
  HeritagePrioritySelectedType,
  QualitySelectedListType,
  TalentInfoType,
  FormulaListSelectedType,
  MartialArtSelectedType,
  LifestyleSelectedType,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { CreatorSummary } from "./CreatorSummary.js";
import { useNavigate } from "react-router-dom";
import {
  priorityLetterEnum,
  talentCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  SkillPriorityType,
  TalentPriorityType,
} from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import type { SkillPointInfoType } from "../commonSchemas.js";
import { TalentSelect } from "./TalentSelect.js";
import { MartialArtSelect } from "./MartialArtsSelect.js";
import { LifestyleSelect } from "./LIfestyleSelect.js";
import type { CharacterCreatorBonusListType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";

const characterCreatorPath = "/character_creator";
const CharacterCreator = function () {
  const navigate = useNavigate();
  const skills = trpc.character.skills.useQuery();
  const character = trpc.character.createCharacter.useMutation();
  const [bonusInfo, setBonusInfo] = useState<CharacterCreatorBonusListType>([]);
  // Character creator holds values of all sub components
  const [priorityInfo, setPriorityInfo] = useState<PriorityLevelsType>({
    heritage: priorityLetterEnum.A,
    attributes: priorityLetterEnum.B,
    talent: priorityLetterEnum.C,
    skills: priorityLetterEnum.D,
    resources: priorityLetterEnum.E,
  });
  const [attributeInfo, setAttributeInfo] = useState<AttributesType>({
    body: 1,
    agility: 1,
    reaction: 1,
    strength: 1,
    willpower: 1,
    logic: 1,
    intuition: 1,
    charisma: 1,
  });
  const [talentInfo, setTalentInfo] = useState<TalentInfoType>({
    type: talentCategoryEnum.Mundane,
  });
  const [priorityHeritage, setPriorityHeritage] =
    useState<HeritagePrioritySelectedType>({
      heritage: "",
      specialAttributePoints: 0,
    });
  const [priorityAttributes, setPriorityAttributes] = useState(0);
  const [priorityTalent, setPriorityTalent] = useState<TalentPriorityType>({
    name: "",
    label: "",
    category: talentCategoryEnum.Mundane,
  });
  const [prioritySkills, setPrioritySkills] = useState<SkillPriorityType>({
    name: "",
    skillPoints: 0,
    skillGroupPoints: 0,
  });
  const [priorityResources, setPriorityResources] = useState(0);
  const [specialAttributeInfo, setSpecialAttributeInfo] =
    useState<SpecialAttributesType>({
      edge: 0,
      talent: { type: talentCategoryEnum.Mundane },
    });
  const [karmaPoints, setKarmaPoints] = useState(25);
  const [essencePoints, setEssencePoints] = useState(6);
  const [positiveQualityListSelected, setPositiveQualitiesSelected] =
    useState<QualitySelectedListType>([]);
  const [negativeQualityListSelected, setNegativeQualitiesSelected] =
    useState<QualitySelectedListType>([]);
  const [skillPoints, setSkillPoints] = useState<SkillPointInfoType>({
    skillPoints: 0,
    skillGroupPoints: 0,
  });

  useEffect(() => {
    setSkillPoints(prioritySkills);
  }, [prioritySkills]);

  useEffect(() => {
    setNuyen(priorityResources);
  }, [priorityResources]);

  const [skillSelections, setSkillSelections] = useState<CustomSkillListType>(
    []
  );
  useEffect(() => {
    if (skills.data === undefined) return;
    setSkillSelections(
      skills.data.map((skill) => {
        return {
          ...skill,
          skillPoints: 0,
          karmaPoints: 0,
        };
      })
    );
  }, [skills.data]);
  // TODO: set skill group selections
  const [skillGroupSelections, _setSkillGroupSelections] =
    useState<CustomSkillGroupListType>([]);
  const [martialArtSelected, setMartialArtSelected] = useState<
    MartialArtSelectedType | undefined
  >(undefined);
  const [equipmentSelections, setEquipmentSelections] =
    useState<EquipmentListType>({
      weapons: [],
      gearList: [],
      armours: [],
      augmentations: [],
      vehicles: [],
    });
  const [lifestyleSelected, setLifestyleSelected] = useState<
    LifestyleSelectedType | undefined
  >(undefined);
  const [nuyen, setNuyen] = useState(0);

  const onBonusInfoChanged = function (
    loadingBonusInfo: CharacterCreatorBonusListType
  ) {
    setBonusInfo(loadingBonusInfo);
  };

  const onPriorityInfoChanged = function (
    loadingPriorities: PriorityLevelsType
  ) {
    setPriorityInfo(loadingPriorities);
  };
  const onHeritageInfoChanged = function (
    heritageInfo: HeritagePrioritySelectedType
  ) {
    setPriorityHeritage(heritageInfo);
  };
  const onPriorityAttributesChanged = function (loadingAttributes: number) {
    setPriorityAttributes(loadingAttributes);
  };
  const onPriorityTalentChanged = function (loadingTalent: TalentPriorityType) {
    setPriorityTalent(loadingTalent);
    if (talentInfo.type !== loadingTalent.category) {
      switch (loadingTalent.category) {
        case talentCategoryEnum.Magic: {
          const formulae: FormulaListSelectedType =
            loadingTalent.formulae !== undefined
              ? {
                  selectFormulae: true as const,
                  spells: [],
                  rituals: [],
                  alchemicalPreparations: [],
                }
              : {
                  selectFormulae: false as const,
                };
          const powers =
            loadingTalent.name === "Adept" ||
            loadingTalent.name === "Mystic Adept"
              ? {
                  selectAdeptPowers: true as const,
                  adeptPowers: [],
                }
              : {
                  selectAdeptPowers: false as const,
                };
          setTalentInfo({
            type: talentCategoryEnum.Magic,
            selectedTradition: {
              name: "",
              customSpirits: {
                customSpirits: false,
              },
            },
            selectedFormulae: formulae,
            selectedAdeptPowers: powers,
          });
          break;
        }
        case talentCategoryEnum.Resonance:
          setTalentInfo({
            type: talentCategoryEnum.Resonance,
            complexForms: [],
          });
          break;
        case talentCategoryEnum.Depth:
          setTalentInfo({
            type: talentCategoryEnum.Depth,
            programs: [],
          });
          break;
        case talentCategoryEnum.Mundane:
          setTalentInfo({
            type: talentCategoryEnum.Mundane,
          });
          break;
      }
    }
  };
  const onPrioritySkillsChanged = function (loadingSkills: SkillPriorityType) {
    setPrioritySkills(loadingSkills);
  };
  const onPriorityResources = function (loadingResources: number) {
    setPriorityResources(loadingResources);
  };
  const onAttributeInfoChanged = function (loadingAttributes: AttributesType) {
    setAttributeInfo(loadingAttributes);
  };
  const onSpecialAttributeInfoChanged = function (
    loadingSpecialAttributes: SpecialAttributesType
  ) {
    setSpecialAttributeInfo(loadingSpecialAttributes);
  };
  const onTalentInfoChanged = function (loadingTalentInfo: TalentInfoType) {
    setTalentInfo(loadingTalentInfo);
  };
  const onKarmaPointsChanged = function (loadingKarma: number) {
    setKarmaPoints(loadingKarma);
  };
  const onEssencePointsChanged = function (loadingEssence: number) {
    setEssencePoints(loadingEssence);
  };
  const onPositiveQualitiesSelectedChanged = function (
    loadingPositiveQualities: QualitySelectedListType
  ) {
    setPositiveQualitiesSelected(loadingPositiveQualities);
  };
  const onNegativeQualitiesSelectedChanged = function (
    loadingNegativeQualities: QualitySelectedListType
  ) {
    setNegativeQualitiesSelected(loadingNegativeQualities);
  };
  const onSkillPointChanged = function (
    loadingSkillPoints: SkillPointInfoType
  ) {
    setSkillPoints(loadingSkillPoints);
  };
  const onSkillSelectionsChanged = function (
    loadingSkillSelection: CustomSkillListType
  ) {
    setSkillSelections(loadingSkillSelection);
  };
  const onEquipmentSelectionsChanged = function (
    equipmentSelections: EquipmentListType
  ) {
    setEquipmentSelections(equipmentSelections);
  };
  const onNuyenChanged = function (nuyen: number) {
    setNuyen(nuyen);
  };
  const onMartialArtSelectionsChanged = function (
    martialArtSelected: MartialArtSelectedType | undefined
  ) {
    setMartialArtSelected(martialArtSelected);
  };
  const onLifestyleSelectedChanged = function (
    lifestyleSelected: LifestyleSelectedType
  ) {
    setLifestyleSelected(lifestyleSelected);
  };

  // TODO: make the page selection vary depending on talent choice
  // and add a header at the top
  enum CharacterPageEnum {
    PriorityListSelect = "PriorityListSelect",
    AttributeListSelect = "AttributeListSelect",
    QualityListSelect = "QualityListSelect",
    TalentListSelect = "TalentListSelect",
    SkillListSelect = "SkillListSelect",
    MartialArtSelect = "MartialArtSelect",
    EquipmentListSelect = "EquipmentListSelect",
    LifestyleSelect = "LifestyleSelect",
    CreatorSummary = "CreatorSummary",
  }

  const PageActiveList =
    priorityInfo.talent === priorityLetterEnum.E
      ? [
          CharacterPageEnum.PriorityListSelect,
          CharacterPageEnum.AttributeListSelect,
          CharacterPageEnum.QualityListSelect,
          CharacterPageEnum.SkillListSelect,
          CharacterPageEnum.MartialArtSelect,
          CharacterPageEnum.EquipmentListSelect,
          CharacterPageEnum.LifestyleSelect,
          CharacterPageEnum.CreatorSummary,
        ]
      : [
          CharacterPageEnum.PriorityListSelect,
          CharacterPageEnum.AttributeListSelect,
          CharacterPageEnum.QualityListSelect,
          CharacterPageEnum.TalentListSelect,
          CharacterPageEnum.SkillListSelect,
          CharacterPageEnum.MartialArtSelect,
          CharacterPageEnum.EquipmentListSelect,
          CharacterPageEnum.LifestyleSelect,
          CharacterPageEnum.CreatorSummary,
        ];

  const [page, setPage] = useState(CharacterPageEnum.PriorityListSelect);

  if (skills.isLoading) {
    return <div>Loading...</div>;
  }

  if (skills.isError) {
    // https://tanstack.com/query/v4/docs/typescript#typing-the-error-field
    if (skills.error instanceof Error) {
      return <div>Error! {skills.error.message}</div>;
    } else {
      return <div>Error!</div>;
    }
  }

  let currentStage;
  switch (page) {
    case CharacterPageEnum.PriorityListSelect:
      currentStage = (
        <PriorityListSelect
          priorityInfo={priorityInfo}
          setPriorityInfo={onPriorityInfoChanged}
          priorityHeritage={priorityHeritage}
          setPriorityHeritage={onHeritageInfoChanged}
          setPriorityAttributes={onPriorityAttributesChanged}
          setPriorityTalent={onPriorityTalentChanged}
          setPrioritySkills={onPrioritySkillsChanged}
          setPriorityResources={onPriorityResources}
          specialAttributeInfo={specialAttributeInfo}
          setSpecialAttributeInfo={onSpecialAttributeInfoChanged}
          priorityTalent={priorityTalent}
        />
      );
      break;
    case CharacterPageEnum.AttributeListSelect:
      currentStage = (
        <AttributeListSelect
          priorityInfo={priorityInfo}
          heritageInfo={priorityHeritage}
          attributeInfo={attributeInfo}
          setAttributeInfo={onAttributeInfoChanged}
          specialAttributeInfo={specialAttributeInfo}
          setSpecialAttributeInfo={onSpecialAttributeInfoChanged}
          maxAttributePoints={priorityAttributes}
          talentInfo={priorityTalent}
          bonusInfo={bonusInfo}
          setBonusInfo={onBonusInfoChanged}
        />
      );
      break;
    case CharacterPageEnum.QualityListSelect:
      currentStage = (
        <QualityListSelect
          karmaPoints={karmaPoints}
          setKarmaPoints={onKarmaPointsChanged}
          positiveQualitiesSelected={positiveQualityListSelected}
          setPositiveQualitiesSelected={onPositiveQualitiesSelectedChanged}
          negativeQualitiesSelected={negativeQualityListSelected}
          setNegativeQualitiesSelected={onNegativeQualitiesSelectedChanged}
          bonusInfo={bonusInfo}
          setBonusInfo={onBonusInfoChanged}
        />
      );
      break;
    case CharacterPageEnum.TalentListSelect:
      currentStage = (
        <TalentSelect
          talent={priorityTalent}
          talentInfo={talentInfo}
          setTalentInfo={onTalentInfoChanged}
          karmaPoints={karmaPoints}
          essencePoints={essencePoints}
          bonusInfo={bonusInfo}
          setBonusInfo={onBonusInfoChanged}
        />
      );
      break;
    case CharacterPageEnum.SkillListSelect:
      currentStage = (
        <SkillListSelect
          skillPointItems={skillPoints}
          setSkillPoints={onSkillPointChanged}
          skillSelections={skillSelections}
          setSkillSelections={onSkillSelectionsChanged}
          bonusInfo={bonusInfo}
          setBonusInfo={onBonusInfoChanged}
        />
      );
      break;
    case CharacterPageEnum.MartialArtSelect:
      currentStage = (
        <MartialArtSelect
          karmaPoints={karmaPoints}
          setKarmaPoints={onKarmaPointsChanged}
          martialArtSelected={martialArtSelected}
          setMartialArtSelected={onMartialArtSelectionsChanged}
        />
      );
      break;
    case CharacterPageEnum.EquipmentListSelect:
      currentStage = (
        <EquipmentSelect
          equipmentSelections={equipmentSelections}
          setEquipmentSelections={onEquipmentSelectionsChanged}
          nuyen={nuyen}
          setNuyen={onNuyenChanged}
          essencePoints={essencePoints}
          setEssencePoints={onEssencePointsChanged}
          bonusInfo={bonusInfo}
          setBonusInfo={onBonusInfoChanged}
        />
      );
      break;
    case CharacterPageEnum.LifestyleSelect:
      currentStage = (
        <LifestyleSelect
          lifestyleSelected={lifestyleSelected}
          setLifestyleSelected={onLifestyleSelectedChanged}
        />
      );
      break;
    case CharacterPageEnum.CreatorSummary:
      currentStage = (
        <CreatorSummary
          priorityInfo={priorityInfo}
          heritageInfo={priorityHeritage}
          attributeInfo={attributeInfo}
          specialAttributeInfo={specialAttributeInfo}
          talentInfo={talentInfo}
          positiveQualitiesSelected={positiveQualityListSelected}
          negativeQualitiesSelected={negativeQualityListSelected}
          skillPoints={skillPoints}
          skillSelections={skillSelections}
          skillGroupSelections={skillGroupSelections}
          martialArtSelected={martialArtSelected}
          equipmentSelections={equipmentSelections}
          lifestyleSelected={lifestyleSelected}
          karmaPoints={karmaPoints}
          nuyen={nuyen}
          bonusInfo={bonusInfo}
        />
      );
      break;

    default:
      currentStage = <>Error</>;
  }
  const lastPage = PageActiveList.length - 1;
  return (
    <Fragment>
      <nav>
        {PageActiveList.map((page) => {
          return <li key={page}>{page}</li>;
        })}
      </nav>
      <div>Karma Remaining: {karmaPoints}</div>
      <div>Essence Remaining: {essencePoints}</div>
      <button
        onClick={() => {
          setPage(
            page !== CharacterPageEnum.PriorityListSelect
              ? PageActiveList[
                  PageActiveList.findIndex((element) => element === page) - 1
                ]
              : CharacterPageEnum.PriorityListSelect
          );
        }}
        disabled={page == CharacterPageEnum.PriorityListSelect}
      >
        Previous
      </button>
      {}
      {currentStage}
      <button
        onClick={() => {
          setPage(
            page !== PageActiveList[lastPage]
              ? PageActiveList[
                  PageActiveList.findIndex((element) => element === page) + 1
                ]
              : PageActiveList[lastPage]
          );
        }}
        hidden={page === PageActiveList[lastPage]}
      >
        Next
      </button>
      <button
        onClick={() => {
          character
            .mutateAsync({
              priorityInfo: priorityInfo,
              heritageInfo: priorityHeritage,
              attributeInfo: attributeInfo,
              specialAttributeInfo: specialAttributeInfo,
              talentInfo: talentInfo,
              positiveQualityListSelected: positiveQualityListSelected,
              negativeQualityListSelected: negativeQualityListSelected,
              skillSelections: skillSelections,
              skillGroupSelections: skillGroupSelections,
              martialArtSelected: martialArtSelected,
              equipmentSelections: equipmentSelections,
              lifestyleSelected: lifestyleSelected,
              karmaPoints: karmaPoints,
              nuyen: nuyen,
              bonusInfo: bonusInfo,
            })
            .then((characterId) => {
              navigate(`/characters/${characterId}`);
            })
            .catch((err) => {
              // TODO: handle this
              console.log(err);
            });
        }}
        hidden={page !== PageActiveList[lastPage]}
      >
        Submit
      </button>
    </Fragment>
  );
};

export { characterCreatorPath };
export default CharacterCreator;
