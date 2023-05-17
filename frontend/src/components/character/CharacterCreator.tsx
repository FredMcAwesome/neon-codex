import { useEffect, useState } from "react";
import AttributesSelect from "./AttributesSelect.js";
import type { IAttributes, ISpecialAttributes } from "./AttributesSelect.js";
import PrioritySelect from "./PrioritySelect.js";
import {
  PriorityLevelEnum,
  MetatypeEnum,
  MagicTypeEnum,
  priorityOptions,
} from "./PriorityImports.js";
import type { IPriorities, ISkillPoints } from "./PriorityImports.js";
import "./CharacterCreator.css";
import React from "react";
import { QualitiesSelect } from "./QualitiesSelect.js";
import type { ISelectedQuality } from "./QualitiesSelect.js";
import { SkillSelectList } from "./SkillsSelect.js";
import { GearSelect } from "./GearSelect.js";
import { GearListType } from "@shadowrun/common";
import { CustomSkillListType } from "@shadowrun/common/src/schemas/skillSchema.js";
import { trpc } from "../../utils/trpc.js";

const characterCreatorPath = "/character_creator";
const CharacterCreator = function () {
  const { data, error, isError, isLoading } = trpc.character.skills.useQuery();

  // Character creator holds values of all sub components
  const [priorityInfo, setPriorityInfo] = useState<IPriorities>({
    MetatypePriority: PriorityLevelEnum.A,
    MetatypeSubselection: MetatypeEnum.Human,
    AttributesPriority: PriorityLevelEnum.B,
    MagicPriority: PriorityLevelEnum.C,
    MagicSubselection: MagicTypeEnum.Magician,
    SkillsPriority: PriorityLevelEnum.D,
    ResourcesPriority: PriorityLevelEnum.E,
  });
  const [attributeInfo, setAttributeInfo] = useState<IAttributes>({
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
    useState<ISpecialAttributes>({
      edge: 0,
      magic: 0,
    });
  const [karmaPoints, setKarmaPoints] = useState(25);
  const [positiveQualitiesSelected, setPositiveQualitiesSelected] = useState<
    Array<ISelectedQuality>
  >([]);
  const [negativeQualitiesSelected, setNegativeQualitiesSelected] = useState<
    Array<ISelectedQuality>
  >([]);
  const [skillPoints, setSkillPoints] = useState<ISkillPoints>(
    priorityOptions[priorityInfo.SkillsPriority].skills
  );

  // const skills = data !== undefined ? data : [];
  const [skillSelections, setSkillSelections] = useState<CustomSkillListType>(
    []
  );
  useEffect(() => {
    if (data === undefined) return;
    setSkillSelections(
      data.map((skill) => {
        // console.log(skill.name);
        return {
          ...skill,
          skillGroupPoints: 0,
          skillPoints: 0,
          karmaPoints: 0,
        };
      })
    );
  }, [data]);
  const [gearSelected, setGearSelected] = useState<GearListType>({
    weapons: [],
    electronics: [],
    electronicAccessories: [],
    otherGear: [],
    augmentations: [],
    magicalEquipment: [],
    vehiclesAndDrones: [],
  });
  const [nuyen, setNuyen] = useState(
    priorityOptions[priorityInfo.ResourcesPriority].resources
  );

  const onPriorityInfoChanged = function (loadingPriorities: IPriorities) {
    setPriorityInfo(loadingPriorities);
    setSkillPoints(priorityOptions[loadingPriorities.SkillsPriority].skills);
    setNuyen(priorityOptions[loadingPriorities.ResourcesPriority].resources);
  };
  const onAttributeInfoChanged = function (loadingAttributes: IAttributes) {
    setAttributeInfo(loadingAttributes);
  };
  const onSpecialAttributeInfoChanged = function (
    loadingSpecialAttributes: ISpecialAttributes
  ) {
    setSpecialAttributeInfo(loadingSpecialAttributes);
  };
  const onKarmaPointsChanged = function (loadingKarma: number) {
    setKarmaPoints(loadingKarma);
  };
  const onPositiveQualitiesSelectedChanged = function (
    loadingPositiveQualities: Array<ISelectedQuality>
  ) {
    setPositiveQualitiesSelected(loadingPositiveQualities);
  };
  const onNegativeQualitiesSelectedChanged = function (
    loadingNegativeQualities: Array<ISelectedQuality>
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
  const onGearSelectedChanged = function (gearSelected: GearListType) {
    setGearSelected(gearSelected);
  };
  const onNuyenChanged = function (nuyen: number) {
    setNuyen(nuyen);
  };

  const [page, setPage] = useState(0);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    // https://tanstack.com/query/v4/docs/typescript#typing-the-error-field
    if (error instanceof Error) {
      return <div>Error! {error.message}</div>;
    } else {
      return <div>Error!</div>;
    }
  }
  const firstPage = 0;
  const lastPage = 4;
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
    case lastPage:
      currentStage = (
        <GearSelect
          gearSelected={gearSelected}
          setGearSelected={onGearSelectedChanged}
          nuyen={nuyen}
          setNuyen={onNuyenChanged}
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
    <React.Fragment>
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
        disabled={page == lastPage}
      >
        Next
      </button>
    </React.Fragment>
  );
};
export { characterCreatorPath };
export default CharacterCreator;
