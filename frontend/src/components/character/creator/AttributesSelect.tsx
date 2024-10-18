import { z as zod } from "zod";
import { Fragment, useState } from "react";
import Dropdown from "react-dropdown";
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
import type { AttributeRangeType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import type { CharacterCreatorBonusListType } from "../commonSchemas.js";

const AttributeOptionsSchema = zod
  .object({
    body: zod.array(zod.string()),
    agility: zod.array(zod.string()),
    reaction: zod.array(zod.string()),
    strength: zod.array(zod.string()),
    willpower: zod.array(zod.string()),
    logic: zod.array(zod.string()),
    intuition: zod.array(zod.string()),
    charisma: zod.array(zod.string()),
  })
  .strict();
type AttributesOptionsType = zod.infer<typeof AttributeOptionsSchema>;

const SpecialAttributeOptionsSchema = zod
  .object({
    edge: zod.array(zod.string()),
    talent: zod.discriminatedUnion("type", [
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Magic),
          magic: zod.array(zod.string()),
        })
        .strict(),
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Resonance),
          resonance: zod.array(zod.string()),
        })
        .strict(),
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Depth),
          depth: zod.array(zod.string()),
        })
        .strict(),
      zod
        .object({
          type: zod.literal(talentCategoryEnum.Mundane),
        })
        .strict(),
    ]),
  })
  .strict();
type SpecialAttributeOptionsType = zod.infer<
  typeof SpecialAttributeOptionsSchema
