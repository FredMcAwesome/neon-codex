import { useState } from "react";
import Attributes from "./Attributes.js";
import PrioritySelect from "./PrioritySelect.js";
import {
  PriorityLevelEnum,
  MetatypeEnum,
  MagicTypeEnum,
  IPriorities,
} from "./PrioritySelect.js";
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
      currentStage = <Attributes priorityInfo={priorityInfo} />;
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
