import React from "react";
import { IActiveSkillSelection, skillTypesEnum } from "../../data/Skills.js";
import Dropdown from "react-dropdown";
import { ISkillPoints } from "./PriorityImports.js";
import { skillsEnum } from "@shadowrun/common";

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
  skillPoints: ISkillPoints;
  setSkillPoints: (loadingSkillPoints: ISkillPoints) => void;
  skillSelections: Array<IActiveSkillSelection>;
  setSkillSelections: (
    loadingSkillPoints: Array<IActiveSkillSelection>
  ) => void;
}

export const SkillsSelect = function (props: IProps) {
  const setSkill = function (skill: skillsEnum, newValue: number) {
    const newSkillSelections = [...props.skillSelections];
    let newSkillPoints = props.skillPoints;
    newSkillPoints.skillPoints -=
      newValue - newSkillSelections[skill].pointsInvested;
    newSkillSelections[skill].pointsInvested = newValue;
    props.setSkillPoints(newSkillPoints);
    props.setSkillSelections(newSkillSelections);
  };

  return (
    <React.Fragment>
      <h1>Skills Selection</h1>
      <p>
        Skill Points Remaining:{" "}
        <span id="skillPoints">{props.skillPoints.skillPoints}</span>
      </p>
      <div>
        <h2>Combat Skills</h2>
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillTypesEnum.Combat}
          skillPoints={props.skillPoints.skillPoints}
        />
      </div>
      <div>
        <h2>Physical Skills</h2>
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillTypesEnum.Physical}
          skillPoints={props.skillPoints.skillPoints}
        />
      </div>
      <div>
        <h2>Social Skills</h2>
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillTypesEnum.Social}
          skillPoints={props.skillPoints.skillPoints}
        />
      </div>
      <div>
        <h2>Magical Skills</h2>
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillTypesEnum.Magical}
          skillPoints={props.skillPoints.skillPoints}
        />
      </div>
      <div>
        <h2>Resonance Skills</h2>
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillTypesEnum.Resonance}
          skillPoints={props.skillPoints.skillPoints}
        />
      </div>
      <div>
        <h2>Technical Skills</h2>
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillTypesEnum.Technical}
          skillPoints={props.skillPoints.skillPoints}
        />
      </div>
      <div>
        <h2>Vehicle Skills</h2>
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillType={skillTypesEnum.Vehicle}
          skillPoints={props.skillPoints.skillPoints}
        />
      </div>
    </React.Fragment>
  );
};

interface ISkillSelectProp {
  skill: IActiveSkillSelection;
  onChange: (skill: skillsEnum, newValue: number) => void;
  skillOptions: Array<string>;
}

const SkillSelect = function ({
  skill: skill,
  onChange: onChange,
  skillOptions: skillOptions,
}: ISkillSelectProp) {
  const escapedName = skill.name;
  const value = skill.pointsInvested;
  const skillId = skill.id;
  return (
    <div>
      <label htmlFor={escapedName}>{escapedName}</label>
      <Dropdown
        options={skillOptions}
        value={value === 0 ? "" : value.toString()}
        className={escapedName}
        placeholder={""}
        onChange={(arg) => {
          if (arg.value === "") {
            onChange(skillId, 0);
          } else {
            onChange(skillId, parseInt(arg.value));
          }
        }}
      />
    </div>
  );
};

interface ISkillListProp {
  skillSelections: Array<IActiveSkillSelection>;
  setSkill: (skill: skillsEnum, newValue: number) => void;
  skillType: skillTypesEnum;
  skillPoints: number;
}

const SkillList = function ({
  skillSelections: skillSelections,
  setSkill: setSkill,
  skillType: skillType,
  skillPoints: skillPoints,
}: ISkillListProp) {
  const getSkillOptions = function (pointsInvested: number) {
    if (skillPoints > 12) {
      return skillRating;
    }
    let attributeArray: Array<string> = [];
    const maxRating = Math.min(skillPoints + pointsInvested, 12);
    for (let rating = 0; rating <= maxRating; rating++) {
      attributeArray.push(rating.toString());
    }
    return attributeArray;
  };

  return (
    <React.Fragment>
      {skillSelections
        .filter((skill) => skill.skillType === skillType)
        .map((skill) => {
          const skillOptions = getSkillOptions(skill.pointsInvested);
          return (
            <SkillSelect
              skill={skill}
              onChange={setSkill}
              skillOptions={skillOptions}
              key={skill.skillType + skill.name}
            />
          );
        })}
    </React.Fragment>
  );
};
