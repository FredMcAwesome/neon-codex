import { useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc.js";
import {
  attributeTypeEnum,
  talentCategoryEnum,
  type AttributesType,
  type CustomQualityListType,
  type CustomSkillListType,
  type CustomisedArmourListType,
  type CustomisedAugmentationListType,
  type CustomisedGearListType,
  type CustomisedVehicleListType,
  type CustomisedWeaponListType,
  type LifestyleSelectedListType,
  type MartialArtSelectedListType,
  type SpecialAttributesType,
  type TalentInfoType,
} from "@neon-codex/common";
import { CollapsibleDiv } from "../../utils/CollapsibleDiv.js";
import { ArwesCard } from "../common/ArwesCard.js";

const characterSheetPath = "/characters/:id";
const CharacterSheet = function () {
  const { id } = useParams();
  const { data, error, isError, isPending } =
    trpc.character.getCharacter.useQuery(id ?? "");

  if (isPending) {
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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <ArwesCard title={data.name} className="character-sheet-card">
        <div style={{ marginBottom: "20px" }}>
          <div>
            <strong>Heritage:</strong> {data.heritage.name}
          </div>
          <div>
            <strong>Nuyen:</strong> {data.nuyen}
          </div>
          <div>
            <strong>Karma:</strong> {data.karmaPoints}
          </div>
        </div>

        <div style={{ display: "grid", gap: "20px" }}>
          <ArwesCard title="Attributes" palette="secondary">
            {Attributes(data.attributes)}
          </ArwesCard>

          <ArwesCard title="Special Attributes" palette="secondary">
            {SpecialAttributes(data.specialAttributes)}
          </ArwesCard>

          {Skills(data.skillList, data.attributes, data.specialAttributes)}
          {Talent(data.talentInfo)}
          {Qualities(data.qualityList)}
          {Weapons(data.weaponList)}
          {Armours(data.armourList)}
          {Gears(data.gearList)}
          {Augmentations(data.augmentationList)}
          {Vehicles(data.vehicleList)}
          {MartialArts(data.martialArtList)}
          {Lifestyles(data.lifestyleList)}
        </div>
      </ArwesCard>
    </div>
  );
};
export { characterSheetPath };
export default CharacterSheet;

function Attributes(data: AttributesType) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: "10px",
      }}
    >
      <div>
        <strong>Body:</strong> {data.body}
      </div>
      <div>
        <strong>Agility:</strong> {data.agility}
      </div>
      <div>
        <strong>Charisma:</strong> {data.charisma}
      </div>
      <div>
        <strong>Intuition:</strong> {data.intuition}
      </div>
      <div>
        <strong>Logic:</strong> {data.logic}
      </div>
      <div>
        <strong>Reaction:</strong> {data.reaction}
      </div>
      <div>
        <strong>Strength:</strong> {data.strength}
      </div>
      <div>
        <strong>Willpower:</strong> {data.willpower}
      </div>
    </div>
  );
}

function SpecialAttributes(data: SpecialAttributesType) {
  let talentDiv;
  switch (data.talent.category) {
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: "10px",
      }}
    >
      <div>
        <strong>Edge:</strong> {data.edge}
      </div>
      {talentDiv}
    </div>
  );
}

