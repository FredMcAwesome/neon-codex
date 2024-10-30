import type { EquipmentListType } from "@neon-codex/common/build/schemas/equipment/other/equipmentSchemas.js";
import type {
  CustomSkillGroupListType,
  CustomSkillListType,
} from "@neon-codex/common/build/schemas/abilities/skillSchemas.js";
import type {
  PriorityLevelsType,
  AttributesType,
  SpecialAttributesType,
  QualitySelectedListType,
  LifestyleSelectedType,
  MartialArtSelectedType,
  HeritagePrioritySelectedType,
  TalentInfoType,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import type { SkillPointInfoType } from "../commonSchemas.js";
import type { CharacterCreatorBonusListType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import { talentCategoryEnum } from "@neon-codex/common/build/enums.js";
import { CollapsibleDiv } from "../../../utils/CollapsibleDiv.js";

interface IProps {
  priorityInfo: PriorityLevelsType;
  heritageInfo: HeritagePrioritySelectedType;
  attributeInfo: AttributesType;
  specialAttributeInfo: SpecialAttributesType;
  talentInfo: TalentInfoType;
  positiveQualitiesSelected: QualitySelectedListType;
  negativeQualitiesSelected: QualitySelectedListType;
  skillPoints: SkillPointInfoType;
  skillSelections: CustomSkillListType;
  skillGroupSelections: CustomSkillGroupListType;
  martialArtSelected: MartialArtSelectedType | undefined;
  equipmentSelections: EquipmentListType;
  lifestyleSelected: LifestyleSelectedType | undefined;
  karmaPoints: number;
  nuyen: number;
  bonusInfo: CharacterCreatorBonusListType;
}

export const CreatorSummary = function (props: IProps) {
  return (
    <div>
      <div>
        Priorities:
        <div>Heritage Priority: {props.priorityInfo.heritage}</div>
        <div>
          {/* Metatype Subselection: {props.priorityInfo.MetatypeSubselection} */}
        </div>
        <div>Attribute Priority: {props.priorityInfo.attributes}</div>
        <div>Talent Priority: {props.priorityInfo.talent}</div>
        {/* <div>Magic Subselection: {props.priorityInfo.MagicSubselection}</div> */}
        <div>Skill Priority: {props.priorityInfo.skills}</div>
        <div>Resource Priority: {props.priorityInfo.resources}</div>
      </div>
      <div>
        Attributes:
        <div>body: {props.attributeInfo.body}</div>
        <div>agility: {props.attributeInfo.agility}</div>
        <div>reaction: {props.attributeInfo.reaction}</div>
        <div>strength: {props.attributeInfo.strength}</div>
        <div>willpower: {props.attributeInfo.willpower}</div>
        <div>logic: {props.attributeInfo.logic}</div>
        <div>intuition: {props.attributeInfo.intuition}</div>
        <div>charisma: {props.attributeInfo.charisma}</div>
        <div>edge: {props.specialAttributeInfo.edge}</div>
        {/* <div>magic: {props.specialAttributeInfo.talent}</div> */}
      </div>
      <CollapsibleDiv title="Positive Qualities">
        <ul>
          {props.positiveQualitiesSelected.map((quality) => {
            return (
              <li key={quality.name}>
                {quality.name} : {quality.rating}
              </li>
            );
          })}
        </ul>
      </CollapsibleDiv>
      <CollapsibleDiv title="Negative Qualities">
        <ul>
          {props.negativeQualitiesSelected.map((quality) => {
            return (
              <li key={quality.name}>
                {quality.name} : {quality.rating}
              </li>
            );
          })}
        </ul>
      </CollapsibleDiv>
      <CollapsibleDiv title="Skill Selections">
        <ul>
          {props.skillSelections.map((skill) => {
            return (
              <li key={skill.name}>
                {skill.name} : {skill.skillPoints}
              </li>
            );
          })}
        </ul>
      </CollapsibleDiv>
      {Talent(props.talentInfo)}
      <CollapsibleDiv title="Martial Arts">
        <div>
          <ul>
            {props.martialArtSelected !== undefined && (
              <li key={props.martialArtSelected.martialArt.name}>
                <div>
                  Name: {props.martialArtSelected.martialArt.name}
                  Techniques:{" "}
                  <ul>
                    {props.martialArtSelected.techniqueList.map((technique) => {
                      return <li key={technique.name}>{technique.name}</li>;
                    })}
                  </ul>
                </div>
              </li>
            )}
          </ul>
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Equipment Selections">
        <CollapsibleDiv title="Weapons">
          <ul>
            {props.equipmentSelections.weapons.map((weapon) => {
              return <li key={weapon.name}>{weapon.name}</li>;
            })}
          </ul>
        </CollapsibleDiv>
        <CollapsibleDiv title="Armours">
          <ul>
            {props.equipmentSelections.armours.map((armour) => {
              return <li key={armour.name}>{armour.name}</li>;
            })}
          </ul>
        </CollapsibleDiv>
        <CollapsibleDiv title="Gears">
          <ul>
            {props.equipmentSelections.gears.map((gear) => {
              return <li key={gear.name}>{gear.name}</li>;
            })}
          </ul>
        </CollapsibleDiv>
        <CollapsibleDiv title="Augmentations">
          <ul>
            {props.equipmentSelections.augmentations.map((augmentation) => {
              return <li key={augmentation.name}>{augmentation.name}</li>;
            })}
          </ul>
        </CollapsibleDiv>
        <CollapsibleDiv title="Vehicles/Drones">
          <ul>
            {props.equipmentSelections.vehicles.map((vehicle) => {
              return <li key={vehicle.name}>{vehicle.name}</li>;
            })}
          </ul>
        </CollapsibleDiv>
      </CollapsibleDiv>
      {Lifestyle(props.lifestyleSelected)}
      <div>
        Skill Points remaining:
        <div>Points: {props.skillPoints.skillPoints}</div>
        <div>Groups: {props.skillPoints.skillGroupPoints}</div>
      </div>
      <div>Karma remaining: {props.karmaPoints}</div>
      <div>Nuyen remaining: {props.nuyen}</div>
    </div>
  );
};

function Talent(data: TalentInfoType) {
  switch (data.type) {
    case talentCategoryEnum.Magic: {
      let mentorSpirit;
      if (data.selectedMentor) {
        mentorSpirit = (
          <div>
            <div>
              Mentor Spirit:
              {data.selectedMentor.name}
            </div>
            <div>
              Choices:
              {data.selectedMentor.choices.map((choice) => {
                return choice.name;
              })}
            </div>
          </div>
        );
      }

      let formulaList;
      if (data.selectedFormulae.selectFormulae) {
        formulaList = (
          <div>
            <div>
              Spell List:
              <ul>
                {data.selectedFormulae.spells.map((spell, index) => {
                  return <li key={index}>{spell}</li>;
                })}
              </ul>
            </div>
            <div>
              Ritual List:
              <ul>
                {data.selectedFormulae.rituals.map((ritual, index) => {
                  return <li key={index}>{ritual}</li>;
                })}
              </ul>
            </div>
            <div>
              Alchemical Preparation List:
              <ul>
                {data.selectedFormulae.alchemicalPreparations.map(
                  (alchemicalPreparation, index) => {
                    return <li key={index}>{alchemicalPreparation}</li>;
                  }
                )}
              </ul>
            </div>
          </div>
        );
      }

      let adeptPowers;
      if (data.selectedAdeptPowers.selectAdeptPowers) {
        adeptPowers = (
          <div>
            Adept Powers:
            <ul>
              {data.selectedAdeptPowers.adeptPowers.map((adeptPower, index) => {
                return <li key={index}>{adeptPower}</li>;
              })}
            </ul>
          </div>
        );
      }

      return (
        <CollapsibleDiv title="Magic User">
          Tradition: {data.selectedTradition.name}
          {mentorSpirit}
          {formulaList}
          {adeptPowers}
        </CollapsibleDiv>
      );
    }

    case talentCategoryEnum.Resonance: {
      let paragon;
      if (data.selectedMentor) {
        paragon = (
          <div>
            <div>
              Paragon:
              {data.selectedMentor.name}
            </div>
          </div>
        );
      }
      return (
        <CollapsibleDiv title="Complex Forms">
          Complex Forms:
          <ul>
            {data.complexForms.map((complexForm, index) => {
              return <li key={index}>{complexForm}</li>;
            })}
            {paragon}
          </ul>
        </CollapsibleDiv>
      );
    }
    case talentCategoryEnum.Depth:
      return (
        <CollapsibleDiv title="AI Programs">
          <ul>
            {data.programs.map((program, index) => {
              return <li key={index}>{program.name}</li>;
            })}
          </ul>
        </CollapsibleDiv>
      );
    case talentCategoryEnum.Mundane:
      return <>Mundane</>;
  }
}

function Lifestyle(data: LifestyleSelectedType | undefined) {
  if (data === undefined) {
    return <div>Lifestyle not selected!</div>;
  }
  return (
    <CollapsibleDiv title="Lifestyle">
      <div>Name: {`${data.lifestyle.name}`}</div>
      <div>
        Lifestyle Qualities:{" "}
        <ul>
          {data.lifestyleQualityList.map((quality) => {
            return <li>{quality.name}</li>;
          })}
        </ul>
      </div>
    </CollapsibleDiv>
  );
}
