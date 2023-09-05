import React from "react";
import Dropdown from "react-dropdown";
import { ISkillPoints as ISkillPointItems } from "./PriorityImports.js";
import { CollapsibleDiv } from "../../utils/CollapsibleDiv.js";
import {
  CustomSkillListType,
  CustomSkillType,
} from "@shadowrun/common/build/schemas/skillSchemas.js";
import { skillCategoryEnum } from "@shadowrun/common/build/enums.js";

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
  skillPointItems: ISkillPointItems;
  setSkillPoints: (loadingSkillPoints: ISkillPointItems) => void;
  skillSelections: CustomSkillListType;
  setSkillSelections: (loadingSkillPoints: CustomSkillListType) => void;
}

export const SkillSelectList = function (props: IProps) {
  const setSkill = function (
    skill: CustomSkillType,
    skillPoints: number,
    skillGroupPoints: number
  ) {
    const newSkillSelections = [...props.skillSelections];
    let skillPointItems = props.skillPointItems;
    const foundSkillIndex = newSkillSelections.findIndex(
      (listSkill) => listSkill.name == skill.name
    )!;
    const foundSkill = newSkillSelections[foundSkillIndex];
    skillPointItems.skillPoints -= skillPoints - foundSkill.skillPoints;
    skillPointItems.skillGroupPoints -=
      skillGroupPoints - foundSkill.skillGroupPoints;
    newSkillSelections[foundSkillIndex].skillPoints = skillPoints;
    newSkillSelections[foundSkillIndex].skillGroupPoints = skillGroupPoints;
    props.setSkillPoints(skillPointItems);
    props.setSkillSelections(newSkillSelections);
  };

  return (
    <React.Fragment>
      <h1>Skills Selection</h1>
      <div>
        Skill Points Remaining:
        <p id="skillPoints">
          Skill Points: {props.skillPointItems.skillPoints}
        </p>
        <p id="skillGroupPoints">
          Skill Group Points: {props.skillPointItems.skillGroupPoints}
        </p>
      </div>
      <CollapsibleDiv title="Combat Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillCategoryEnum.Combat}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Physical Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillCategoryEnum.Physical}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Social Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillCategoryEnum.Social}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Magical Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillCategoryEnum.Magical}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Resonance Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillCategoryEnum.Resonance}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Technical Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillCategoryEnum.Technical}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Vehicle/Drone Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillCategoryEnum.Vehicle}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
    </React.Fragment>
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
  const groupPointsInvested = skill.skillGroupPoints;
  return (
    <div>
      <label htmlFor={escapedName}>{escapedName}</label>
      <Dropdown
        options={skillOptions.skillPointOptions}
        value={pointsInvested === 0 ? "" : pointsInvested.toString()}
        className={escapedName}
        placeholder={""}
        onChange={(arg) => {
          if (arg.value === "") {
            onChange(skill, 0, groupPointsInvested);
          } else {
            onChange(skill, parseInt(arg.value), groupPointsInvested);
          }
        }}
      />
      <Dropdown
        options={skillOptions.skillGroupPointOptions}
        value={groupPointsInvested === 0 ? "" : groupPointsInvested.toString()}
        className={escapedName}
        placeholder={""}
        onChange={(arg) => {
          if (arg.value === "") {
            onChange(skill, pointsInvested, 0);
          } else {
            onChange(skill, pointsInvested, parseInt(arg.value));
          }
        }}
      />
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
  skillType: skillCategoryEnum;
  skillPointItems: ISkillPointItems;
}

const SkillList = function ({
  skillSelections: skillSelections,
  setSkill: setSkill,
  skillType: skillCategory,
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
      let attributeArray: Array<string> = [];
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
      let attributeArray: Array<string> = [];
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
      let pointAttributeArray: Array<string> = [];
      let groupAttributeArray: Array<string> = [];
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
    <React.Fragment>
      {skillSelections
        .filter((skill) => skill.category === skillCategory)
        .map((skill) => {
          const skillOptions = getSkillOptions(
            skill.skillPoints,
            skill.skillGroupPoints
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
    </React.Fragment>
  );
};
