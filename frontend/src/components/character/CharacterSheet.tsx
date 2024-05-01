import { useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc.js";
import type {
  AttributesType,
  SpecialAttributesType,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { talentCategoryEnum } from "@neon-codex/common/build/enums.js";
import type { CustomSkillListType } from "@neon-codex/common/build/schemas/abilities/skillSchemas.js";
import type { CustomQualityListType } from "@neon-codex/common/build/schemas/abilities/qualitySchemas.js";
import type { CustomisedWeaponListType } from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import type { CustomisedArmourListType } from "@neon-codex/common/build/schemas/equipment/combat/armourSchemas.js";
import type { CustomisedGearListType } from "@neon-codex/common/build/schemas/equipment/other/gearSchemas.js";
import type { CustomisedAugmentationListType } from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";
import type { CustomisedVehicleListType } from "@neon-codex/common/build/schemas/equipment/rigger/vehicleSchemas.js";

const characterSheetPath = "/characters/:id";
const CharacterSheet = function () {
  const { id } = useParams();
  const { data, error, isError, isLoading } =
    trpc.character.getCharacter.useQuery(id || "");

  if (isLoading) {
    return <div>Loading character...</div>;
  }

  if (isError) {
    // https://tanstack.com/query/v4/docs/typescript#typing-the-error-field
    if (error instanceof Error) {
      return <div>Error! {error.message}</div>;
    } else {
      return <div>Error!</div>;
    }
  }

  return (
    <div>
      <div>Name: {data.name}</div>
      <div>Heritage: {data.heritage.name}</div>
      {Attributes(data.attributes)}
      {SpecialAttributes(data.specialAttributes)}
      {Skills(data.skills)}
      {Qualities(data.qualities)}
      {Weapons(data.weapons)}
      {Armours(data.armours)}
      {Gears(data.gears)}
      {Augmentations(data.augmentations)}
      {Vehicles(data.vehicles)}
      <div>Nuyen: {data.nuyen}</div>
      <div>Karma: {data.karmaPoints}</div>
    </div>
  );
};
export { characterSheetPath };
export default CharacterSheet;

function Attributes(data: AttributesType) {
  return (
    <div>
      Attributes:
      <div>Body: {data.body}</div>
      <div>Agility: {data.agility}</div>
      <div>Charisma: {data.charisma}</div>
      <div>Intuition: {data.intuition}</div>
      <div>Logic: {data.logic}</div>
      <div>Reaction: {data.reaction}</div>
      <div>Strength: {data.strength}</div>
      <div>Willpower: {data.willpower}</div>
    </div>
  );
}

function SpecialAttributes(data: SpecialAttributesType) {
  let talentDiv;
  switch (data.talent.type) {
    case talentCategoryEnum.Magic:
      talentDiv = <div>Magic: {data.talent.magic}</div>;
      break;
    case talentCategoryEnum.Resonance:
      talentDiv = <div>Resonance: {data.talent.resonance}</div>;
      break;
    case talentCategoryEnum.Depth:
      talentDiv = <div>Depth: {data.talent.depth}</div>;
      break;
    case talentCategoryEnum.Mundane:
      talentDiv = <div></div>;
      break;
  }
  return (
    <div>
      Special Attributes:
      <div>Edge: {data.edge}</div>
      {talentDiv}
    </div>
  );
}

function Skills(data: CustomSkillListType) {
  return (
    <div>
      Skills
      <ul>
        {data.map((skill) => {
          return (
            <li key={skill.name}>{`${skill.name}: ${skill.skillPoints}`}</li>
          );
        })}
      </ul>
    </div>
  );
}

function Qualities(data: CustomQualityListType) {
  return (
    <div>
      Qualities
      <ul>
        {data.map((quality) => {
          return <li key={quality.name}>{`${quality.name}`}</li>;
        })}
      </ul>
    </div>
  );
}

function Weapons(data: CustomisedWeaponListType) {
  return (
    <div>
      Weapons
      <ul>
        {data.map((weapon) => {
          return (
            <li key={weapon.baseWeapon.name}>{`${weapon.baseWeapon.name}`}</li>
          );
        })}
      </ul>
    </div>
  );
}

function Armours(data: CustomisedArmourListType) {
  return (
    <div>
      Armours
      <ul>
        {data.map((armour) => {
          return (
            <li key={armour.baseArmour.name}>{`${armour.baseArmour.name}`}</li>
          );
        })}
      </ul>
    </div>
  );
}

function Gears(data: CustomisedGearListType) {
  return (
    <div>
      Gears
      <ul>
        {data.map((gear) => {
          return <li key={gear.baseGear.name}>{`${gear.baseGear.name}`}</li>;
        })}
      </ul>
    </div>
  );
}

function Augmentations(data: CustomisedAugmentationListType) {
  return (
    <div>
      Augmentations
      <ul>
        {data.map((augmentation) => {
          return (
            <li
              key={augmentation.baseAugmentation.name}
            >{`${augmentation.baseAugmentation.name}`}</li>
          );
        })}
      </ul>
    </div>
  );
}

function Vehicles(data: CustomisedVehicleListType) {
  return (
    <div>
      Vehicles/Drones
      <ul>
        {data.map((vehicle) => {
          return (
            <li
              key={vehicle.baseVehicle.name}
            >{`${vehicle.baseVehicle.name}`}</li>
          );
        })}
      </ul>
    </div>
  );
}