function Skills(
  skillList: CustomSkillListType,
  attributeList: AttributesType,
  specialAttributeList: SpecialAttributesType
) {
  return (
    <CollapsibleDiv title="Skills">
      <ul>
        {skillList.map((skill) => {
          let attributeLevel;
          switch (skill.attribute) {
            case attributeTypeEnum.Agility:
              attributeLevel = attributeList.agility;
              break;
            case attributeTypeEnum.Body:
              attributeLevel = attributeList.body;
              break;
            case attributeTypeEnum.Charisma:
              attributeLevel = attributeList.charisma;
              break;
            case attributeTypeEnum.Intuition:
              attributeLevel = attributeList.intuition;
              break;
            case attributeTypeEnum.Logic:
              attributeLevel = attributeList.logic;
              break;
            case attributeTypeEnum.Reaction:
              attributeLevel = attributeList.reaction;
              break;
            case attributeTypeEnum.Resonance:
              attributeLevel = attributeList.agility;
              break;
            case attributeTypeEnum.Strength:
              attributeLevel = attributeList.strength;
              break;
            case attributeTypeEnum.Willpower:
              attributeLevel = attributeList.willpower;
              break;
            case attributeTypeEnum.Depth: {
              const depth =
                specialAttributeList.talent.category ===
                talentCategoryEnum.Depth
                  ? specialAttributeList.talent.depth
                  : 0;
              attributeLevel = depth;
              break;
            }
            case attributeTypeEnum.Edge:
              attributeLevel = specialAttributeList.edge;
              break;
            case attributeTypeEnum.Magic: {
              const magic =
                specialAttributeList.talent.category ===
                talentCategoryEnum.Magic
                  ? specialAttributeList.talent.magic
                  : 0;
              attributeLevel = magic;

              break;
            }
            case attributeTypeEnum.Initiative: {
              // todo: this should never occur
              attributeLevel = attributeList.agility;
            }
          }
          const skillTotal = attributeLevel + skill.skillPoints;
          return <li key={skill.name}>{`${skill.name}: ${skillTotal}`}</li>;
        })}
      </ul>
    </CollapsibleDiv>
  );
}

function Talent(data: TalentInfoType) {
  switch (data.category) {
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

function Qualities(data: CustomQualityListType) {
  return (
    <CollapsibleDiv title="Qualities">
      Qualities
      <ul>
        {data.map((quality) => {
          return <li key={quality.name}>{`${quality.name}`}</li>;
        })}
      </ul>
    </CollapsibleDiv>
  );
}

function Weapons(data: CustomisedWeaponListType) {
  return (
    <CollapsibleDiv title="Weapons">
      <ul>
        {data.map((weapon) => {
          return <li key={weapon.baseWeapon}>{`${weapon.baseWeapon}`}</li>;
        })}
      </ul>
    </CollapsibleDiv>
  );
}

function Armours(data: CustomisedArmourListType) {
  return (
    <CollapsibleDiv title="Armours">
      <ul>
        {data.map((armour) => {
          return <li key={armour.baseArmour}>{`${armour.baseArmour}`}</li>;
        })}
      </ul>
    </CollapsibleDiv>
  );
}

function Gears(data: CustomisedGearListType) {
  return (
    <CollapsibleDiv title="Gears">
      <ul>
        {data.map((gear) => {
          return <li key={gear.baseGear}>{`${gear.baseGear}`}</li>;
        })}
      </ul>
    </CollapsibleDiv>
  );
}

function Augmentations(data: CustomisedAugmentationListType) {
  return (
    <CollapsibleDiv title="Augmentations">
      <ul>
        {data.map((augmentation) => {
          return (
            <li
              key={augmentation.baseAugmentation}
            >{`${augmentation.baseAugmentation}`}</li>
          );
        })}
      </ul>
    </CollapsibleDiv>
  );
}

function Vehicles(data: CustomisedVehicleListType) {
  return (
    <CollapsibleDiv title="Vehicles/Drones">
      <ul>
        {data.map((vehicle) => {
          return <li key={vehicle.baseVehicle}>{`${vehicle.baseVehicle}`}</li>;
        })}
      </ul>
    </CollapsibleDiv>
  );
}

function MartialArts(data: MartialArtSelectedListType) {
  return (
    <CollapsibleDiv title="Martial Arts">
      <ul>
        {data.map((martialArt) => {
          return (
            <li key={martialArt.martialArt.name}>
              <div>
                Style: {`${martialArt.martialArt.name}`}
                Techniques:{" "}
                {martialArt.techniqueList.map((technique) => {
                  return technique.name;
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </CollapsibleDiv>
  );
}

function Lifestyles(data: LifestyleSelectedListType) {
  return data.map((lifestyle) => {
    return (
      <CollapsibleDiv title="Lifestyle">
        <div key={lifestyle.lifestyle.name}>
          Name: {`${lifestyle.lifestyle.name}`}
        </div>
        <div>
          Lifestyle Qualities:{" "}
          <ul>
            {lifestyle.lifestyleQualityList.map((quality) => {
              return (
                <li key={lifestyle.lifestyle.name + quality.name}>
                  {quality.name}
                </li>
              );
            })}
          </ul>
        </div>
        <div>Duration: {lifestyle.purchasedDuration}</div>
      </CollapsibleDiv>
    );
  });
}
