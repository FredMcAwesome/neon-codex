import { useEffect, useState } from "react";
import AttributesSelect from "./AttributesSelect.js";
import PrioritySelect from "./PrioritySelect.js";
import { priorityOptions } from "./PriorityImports.js";
import type { ISkillPoints } from "./PriorityImports.js";
import "./CharacterCreator.css";
import { Fragment } from "react";
import { QualitiesSelect } from "./QualitiesSelect.js";
import { SkillSelectList } from "./SkillsSelect.js";
import { EquipmentSelect } from "./EquipmentSelect.js";
import { trpc } from "../../../utils/trpc.js";
import type { CustomSkillListType } from "@neon-codex/common/build/schemas/abilities/skillSchemas.js";
import type { EquipmentListType } from "@neon-codex/common/build/schemas/equipment/other/equipmentSchemas.js";
import {
  PriorityLevelEnum,
  MetatypeEnum,
  MagicTypeEnum,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import type {
  AttributesType,
  SpecialAttributesType,
  PrioritiesType,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { CreatorSummary } from "./CreatorSummary.js";
import { useNavigate } from "react-router-dom";
import type { QualityListType } from "@neon-codex/common/build/schemas/abilities/qualitySchemas.js";

const characterCreatorPath = "/character_creator";
const CharacterCreator = function () {
  const navigate = useNavigate();
  const skills = trpc.character.skills.useQuery();
  const character = trpc.character.createCharacter.useMutation();
  // Character creator holds values of all sub components
  const [priorityInfo, setPriorityInfo] = useState<PrioritiesType>({
    MetatypePriority: PriorityLevelEnum.A,
    MetatypeSubselection: MetatypeEnum.Human,
    AttributesPriority: PriorityLevelEnum.B,
    MagicPriority: PriorityLevelEnum.C,
    MagicSubselection: MagicTypeEnum.Magician,
    SkillsPriority: PriorityLevelEnum.D,
    ResourcesPriority: PriorityLevelEnum.E,
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
  const [specialAttributeInfo, setSpecialAttributeInfo] =
    useState<SpecialAttributesType>({
      edge: 0,
      magic: 0,
    });
  const [karmaPoints, setKarmaPoints] = useState(25);
  const [positiveQualitiesSelected, setPositiveQualitiesSelected] =
    useState<QualityListType>([]);
  const [negativeQualitiesSelected, setNegativeQualitiesSelected] =
    useState<QualityListType>([]);
  const [skillPoints, setSkillPoints] = useState<ISkillPoints>(
    priorityOptions[priorityInfo.SkillsPriority].skills
  );

  // const skills = data !== undefined ? data : [];
  const [skillSelections, setSkillSelections] = useState<CustomSkillListType>(
    []
  );
  useEffect(() => {
    if (skills.data === undefined) return;
    setSkillSelections(
      skills.data.map((skill) => {
        return {
          ...skill,
          skillGroupPoints: 0,
          skillPoints: 0,
          karmaPoints: 0,
        };
      })
    );
  }, [skills.data]);
  const [equipmentSelected, setEquipmentSelected] = useState<EquipmentListType>(
    {
      weapons: [],
      gears: [],
      armours: [],
      augmentations: [],
      vehicles: [],
    }
  );
  const [nuyen, setNuyen] = useState(
    priorityOptions[priorityInfo.ResourcesPriority].resources
  );

  const onPriorityInfoChanged = function (loadingPriorities: PrioritiesType) {
    setPriorityInfo(loadingPriorities);
    setSkillPoints(priorityOptions[loadingPriorities.SkillsPriority].skills);
    setNuyen(priorityOptions[loadingPriorities.ResourcesPriority].resources);
  };
  const onAttributeInfoChanged = function (loadingAttributes: AttributesType) {
    setAttributeInfo(loadingAttributes);
  };
  const onSpecialAttributeInfoChanged = function (
    loadingSpecialAttributes: SpecialAttributesType
  ) {
    setSpecialAttributeInfo(loadingSpecialAttributes);
  };
  const onKarmaPointsChanged = function (loadingKarma: number) {
    setKarmaPoints(loadingKarma);
  };
  const onPositiveQualitiesSelectedChanged = function (
    loadingPositiveQualities: QualityListType
  ) {
    setPositiveQualitiesSelected(loadingPositiveQualities);
  };
  const onNegativeQualitiesSelectedChanged = function (
    loadingNegativeQualities: QualityListType
  ) {
    setNegativeQualitiesSelected(loadingNegativeQualities);
  };
  const onSkillPointChanged = function (loadingSkillPoints: ISkillPoints) {
    setSkillPoints(loadingSkillPoints);
  };
  const onSkillSelectionsChanged = function (
    loadingSkillSelection: CustomSkillListType
  ) {
    setSkillSelections(loadingSkillSelection);
  };
  const onEquipmentSelectedChanged = function (
    equipmentSelected: EquipmentListType
  ) {
    setEquipmentSelected(equipmentSelected);
  };
  const onNuyenChanged = function (nuyen: number) {
    setNuyen(nuyen);
  };

  const [page, setPage] = useState(0);

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

  const firstPage = 0;
  const lastPage = 5;
  let currentStage;
  switch (page) {
    case firstPage:
      currentStage = (
        <PrioritySelect
          priorityInfo={priorityInfo}
          setPriorityInfo={onPriorityInfoChanged}
        />
      );
      break;
    case 1:
      currentStage = (
        <AttributesSelect
          priorityInfo={priorityInfo}
          attributeInfo={attributeInfo}
          setAttributeInfo={onAttributeInfoChanged}
          specialAttributeInfo={specialAttributeInfo}
          setSpecialAttributeInfo={onSpecialAttributeInfoChanged}
          maxAttributePoints={
            priorityOptions[priorityInfo.AttributesPriority].attributes
          }
          maxSpecialAttributePoints={
            priorityOptions[priorityInfo.MetatypePriority].metatypeInfo[
              priorityInfo.MetatypeSubselection
            ].specialAttributes
          }
          magicInfo={
            priorityOptions[priorityInfo.MagicPriority].magicInfo[
              priorityInfo.MagicSubselection
            ]
          }
        />
      );
      break;
    case 2:
      currentStage = (
        <QualitiesSelect
          karmaPoints={karmaPoints}
          setKarmaPoints={onKarmaPointsChanged}
          positiveQualitiesSelected={positiveQualitiesSelected}
          setPositiveQualitiesSelected={onPositiveQualitiesSelectedChanged}
          negativeQualitiesSelected={negativeQualitiesSelected}
          setNegativeQualitiesSelected={onNegativeQualitiesSelectedChanged}
        />
      );
      break;
    case 3:
      currentStage = (
        <SkillSelectList
          skillPointItems={skillPoints}
          setSkillPoints={onSkillPointChanged}
          skillSelections={skillSelections}
          setSkillSelections={onSkillSelectionsChanged}
        />
      );
      break;
    case 4:
      currentStage = (
        <EquipmentSelect
          equipmentSelected={equipmentSelected}
          setEquipmentSelected={onEquipmentSelectedChanged}
          nuyen={nuyen}
          setNuyen={onNuyenChanged}
        />
      );
      break;
    case lastPage:
      currentStage = (
        <CreatorSummary
          priorityInfo={priorityInfo}
          attributeInfo={attributeInfo}
          specialAttributeInfo={specialAttributeInfo}
          karmaPoints={karmaPoints}
          positiveQualitiesSelected={positiveQualitiesSelected}
          negativeQualitiesSelected={negativeQualitiesSelected}
          skillPoints={skillPoints}
          skillSelections={skillSelections}
          equipmentSelected={equipmentSelected}
          nuyen={nuyen}
        />
      );
      break;

    default:
      currentStage = (
        <PrioritySelect
          priorityInfo={priorityInfo}
          setPriorityInfo={onPriorityInfoChanged}
        />
      );
  }
  return (
    <Fragment>
      <button
        onClick={() => {
          setPage(page > firstPage ? page - 1 : firstPage);
        }}
        disabled={page == firstPage}
      >
        Previous
      </button>
      {currentStage}
      <button
        onClick={() => {
          setPage(page < lastPage ? page + 1 : lastPage);
        }}
        hidden={page === lastPage}
      >
        Next
      </button>
      <button
        onClick={async () => {
          const characterId = await character.mutateAsync({
            priorityInfo: priorityInfo,
            attributeInfo: attributeInfo,
            specialAttributeInfo: specialAttributeInfo,
            positiveQualitiesSelected: positiveQualitiesSelected,
            negativeQualitiesSelected: negativeQualitiesSelected,
            skillSelections: skillSelections,
            equipmentSelected: equipmentSelected,
            karmaPoints: karmaPoints,
            nuyen: nuyen,
          });
          navigate(`/characters/${characterId}`);
        }}
        hidden={page !== lastPage}
      >
        Submit
      </button>
    </Fragment>
  );
};

export { characterCreatorPath };
export default CharacterCreator;
