import { Fragment } from "react";
import { ArwesSelect } from "../../common/ArwesSelect.js";
import { CollapsibleDiv } from "../../../utils/CollapsibleDiv.js";
import { skillCategoryEnum } from "@neon-codex/common/build/enums.js";
import type {
  CustomSkillListType,
  CustomSkillType,
} from "@neon-codex/common/build/schemas/abilities/skillSchemas.js";
import type { SkillPointInfoType } from "../commonSchemas.js";
import type { CharacterCreatorBonusListType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";

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
  const setSkill = function (
    skill: CustomSkillType,
    skillPoints: number,
    // TODO: implement skill group points
    _skillGroupPoints: number
  ) {
    const newSkillSelections = [...props.skillSelections];
    const skillPointItems = props.skillPointItems;
    const foundSkillIndex = newSkillSelections.findIndex(
      (listSkill) => listSkill.name == skill.name
    );
    const foundSkill = newSkillSelections[foundSkillIndex];
    skillPointItems.skillPoints -= skillPoints - foundSkill.skillPoints;
    // skillPointItems.skillGroupPoints -=
    //   skillGroupPoints - foundSkill.skillGroupPoints;
    newSkillSelections[foundSkillIndex].skillPoints = skillPoints;
    // newSkillSelections[foundSkillIndex].skillGroupPoints = skillGroupPoints;
    props.setSkillPoints(skillPointItems);
    props.setSkillSelections(newSkillSelections);
  };

  return (
    <Fragment>
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
          skillCategory={skillCategoryEnum.Combat}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Physical Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Physical}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Social Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Social}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Magical Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Magical}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Resonance Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Resonance}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Technical Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Technical}
          skillPointItems={props.skillPointItems}
        />
      </CollapsibleDiv>
      <CollapsibleDiv title="Vehicle/Drone Skills">
        <SkillList
          skillSelections={props.skillSelections}
          setSkill={setSkill}
          skillCategory={skillCategoryEnum.Vehicle}
          skillPointItems={props.skillPointItems}
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
