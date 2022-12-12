import { useState } from "react";
import AttributesSelect from "./AttributesSelect.js";
import type { IAttributes } from "./AttributesSelect.js";
import PrioritySelect from "./PrioritySelect.js";
import {
  PriorityLevelEnum,
  MetatypeEnum,
  MagicTypeEnum,
  priorityOptions,
} from "./PriorityImports.js";
import type { IPriorities } from "./PriorityImports.js";
import "./CharacterCreator.css";
import React from "react";

const characterCreatorPath = "/character_creator";
const CharacterCreator = function () {
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
    edge: 0,
  });
  const [page, setPage] = useState(0);
  const firstPage = 0;
  const lastPage = 1;
  let currentStage;
  switch (page) {
    case 0:
      currentStage = (
        <PrioritySelect
          priorityInfo={priorityInfo}
          setPriorityInfo={setPriorityInfo}
        />
      );
      break;
    case 1:
      currentStage = (
        <AttributesSelect
          priorityInfo={priorityInfo}
          attributeInfo={attributeInfo}
          setAttributeInfo={setAttributeInfo}
          maxAttributePoints={
            priorityOptions[priorityInfo.AttributesPriority].attributes
          }
        />
      );
      break;
    default:
      currentStage = (
        <PrioritySelect
          priorityInfo={priorityInfo}
          setPriorityInfo={setPriorityInfo}
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
