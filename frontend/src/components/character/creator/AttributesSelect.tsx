import { Fragment, useState } from "react";
import { ArwesSelect } from "../../common/ArwesSelect.js";
import {
  type AttributesType,
  type SpecialAttributesType,
  type PriorityLevelsType,
  type HeritagePrioritySelectedType,
  type AttributeRangesType,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { trpc } from "../../../utils/trpc.js";
import {
  baseAttributeTypeEnum,
  heritageCategoryEnum,
  specialAttributeTypeEnum,
  talentCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import type { HeritageListType } from "@neon-codex/common/build/schemas/abilities/heritageSchemas.js";
import type { TalentPriorityType } from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import type {
  AttributeRangeType,
  CharacterCreatorBonusListType,
} from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import { type } from "arktype";

const AttributeOptionsSchema = type({
  "+": "reject",
  body: "string[]",
  agility: "string[]",
  reaction: "string[]",
  strength: "string[]",
  willpower: "string[]",
  logic: "string[]",
  intuition: "string[]",
  charisma: "string[]",
});
type AttributesOptionsType = typeof AttributeOptionsSchema.infer;

const SpecialAttributeOptionsSchema = type({
  "+": "reject",
  edge: "string[]",
  talent: type.or(
    type({
      "+": "reject",
      category: type.unit(talentCategoryEnum.Magic),
      magic: "string[]",
    }),
    type({
      "+": "reject",
      category: type.unit(talentCategoryEnum.Resonance),
      resonance: "string[]",
    }),
    type({
      "+": "reject",
      category: type.unit(talentCategoryEnum.Depth),
      depth: "string[]",
    }),
    type({
      "+": "reject",
      category: type.unit(talentCategoryEnum.Mundane),
    })
  ),
});
type SpecialAttributeOptionsType = typeof SpecialAttributeOptionsSchema.infer;

interface IProps {
  priorityInfo: PriorityLevelsType;
  heritageInfo: HeritagePrioritySelectedType;
  attributeInfo: AttributesType;
  setAttributeInfo: (loadingAttributes: AttributesType) => void;
  specialAttributeInfo: SpecialAttributesType;
  setSpecialAttributeInfo: (
    loadingSpecialAttributes: SpecialAttributesType
  ) => void;
  maxAttributePoints: number;
  talentInfo: TalentPriorityType;
  bonusInfo: CharacterCreatorBonusListType;
  setBonusInfo: (loadingBonusInfo: CharacterCreatorBonusListType) => void;
}

const AttributeListSelect = function (props: IProps) {
  const heritages = trpc.character.heritages.useQuery();

  if (heritages.isError) {
    return <>{heritages.error}</>;
  }

  if (heritages.data === undefined) {
    return <></>;
  }

  return (
    <AttributesSelectLoaded
      heritages={heritages.data}
      priorityInfo={props.priorityInfo}
      heritageInfo={props.heritageInfo}
      attributeInfo={props.attributeInfo}
      setAttributeInfo={props.setAttributeInfo}
      specialAttributeInfo={props.specialAttributeInfo}
      setSpecialAttributeInfo={props.setSpecialAttributeInfo}
      maxAttributePoints={props.maxAttributePoints}
      talentInfo={props.talentInfo}
      bonusInfo={props.bonusInfo}
      setBonusInfo={props.setBonusInfo}
    />
  );
};
export default AttributeListSelect;

const AttributesSelectLoaded = function (
  props: IProps & { heritages: HeritageListType }
) {
  const selectedHeritage: { base: string; metavariant?: string } = {
    base: props.heritageInfo.heritage,
  };
  if (props.heritageInfo.metavariant !== undefined) {
    selectedHeritage.metavariant = props.heritageInfo.metavariant;
  }

  const foundHeritage = props.heritages.find((heritage) => {
    if (
      selectedHeritage.metavariant !== undefined &&
      heritage.category === heritageCategoryEnum.Metavariant
    ) {
      return (
        heritage.name === selectedHeritage.metavariant &&
        heritage.baseHeritage === selectedHeritage.base
      );
    } else {
      return heritage.name === selectedHeritage.base;
    }
  });
  if (foundHeritage === undefined) {
    throw Error(
      `foundHeritage: ${selectedHeritage.base} ${selectedHeritage.metavariant} is undefined`
    );
  }

  const attributeRanges: AttributeRangesType = {
    body: foundHeritage.bodyAttributeRange,
    agility: foundHeritage.agilityAttributeRange,
    reaction: foundHeritage.reactionAttributeRange,
    strength: foundHeritage.strengthAttributeRange,
    willpower: foundHeritage.willpowerAttributeRange,
    logic: foundHeritage.logicAttributeRange,
    intuition: foundHeritage.intuitionAttributeRange,
    charisma: foundHeritage.charismaAttributeRange,
    edge: foundHeritage.edgeAttributeRange,
    magic: foundHeritage.magicAttributeRange,
    resonance: foundHeritage.resonanceAttributeRange,
    depth: foundHeritage.depthAttributeRange,
  };

  const [attributePoints, setAttributePoints] = useState(
    props.maxAttributePoints
  );
  const [specialAttributePoints, setSpecialAttributePoints] = useState(
    props.heritageInfo.specialAttributePoints
  );
  const attributeOptions: AttributesOptionsType = getAttributeListOptions();

  const specialAttributeOptions: SpecialAttributeOptionsType =
    getSpecialAttributeListOptions();

  function getAttributeListOptions() {
    const newOptions: AttributesOptionsType = {
      body: [],
      agility: [],
      reaction: [],
      strength: [],
      willpower: [],
      logic: [],
      intuition: [],
      charisma: [],
    };
    newOptions.body = getAttributeOptions(attributeRanges.body);
    newOptions.agility = getAttributeOptions(attributeRanges.agility);
    newOptions.reaction = getAttributeOptions(attributeRanges.reaction);
    newOptions.strength = getAttributeOptions(attributeRanges.strength);
    newOptions.willpower = getAttributeOptions(attributeRanges.willpower);
    newOptions.logic = getAttributeOptions(attributeRanges.logic);
    newOptions.intuition = getAttributeOptions(attributeRanges.intuition);
    newOptions.charisma = getAttributeOptions(attributeRanges.charisma);
    return newOptions;
  }

  function getAttributeOptions(attribute: AttributeRangeType) {
    const options: Array<string> = [];
    // Don't do any checks here, only check for valid attributes
    // when trying to go to the next page/step
    for (let value = attribute.min; value <= attribute.max; value++) {
      options.push(value.toString());
    }
    return options;
  }

  function getSpecialAttributeListOptions() {
    const newOptions: SpecialAttributeOptionsType = {
      edge: [],
      talent: { category: talentCategoryEnum.Mundane },
    };

    newOptions.edge = getAttributeOptions(attributeRanges.edge);

    switch (props.talentInfo.category) {
      case talentCategoryEnum.Magic:
        newOptions.talent = {
          category: talentCategoryEnum.Magic,
          magic: getAttributeOptions(attributeRanges.magic),
        };
        break;
      case talentCategoryEnum.Resonance:
        newOptions.talent = {
          category: talentCategoryEnum.Resonance,
          resonance: getAttributeOptions(attributeRanges.resonance),
        };
        break;
      case talentCategoryEnum.Depth:
        newOptions.talent = {
          category: talentCategoryEnum.Depth,
          depth: getAttributeOptions(attributeRanges.depth),
        };
        break;
      case talentCategoryEnum.Mundane:
        break;
    }

    return newOptions;
  }

  function changeAttribute(
    attributeType: baseAttributeTypeEnum,
    attributeStr: string
  ) {
    let attributeParsed = attributeStr.replace(/\D/g, "");
    if (attributeParsed.length === 0) attributeParsed = "0";
    const attributeValue = parseInt(attributeParsed);
    if (isNaN(attributeValue)) {
      throw Error("attributeValue is NaN");
    }
    const newAttributes = props.attributeInfo;
    let difference = 0;
    switch (attributeType) {
      case baseAttributeTypeEnum.Body:
        difference = newAttributes.body - attributeValue;
        newAttributes.body = attributeValue;
        break;
      case baseAttributeTypeEnum.Agility:
        difference = newAttributes.agility - attributeValue;
        newAttributes.agility = attributeValue;
        break;
      case baseAttributeTypeEnum.Reaction:
        difference = newAttributes.reaction - attributeValue;
        newAttributes.reaction = attributeValue;
        break;
      case baseAttributeTypeEnum.Strength:
        difference = newAttributes.strength - attributeValue;
        newAttributes.strength = attributeValue;
        break;
      case baseAttributeTypeEnum.Willpower:
        difference = newAttributes.willpower - attributeValue;
        newAttributes.willpower = attributeValue;
        break;
      case baseAttributeTypeEnum.Logic:
        difference = newAttributes.logic - attributeValue;
        newAttributes.logic = attributeValue;
        break;
      case baseAttributeTypeEnum.Intuition:
        difference = newAttributes.intuition - attributeValue;
        newAttributes.intuition = attributeValue;
        break;
      case baseAttributeTypeEnum.Charisma:
        difference = newAttributes.charisma - attributeValue;
        newAttributes.charisma = attributeValue;
        break;
    }
    props.setAttributeInfo(newAttributes);
    setAttributePoints(attributePoints + difference);
  }

  function changeSpecialAttribute(
    attributeType: specialAttributeTypeEnum,
    attributeStr: string
  ) {
    let attributeParsed = attributeStr.replace(/\D/g, "");
    if (attributeParsed.length === 0) attributeParsed = "0";
    const attributeValue = parseInt(attributeParsed);
    if (isNaN(attributeValue)) {
      throw Error("attributeValue is NaN");
    }
    const newAttributes = props.specialAttributeInfo;
    let difference = 0;
    switch (attributeType) {
      case specialAttributeTypeEnum.Edge:
        difference = newAttributes.edge - attributeValue;
        newAttributes.edge = attributeValue;
        break;
      case specialAttributeTypeEnum.Magic:
        if (newAttributes.talent.category !== talentCategoryEnum.Magic) {
          throw Error("Invalid special attribute type");
        }
        difference = newAttributes.talent.magic - attributeValue;
        newAttributes.talent.magic = attributeValue;
        break;
      case specialAttributeTypeEnum.Depth:
        if (newAttributes.talent.category !== talentCategoryEnum.Depth) {
          throw Error("Invalid special attribute type");
        }
        difference = newAttributes.talent.depth - attributeValue;
        newAttributes.talent.depth = attributeValue;
        break;
      case specialAttributeTypeEnum.Resonance:
        if (newAttributes.talent.category !== talentCategoryEnum.Resonance) {
          throw Error("Invalid special attribute type");
        }
        difference = newAttributes.talent.resonance - attributeValue;
        newAttributes.talent.resonance = attributeValue;
        break;
    }
    props.setSpecialAttributeInfo(newAttributes);
    setSpecialAttributePoints(specialAttributePoints + difference);
  }

  return (
    <div>
      <h1>Attribute Selection</h1>
      <div className="attribute-header-info">
        <p>
          Heritage: <span id="heritage">{props.heritageInfo.heritage}</span>
          {props.heritageInfo.metavariant !== undefined && (
            <span id="metavariant">({props.heritageInfo.metavariant})</span>
          )}
        </p>
        <p>
          Attribute Points Remaining:{" "}
          <span id="attribute_points">{attributePoints}</span>
        </p>
        <p style={{ width: "100%", fontSize: "0.9em", opacity: 0.8 }}>
          Only one normal Attribute can be at max
        </p>
      </div>

      <div className="attribute-selection-container">
        <div className="attribute-card">
          <label htmlFor="body">Body</label>
          <div className="range-info">Resisting physical damage</div>
          <div className="range-info">
            {"Min/Max: " +
              attributeRanges.body.min +
              "/" +
              attributeRanges.body.max}
          </div>
          <ArwesSelect
            value={props.attributeInfo.body.toString()}
            onChange={(event) => {
              changeAttribute(baseAttributeTypeEnum.Body, event.target.value);
            }}
            className="body"
          >
            {attributeOptions.body.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </div>

        <div className="attribute-card">
          <label htmlFor="agility">Agility</label>
          <div className="range-info">Attack accuracy</div>
          <div className="range-info">
            {"Min/Max: " +
              attributeRanges.agility.min +
              "/" +
              attributeRanges.agility.max}
          </div>
          <ArwesSelect
            value={props.attributeInfo.agility.toString()}
            onChange={(event) => {
              changeAttribute(
                baseAttributeTypeEnum.Agility,
                event.target.value
              );
            }}
            className="agility"
          >
            {attributeOptions.agility.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </div>

        <div className="attribute-card">
          <label htmlFor="reaction">Reaction</label>
          <div className="range-info">Initiative, Dodging</div>
          <div className="range-info">
            {"Min/Max: " +
              attributeRanges.reaction.min +
              "/" +
              attributeRanges.reaction.max}
          </div>
          <ArwesSelect
            value={props.attributeInfo.reaction.toString()}
            onChange={(event) => {
              changeAttribute(
                baseAttributeTypeEnum.Reaction,
                event.target.value
              );
            }}
            className="reaction"
          >
            {attributeOptions.reaction.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </div>

        <div className="attribute-card">
          <label htmlFor="strength">Strength</label>
          <div className="range-info">Melee damage</div>
          <div className="range-info">
            {"Min/Max: " +
              attributeRanges.strength.min +
              "/" +
              attributeRanges.strength.max}
          </div>
          <ArwesSelect
            value={props.attributeInfo.strength.toString()}
            onChange={(event) => {
              changeAttribute(
                baseAttributeTypeEnum.Strength,
                event.target.value
              );
            }}
            className="strength"
          >
            {attributeOptions.strength.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </div>

        <div className="attribute-card">
          <label htmlFor="willpower">Willpower</label>
          <div className="range-info">Spell drain, Avoiding stun</div>
          <div className="range-info">
            {"Min/Max: " +
              attributeRanges.willpower.min +
              "/" +
              attributeRanges.willpower.max}
          </div>
          <ArwesSelect
            value={props.attributeInfo.willpower.toString()}
            onChange={(event) => {
              changeAttribute(
                baseAttributeTypeEnum.Willpower,
                event.target.value
              );
            }}
            className="willpower"
          >
            {attributeOptions.willpower.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </div>

        <div className="attribute-card">
          <label htmlFor="logic">Logic</label>
          <div className="range-info">Hermetic spell drain</div>
          <div className="range-info">
            {"Min/Max: " +
              attributeRanges.logic.min +
              "/" +
              attributeRanges.logic.max}
          </div>
          <ArwesSelect
            value={props.attributeInfo.logic.toString()}
            onChange={(event) => {
              changeAttribute(baseAttributeTypeEnum.Logic, event.target.value);
            }}
            className="logic"
          >
            {attributeOptions.logic.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </div>

        <div className="attribute-card">
          <label htmlFor="intuition">Intuition</label>
          <div className="range-info">Initiative, Dodging</div>
          <div className="range-info">
            {"Min/Max: " +
              attributeRanges.intuition.min +
              "/" +
              attributeRanges.intuition.max}
          </div>
          <ArwesSelect
            value={props.attributeInfo.intuition.toString()}
            onChange={(event) => {
              changeAttribute(
                baseAttributeTypeEnum.Intuition,
                event.target.value
              );
            }}
            className="intuition"
          >
            {attributeOptions.intuition.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </div>

        <div className="attribute-card">
          <label htmlFor="charisma">Charisma</label>
          <div className="range-info">Shaman spell drain</div>
          <div className="range-info">
            {"Min/Max: " +
              attributeRanges.charisma.min +
              "/" +
              attributeRanges.charisma.max}
          </div>
          <ArwesSelect
            value={props.attributeInfo.charisma.toString()}
            onChange={(event) => {
              changeAttribute(
                baseAttributeTypeEnum.Charisma,
                event.target.value
              );
            }}
            className="charisma"
          >
            {attributeOptions.charisma.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </div>

        <div className="attribute-card">
          <label htmlFor="initiative">Initiative</label>
          <div className="range-info">(Reaction + Intuition)</div>
          <div
            style={{
              fontSize: "1.5em",
              fontWeight: "bold",
              color: "var(--arwes-paltte-primary-main)",
            }}
          >
            {props.attributeInfo.reaction + props.attributeInfo.intuition}
          </div>
        </div>
      </div>

      <div className="attribute-header-info" style={{ marginTop: "20px" }}>
        <p>
          Special Attribute Points Remaining:{" "}
          <span id="special_attribute_points">{specialAttributePoints}</span>
        </p>
      </div>

      <div className="attribute-selection-container">
        <div className="attribute-card" id="edge_div">
          <label htmlFor="edge">Edge</label>
          <div className="range-info">Luck</div>
          <div className="range-info">
            {"Min/Max: " +
              attributeRanges.edge.min +
              "/" +
              attributeRanges.edge.max}
          </div>
          <ArwesSelect
            value={props.specialAttributeInfo.edge.toString()}
            onChange={(event) => {
              changeSpecialAttribute(
                specialAttributeTypeEnum.Edge,
                event.target.value
              );
            }}
            className="edge"
          >
            {specialAttributeOptions.edge.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </div>
        <SpecialAttributeSelect
          attributeRanges={attributeRanges}
          specialAttributeInfo={props.specialAttributeInfo}
          specialAttributeOptions={specialAttributeOptions}
          talentInfo={props.talentInfo}
          changeSpecialAttribute={changeSpecialAttribute}
        />
      </div>
    </div>
  );
};

interface ISpecialAttributeProps {
  attributeRanges: AttributeRangesType;
  specialAttributeInfo: SpecialAttributesType;
  specialAttributeOptions: SpecialAttributeOptionsType;
  talentInfo: TalentPriorityType;
  changeSpecialAttribute: (
    attributeType: specialAttributeTypeEnum,
    attributeStr: string
  ) => void;
}

const SpecialAttributeSelect = function (props: ISpecialAttributeProps) {
  const talentOptions = props.specialAttributeOptions.talent;
  const talentAttributePoints = props.specialAttributeInfo.talent;
  let frag;

  switch (props.talentInfo.category) {
    case talentCategoryEnum.Magic:
      if (talentOptions.category !== talentCategoryEnum.Magic) {
        throw Error("talentCategoryEnum is wrong");
      }
      if (talentAttributePoints.category !== talentCategoryEnum.Magic) {
        throw Error("talentCategoryEnum is wrong");
      }
      frag = (
        <Fragment>
          <div className="range-info">
            {"Min/Max: " +
              props.attributeRanges.magic.min +
              "/" +
              props.attributeRanges.magic.max}
          </div>
          <ArwesSelect
            value={talentAttributePoints.magic.toString()}
            onChange={(event) => {
              props.changeSpecialAttribute(
                specialAttributeTypeEnum.Magic,
                event.target.value
              );
            }}
            className="magic"
          >
            {talentOptions.magic.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </Fragment>
      );
      break;
    case talentCategoryEnum.Resonance:
      if (talentOptions.category !== talentCategoryEnum.Resonance) {
        throw Error("talentCategoryEnum is wrong");
      }
      if (talentAttributePoints.category !== talentCategoryEnum.Resonance) {
        throw Error("talentCategoryEnum is wrong");
      }
      frag = (
        <Fragment>
          <div className="range-info">
            {"Min/Max: " +
              props.attributeRanges.resonance.min +
              "/" +
              props.attributeRanges.resonance.max}
          </div>
          <ArwesSelect
            value={talentAttributePoints.resonance.toString()}
            onChange={(event) => {
              props.changeSpecialAttribute(
                specialAttributeTypeEnum.Resonance,
                event.target.value
              );
            }}
            className="resonance"
          >
            {talentOptions.resonance.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </Fragment>
      );
      break;
    case talentCategoryEnum.Depth:
      if (talentOptions.category !== talentCategoryEnum.Depth) {
        throw Error("talentCategoryEnum is wrong");
      }
      if (talentAttributePoints.category !== talentCategoryEnum.Depth) {
        throw Error("talentCategoryEnum is wrong");
      }
      frag = (
        <Fragment>
          <div className="range-info">
            {"Min/Max: " +
              props.attributeRanges.depth.min +
              "/" +
              props.attributeRanges.depth.max}
          </div>
          <ArwesSelect
            value={talentAttributePoints.depth.toString()}
            onChange={(event) => {
              props.changeSpecialAttribute(
                specialAttributeTypeEnum.Depth,
                event.target.value
              );
            }}
            className="depth"
          >
            {talentOptions.depth.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </Fragment>
      );
      break;
    case talentCategoryEnum.Mundane:
      frag = <p>N/A (Not Awakened)</p>;
      break;
  }

  return (
    <div className="attribute-card" id="magic_div">
      <label htmlFor="magic">Magic or Resonance</label>
      {frag}
    </div>
  );
};
