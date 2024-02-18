import type { EquipmentListType } from "@neon-codex/common/build/schemas/equipmentSchemas.js";
import type { CustomSkillListType } from "@neon-codex/common/build/schemas/skillSchemas.js";
import type { ISkillPoints } from "./PriorityImports.js";
import type {
  PrioritiesType,
  AttributesType,
  SpecialAttributesType,
} from "@neon-codex/common/build/schemas/characterSchemas.js";
import type { QualityListType } from "@neon-codex/common/build/schemas/qualitySchemas.js";

interface IProps {
  priorityInfo: PrioritiesType;
  attributeInfo: AttributesType;
  specialAttributeInfo: SpecialAttributesType;
  karmaPoints: number;
  positiveQualitiesSelected: QualityListType;
  negativeQualitiesSelected: QualityListType;
  skillPoints: ISkillPoints;
  skillSelections: CustomSkillListType;
  equipmentSelected: EquipmentListType;
  nuyen: number;
}

export const CreatorSummary = function (props: IProps) {
  return (
    <div>
      <div>
        Priorities:
        <div>Metatype: {props.priorityInfo.MetatypePriority}</div>
        <div>
          Metatype Subselection: {props.priorityInfo.MetatypeSubselection}
        </div>
        <div>Attributes: {props.priorityInfo.AttributesPriority}</div>
        <div>Magic: {props.priorityInfo.MagicPriority}</div>
        <div>Magic Subselection: {props.priorityInfo.MagicSubselection}</div>
        <div>Skills: {props.priorityInfo.SkillsPriority}</div>
        <div>Resources: {props.priorityInfo.ResourcesPriority}</div>
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
        <div>magic: {props.specialAttributeInfo.magic}</div>
      </div>
      <div>
        Positive Qualities:
        <ul>
          {props.positiveQualitiesSelected.map((quality) => {
            return <li key={quality.name}>{quality.name}</li>;
          })}
        </ul>
      </div>
      <div>
        Negative Qualities:
        <ul>
          {props.negativeQualitiesSelected.map((quality) => {
            return <li key={quality.name}>{quality.name}</li>;
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
