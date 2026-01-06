import { Fragment, useEffect, useRef, useState } from "react";
import { ArwesSelect } from "../../common/ArwesSelect.js";
import { CollapsibleDiv } from "../../../utils/CollapsibleDiv.js";
import { skillCategoryEnum } from "@neon-codex/common";
import type { CustomSkillListType, CustomSkillType } from "@neon-codex/common";
import type { SkillPointInfoType } from "../commonSchemas.js";
import type { CharacterCreatorBonusListType } from "@neon-codex/common";

// first rating empty for no points in skill
const skillRating = [
  "",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

interface IProps {
  skillPointItems: SkillPointInfoType;
  setSkillPoints: (loadingSkillPoints: SkillPointInfoType) => void;
  skillSelections: CustomSkillListType;
  setSkillSelections: (loadingSkillPoints: CustomSkillListType) => void;
  bonusInfo: CharacterCreatorBonusListType;
  setBonusInfo: (loadingBonusInfo: CharacterCreatorBonusListType) => void;
}

export const SkillListSelect = function (props: IProps) {
  // Local state
  const [localSkillSelections, setLocalSkillSelections] = useState(
    props.skillSelections
  );
  const [localSkillPointItems, setLocalSkillPointItems] = useState(
    props.skillPointItems
  );

  // Refs for cleanup
  const skillSelectionsRef = useRef(localSkillSelections);
  const skillPointItemsRef = useRef(localSkillPointItems);

  useEffect(() => {
    skillSelectionsRef.current = localSkillSelections;
  }, [localSkillSelections]);
  useEffect(() => {
    skillPointItemsRef.current = localSkillPointItems;
  }, [localSkillPointItems]);

  // Sync to parent on unmount
  useEffect(() => {
    return () => {
      props.setSkillSelections(skillSelectionsRef.current);
      props.setSkillPoints(skillPointItemsRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSkill = function (
    skill: CustomSkillType,
    skillPoints: number,
    // TODO: implement skill group points
    _skillGroupPoints: number
  ) {
    const newSkillSelections = [...localSkillSelections];
    const foundSkillIndex = newSkillSelections.findIndex(
      (listSkill) => listSkill.name == skill.name
    );
    const foundSkill = newSkillSelections[foundSkillIndex];
    const pointDelta = skillPoints - foundSkill.skillPoints;

    newSkillSelections[foundSkillIndex] = {
      ...foundSkill,
      skillPoints: skillPoints,
    };
    // newSkillSelections[foundSkillIndex].skillGroupPoints = skillGroupPoints;

    setLocalSkillPointItems((prev) => ({
      ...prev,
      skillPoints: prev.skillPoints - pointDelta,
      // skillGroupPoints: prev.skillGroupPoints - groupPointDelta
    }));
    setLocalSkillSelections(newSkillSelections);
  };

  return (
    <Fragment>
      <h1>Skills Selection</h1>
      <div>
        Skill Points Remaining:
        <p id="skillPoints">Skill Points: {localSkillPointItems.skillPoints}</p>
        <p id="skillGroupPoints">
          Skill Group Points: {localSkillPointItems.skillGroupPoints}
        </p>
      </div>
      <CollapsibleDiv title="Combat Skills">
        <SkillList
          skillSelections={localSkillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Combat}
          skillPointItems={localSkillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Physical Skills">
        <SkillList
          skillSelections={localSkillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Physical}
          skillPointItems={localSkillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Social Skills">
        <SkillList
          skillSelections={localSkillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Social}
          skillPointItems={localSkillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Magical Skills">
        <SkillList
          skillSelections={localSkillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Magical}
          skillPointItems={localSkillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Resonance Skills">
        <SkillList
          skillSelections={localSkillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Resonance}
          skillPointItems={localSkillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Technical Skills">
        <SkillList
          skillSelections={localSkillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Technical}
          skillPointItems={localSkillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Vehicle/Drone Skills">
        <SkillList
          skillSelections={localSkillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Vehicle}
          skillPointItems={localSkillPointItems}
        />
      </CollapsibleDiv>
    </Fragment>
  );
};

interface ISkillSelectProp {
  skill: CustomSkillType;
  onChange: (
    skill: CustomSkillType,
    skillPoints: number,
    skillGroupPoints: number
  ) => void;
  skillOptions: {
    skillPointOptions: Array<string>;
    skillGroupPointOptions: Array<string>;
  };
}

const SkillSelect = function ({
  skill: skill,
  onChange: onChange,
  skillOptions: skillOptions,
}: ISkillSelectProp) {
  const escapedName = skill.name;
  const pointsInvested = skill.skillPoints;
  // TODO: fix
  // const groupPointsInvested = skill.skillGroupPoints;
  return (
    <div className="skill-item">
      <label htmlFor={escapedName}>{escapedName}</label>
      <div className="skill-controls">
        <div className="skill-control-group">
          <span>Points:</span>
          <ArwesSelect
            value={pointsInvested === 0 ? "" : pointsInvested.toString()}
            className={escapedName}
            onChange={(event) => {
              const arg = { value: event.target.value };
              if (arg.value === "") {
                onChange(skill, 0, 0); // Assuming groupPointsInvested is 0 for now as it was commented out
              } else {
                onChange(skill, parseInt(arg.value), 0);
              }
            }}
          >
            <option value="" disabled>
              0
            </option>
            {skillOptions.skillPointOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </ArwesSelect>
        </div>
        <div className="skill-control-group">
          <span>Group:</span>
          <ArwesSelect
            value={""} // groupPointsInvested is commented out/0
            className={escapedName}
            onChange={(event) => {
              const arg = { value: event.target.value };
              if (arg.value === "") {
                onChange(skill, pointsInvested, 0);
              } else {
                onChange(skill, pointsInvested, parseInt(arg.value));
              }
            }}
          >
            <option value="" disabled>
              0
            </option>
            {skillOptions.skillGroupPointOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </ArwesSelect>
        </div>
      </div>
    </div>
  );
};

interface ISkillListProp {
  skillSelections: CustomSkillListType;
  setSkill: (
    skill: CustomSkillType,
    skillPoints: number,
    skillGroupPoints: number
  ) => void;
  skillCategory: skillCategoryEnum;
  skillPointItems: SkillPointInfoType;
}

const SkillList = function ({
  skillSelections: skillSelections,
  setSkill: setSkill,
  skillCategory: skillCategory,
  skillPointItems: skillPointItems,
}: ISkillListProp) {
  const getSkillOptions = function (
    pointsInvested: number,
    groupPointsInvested: number
  ) {
    // In character creation, can't break skill groups
    if (groupPointsInvested > 0) {
      if (skillPointItems.skillGroupPoints > 12) {
        return {
          skillPointOptions: ["0"],
          skillGroupPointOptions: skillRating,
        };
      }
      const attributeArray: Array<string> = [];
      const maxRating = Math.min(
        skillPointItems.skillGroupPoints + groupPointsInvested,
        12
      );
      for (let rating = 0; rating <= maxRating; rating++) {
        attributeArray.push(rating.toString());
      }
      return {
        skillPointOptions: ["0"],
        skillGroupPointOptions: attributeArray,
      };
    } else if (pointsInvested > 0) {
      if (skillPointItems.skillGroupPoints > 12) {
        return {
          skillPointOptions: ["0"],
          skillGroupPointOptions: skillRating,
        };
      }
      const attributeArray: Array<string> = [];
      const maxRating = Math.min(
        skillPointItems.skillPoints + pointsInvested,
        12
      );
      for (let rating = 0; rating <= maxRating; rating++) {
        attributeArray.push(rating.toString());
      }
      return {
        skillPointOptions: attributeArray,
        skillGroupPointOptions: ["0"],
      };
    } else {
      const pointAttributeArray: Array<string> = [];
      const groupAttributeArray: Array<string> = [];
      let maxRating = Math.min(skillPointItems.skillPoints, 12);
      for (let rating = 0; rating <= maxRating; rating++) {
        pointAttributeArray.push(rating.toString());
      }
      maxRating = Math.min(skillPointItems.skillGroupPoints, 12);
      for (let rating = 0; rating <= maxRating; rating++) {
        groupAttributeArray.push(rating.toString());
      }
      return {
        skillPointOptions: pointAttributeArray,
        skillGroupPointOptions: groupAttributeArray,
      };
    }
  };

  return (
    <div className="skill-list-container">
      {skillSelections
        .filter((skill) => skill.category === skillCategory)
        .map((skill) => {
          const skillOptions = getSkillOptions(
            skill.skillPoints,
            // TODO: fix
            // skill.skillGroupPoints
            0
          );
          return (
            <SkillSelect
              skill={skill}
              onChange={setSkill}
              skillOptions={skillOptions}
              key={skill.category + skill.name}
            />
          );
        })}
    </div>
  );
};