>;

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
      talent: { type: talentCategoryEnum.Mundane },
    };

    newOptions.edge = getAttributeOptions(attributeRanges.edge);

    switch (props.talentInfo.category) {
      case talentCategoryEnum.Magic:
        newOptions.talent = {
          type: talentCategoryEnum.Magic,
          magic: getAttributeOptions(attributeRanges.magic),
        };
        break;
      case talentCategoryEnum.Resonance:
        newOptions.talent = {
          type: talentCategoryEnum.Resonance,
          resonance: getAttributeOptions(attributeRanges.resonance),
        };
        break;
      case talentCategoryEnum.Depth:
        newOptions.talent = {
          type: talentCategoryEnum.Depth,
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
        if (newAttributes.talent.type !== talentCategoryEnum.Magic) {
          throw Error("Invalid special attribute type");
        }
        difference = newAttributes.talent.magic - attributeValue;
        newAttributes.talent.magic = attributeValue;
        break;
      case specialAttributeTypeEnum.Depth:
        if (newAttributes.talent.type !== talentCategoryEnum.Depth) {
          throw Error("Invalid special attribute type");
        }
        difference = newAttributes.talent.depth - attributeValue;
        newAttributes.talent.depth = attributeValue;
        break;
      case specialAttributeTypeEnum.Resonance:
        if (newAttributes.talent.type !== talentCategoryEnum.Resonance) {
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
      <div>
        <p>
          Heritage: <span id="heritage">{props.heritageInfo.heritage}</span>
          {props.heritageInfo.metavariant !== undefined && (
            <span id="metavariant">({props.heritageInfo.metavariant})</span>
          )}
        </p>
      </div>
      <div>
        <p>
          Attribute Points Remaining:{" "}
          <span id="attribute_points">{attributePoints}</span>
        </p>
        <p>Only one normal Attribute can be at max</p>
        <div>
          <label htmlFor="body">Body - Resisting physical damage</label>
          <div>
            {"Min/Max: " +
              attributeRanges.body.min +
              "/" +
              attributeRanges.body.max}
          </div>
          <Dropdown
            options={attributeOptions.body}
            value={props.attributeInfo.body.toString()}
            onChange={(event) => {
              changeAttribute(baseAttributeTypeEnum.Body, event.value);
            }}
            placeholder={"Select an option"}
            className="body"
          />
        </div>
        <div>
          <label htmlFor="agility">Agility - Attack accuracy</label>
          <div>
            {"Min/Max: " +
              attributeRanges.agility.min +
              "/" +
              attributeRanges.agility.max}
          </div>
          <Dropdown
            options={attributeOptions.agility}
            value={props.attributeInfo.agility.toString()}
            onChange={(event) => {
              changeAttribute(baseAttributeTypeEnum.Agility, event.value);
            }}
            placeholder={"Select an option"}
            className="agility"
          />
        </div>
        <div>
          <label htmlFor="reaction">Reaction - Initiative, Dodging</label>
          <div>
            {"Min/Max: " +
              attributeRanges.reaction.min +
              "/" +
              attributeRanges.reaction.max}
          </div>
          <Dropdown
            options={attributeOptions.reaction}
            value={props.attributeInfo.reaction.toString()}
            onChange={(event) => {
              changeAttribute(baseAttributeTypeEnum.Reaction, event.value);
            }}
            placeholder={"Select an option"}
            className="reaction"
          />
        </div>
        <div>
          <label htmlFor="strength">Strength - Melee damage</label>
          <div>
            {"Min/Max: " +
              attributeRanges.strength.min +
              "/" +
              attributeRanges.strength.max}
          </div>
          <Dropdown
            options={attributeOptions.strength}
            value={props.attributeInfo.strength.toString()}
            onChange={(event) => {
              changeAttribute(baseAttributeTypeEnum.Strength, event.value);
            }}
            placeholder={"Select an option"}
            className="strength"
          />
        </div>
        <div>
          <label htmlFor="willpower">
            Willpower - Spell drain, Avoiding stun
          </label>
          <div>
            {"Min/Max: " +
              attributeRanges.willpower.min +
              "/" +
              attributeRanges.willpower.max}
          </div>
          <Dropdown
            options={attributeOptions.willpower}
            value={props.attributeInfo.willpower.toString()}
            onChange={(event) => {
              changeAttribute(baseAttributeTypeEnum.Willpower, event.value);
            }}
            placeholder={"Select an option"}
            className="willpower"
          />
        </div>
        <div>
          <label htmlFor="logic">Logic - Hermetic spell drain</label>
          <div>
            {"Min/Max: " +
              attributeRanges.logic.min +
              "/" +
              attributeRanges.logic.max}
          </div>
          <Dropdown
            options={attributeOptions.logic}
            value={props.attributeInfo.logic.toString()}
            onChange={(event) => {
              changeAttribute(baseAttributeTypeEnum.Logic, event.value);
            }}
            placeholder={"Select an option"}
            className="logic"
          />
        </div>
        <div>
          <label htmlFor="intuition">Intuition - Initiative, Dodging</label>
          <div>
            {"Min/Max: " +
              attributeRanges.intuition.min +
              "/" +
              attributeRanges.intuition.max}
          </div>
          <Dropdown
            options={attributeOptions.intuition}
            value={props.attributeInfo.intuition.toString()}
            onChange={(event) => {
              changeAttribute(baseAttributeTypeEnum.Intuition, event.value);
            }}
            placeholder={"Select an option"}
            className="intuition"
          />
        </div>
        <div>
          <label htmlFor="charisma">Charisma - Shaman spell drain</label>
          <div>
            {"Min/Max: " +
              attributeRanges.charisma.min +
              "/" +
              attributeRanges.charisma.max}
          </div>
          <Dropdown
            options={attributeOptions.charisma}
            value={props.attributeInfo.charisma.toString()}
            onChange={(event) => {
              changeAttribute(baseAttributeTypeEnum.Charisma, event.value);
            }}
            placeholder={"Select an option"}
            className="charisma"
          />
        </div>
        <div>
          <label htmlFor="initiative">
            Initiative - (Reaction + Intuition)
          </label>
          <p id="initiative">
            {props.attributeInfo.reaction + props.attributeInfo.intuition}
          </p>
        </div>
      </div>
      <div>
        <p>
          Special Attribute Points Remaining:{" "}
          <span id="special_attribute_points">{specialAttributePoints}</span>
        </p>
        <div id="edge_div">
          <label htmlFor="edge">Edge - Luck</label>
          <div>
            {"Min/Max: " +
              attributeRanges.edge.min +
              "/" +
              attributeRanges.edge.max}
          </div>
          <Dropdown
            options={specialAttributeOptions.edge}
            value={props.specialAttributeInfo.edge.toString()}
            onChange={(event) => {
              changeSpecialAttribute(
                specialAttributeTypeEnum.Edge,
                event.value
              );
            }}
            placeholder={"Select an option"}
            className="edge"
          />
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
      if (talentOptions.type !== talentCategoryEnum.Magic) {
        throw Error("talentCategoryEnum is wrong");
      }
      if (talentAttributePoints.type !== talentCategoryEnum.Magic) {
        throw Error("talentCategoryEnum is wrong");
      }
      frag = (
        <Fragment>
          <div>
            {"Min/Max: " +
              props.attributeRanges.magic.min +
              "/" +
              props.attributeRanges.magic.max}
          </div>
          <Dropdown
            options={talentOptions.magic}
            value={talentAttributePoints.magic.toString()}
            onChange={(event) => {
              props.changeSpecialAttribute(
                specialAttributeTypeEnum.Magic,
                event.value
              );
            }}
            placeholder={"Select an option"}
            className="magic"
          />
        </Fragment>
      );
      break;
    case talentCategoryEnum.Resonance:
      if (talentOptions.type !== talentCategoryEnum.Resonance) {
        throw Error("talentCategoryEnum is wrong");
      }
      if (talentAttributePoints.type !== talentCategoryEnum.Resonance) {
        throw Error("talentCategoryEnum is wrong");
      }
      frag = (
        <Fragment>
          <div>
            {"Min/Max: " +
              props.attributeRanges.resonance.min +
              "/" +
              props.attributeRanges.resonance.max}
          </div>
          <Dropdown
            options={talentOptions.resonance}
            value={talentAttributePoints.resonance.toString()}
            onChange={(event) => {
              props.changeSpecialAttribute(
                specialAttributeTypeEnum.Resonance,
                event.value
              );
            }}
            placeholder={"Select an option"}
            className="resonance"
          />
        </Fragment>
      );
      break;
    case talentCategoryEnum.Depth:
      if (talentOptions.type !== talentCategoryEnum.Depth) {
        throw Error("talentCategoryEnum is wrong");
      }
      if (talentAttributePoints.type !== talentCategoryEnum.Depth) {
        throw Error("talentCategoryEnum is wrong");
      }
      frag = (
        <Fragment>
          <div>
            {"Min/Max: " +
              props.attributeRanges.depth.min +
              "/" +
              props.attributeRanges.depth.max}
          </div>
          <Dropdown
            options={talentOptions.depth}
            value={talentAttributePoints.depth.toString()}
            onChange={(event) => {
              props.changeSpecialAttribute(
                specialAttributeTypeEnum.Depth,
                event.value
              );
            }}
            placeholder={"Select an option"}
            className="depth"
          />
        </Fragment>
      );
      break;
    case talentCategoryEnum.Mundane:
      frag = <p>N/A (Not Awakened)</p>;
      break;
  }

  return (
    <div id="magic_div">
      <label htmlFor="magic">Magic or Resonance - </label>
      {frag}
    </div>
  );
};
