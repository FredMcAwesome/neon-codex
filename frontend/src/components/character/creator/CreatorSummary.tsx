import type { EquipmentListType } from "@neon-codex/common/build/schemas/equipment/other/equipmentSchemas.js";
import type { CustomSkillListType } from "@neon-codex/common/build/schemas/abilities/skillSchemas.js";
import type {
  PriorityLevelsType,
  AttributesType,
  SpecialAttributesType,
  QualitySelectedListType,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import type {
  CharacterCreatorBonusListType,
  SkillPointInfoType,
} from "../commonSchemas.js";

interface IProps {
  priorityInfo: PriorityLevelsType;
  attributeInfo: AttributesType;
  specialAttributeInfo: SpecialAttributesType;
  karmaPoints: number;
  positiveQualitiesSelected: QualitySelectedListType;
  negativeQualitiesSelected: QualitySelectedListType;
  skillPoints: SkillPointInfoType;
  skillSelections: CustomSkillListType;
  equipmentSelected: EquipmentListType;
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
      <div>
        Positive Qualities:
        <ul>
          {props.positiveQualitiesSelected.map((quality) => {
            return (
              <li key={quality.name}>
                {quality.name} : {quality.rating}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        Negative Qualities:
        <ul>
          {props.negativeQualitiesSelected.map((quality) => {
            return (
              <li key={quality.name}>
                {quality.name} : {quality.rating}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        Skill Selections:
        <ul>
          {props.skillSelections.map((skill) => {
            return (
              <li key={skill.name}>
                {skill.name} : {skill.skillPoints}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        Equipment Selections:
        <div>
          Weapons:
          <ul>
            {props.equipmentSelected.weapons.map((weapon) => {
              return <li key={weapon.name}>{weapon.name}</li>;
            })}
          </ul>
        </div>
        <div>
          Armours:
          <ul>
            {props.equipmentSelected.armours.map((armour) => {
              return <li key={armour.name}>{armour.name}</li>;
            })}
          </ul>
        </div>
        <div>
          Gears:
          <ul>
            {props.equipmentSelected.gears.map((gear) => {
              return <li key={gear.name}>{gear.name}</li>;
            })}
          </ul>
        </div>
        <div>
          Augmentations:
          <ul>
            {props.equipmentSelected.augmentations.map((augmentation) => {
              return <li key={augmentation.name}>{augmentation.name}</li>;
            })}
          </ul>
        </div>
        <div>
          Vehicles/Drones:
          <ul>
            {props.equipmentSelected.vehicles.map((vehicle) => {
              return <li key={vehicle.name}>{vehicle.name}</li>;
            })}
          </ul>
        </div>
      </div>
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
