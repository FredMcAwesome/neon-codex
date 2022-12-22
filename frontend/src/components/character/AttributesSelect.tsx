import { MetatypeEnum } from "./PriorityImports.js";
import type { IPriorities } from "./PriorityImports.js";
import { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
interface IAttributeRange {
  minimum: number;
  maximum: number;
}

type IMetatypeAttributes = Array<Array<IAttributeRange>>;

const metatypeBaseAttributes: IMetatypeAttributes = [
  [
    // race: MetatypeEnum.Human,
    // body:
    {
      minimum: 1,
      maximum: 6,
    },
    // agility:
    {
      minimum: 1,
      maximum: 6,
    },
    // reaction:
    {
      minimum: 1,
      maximum: 6,
    },
    // strength:
    {
      minimum: 1,
      maximum: 6,
    },
    // willpower:
    {
      minimum: 1,
      maximum: 6,
    },
    // logic:
    {
      minimum: 1,
      maximum: 6,
    },
    // intuition:
    {
      minimum: 1,
      maximum: 6,
    },
    // charisma:
    {
      minimum: 1,
      maximum: 6,
    },
    // edge:
    {
      minimum: 2,
      maximum: 7,
    },
  ],
  [
    // race: MetatypeEnum.Elf,
    // body:
    {
      minimum: 1,
      maximum: 6,
    },
    // agility:
    {
      minimum: 2,
      maximum: 7,
    },
    // reaction:
    {
      minimum: 1,
      maximum: 6,
    },
    // strength:
    {
      minimum: 1,
      maximum: 6,
    },
    // willpower:
    {
      minimum: 1,
      maximum: 6,
    },
    // logic:
    {
      minimum: 1,
      maximum: 6,
    },
    // intuition:
    {
      minimum: 1,
      maximum: 6,
    },
    // charisma:
    {
      minimum: 3,
      maximum: 8,
    },
    // edge:
    {
      minimum: 1,
      maximum: 6,
    },
  ],
  [
    // race: MetatypeEnum.Dwarf,
    // body:
    {
      minimum: 3,
      maximum: 8,
    },
    // agility:
    {
      minimum: 1,
      maximum: 6,
    },
    // reaction:
    {
      minimum: 1,
      maximum: 5,
    },
    // strength:
    {
      minimum: 3,
      maximum: 8,
    },
    // willpower:
    {
      minimum: 2,
      maximum: 7,
    },
    // logic:
    {
      minimum: 1,
      maximum: 6,
    },
    // intuition:
    {
      minimum: 1,
      maximum: 6,
    },
    // charisma:
    {
      minimum: 1,
      maximum: 6,
    },
    // edge:
    {
      minimum: 1,
      maximum: 6,
    },
  ],
  [
    // race: MetatypeEnum.Ork,
    // body:
    {
      minimum: 4,
      maximum: 9,
    },
    // agility:
    {
      minimum: 1,
      maximum: 6,
    },
    // reaction:
    {
      minimum: 1,
      maximum: 6,
    },
    // strength:
    {
      minimum: 3,
      maximum: 8,
    },
    // willpower:
    {
      minimum: 1,
      maximum: 6,
    },
    // logic:
    {
      minimum: 1,
      maximum: 5,
    },
    // intuition:
    {
      minimum: 1,
      maximum: 6,
    },
    // charisma:
    {
      minimum: 1,
      maximum: 5,
    },
    // edge:
    {
      minimum: 1,
      maximum: 6,
    },
  ],
  [
    // race: MetatypeEnum.Troll,
    // body:
    {
      minimum: 5,
      maximum: 10,
    },
    // agility:
    {
      minimum: 1,
      maximum: 5,
    },
    // reaction:
    {
      minimum: 1,
      maximum: 6,
    },
    // strength:
    {
      minimum: 5,
      maximum: 10,
    },
    // willpower:
    {
      minimum: 1,
      maximum: 6,
    },
    // logic:
    {
      minimum: 1,
      maximum: 5,
    },
    // intuition:
    {
      minimum: 1,
      maximum: 5,
    },
    // charisma:
    {
      minimum: 1,
      maximum: 4,
    },
    // edge:
    {
      minimum: 1,
      maximum: 6,
    },
  ],
];

export interface IAttributes {
  body: number;
  agility: number;
  reaction: number;
  strength: number;
  willpower: number;
  logic: number;
  intuition: number;
  charisma: number;
  edge: number;
}

enum AttributesEnum {
  Body,
  Agility,
  Reaction,
  Strength,
  Willpower,
  Logic,
  Intuition,
  Charisma,
  Edge,
  AttributesEnumMax,
}

function checkMinimums(
  attributes: Array<number>,
  attributeRanges: Array<IAttributeRange>,
  attributeType: AttributesEnum
) {
  if (attributes[attributeType] < attributeRanges[attributeType].minimum)
    attributes[attributeType] = attributeRanges[attributeType].minimum;
  return attributes;
}

function checkMaximums(
  attributes: Array<number>,
  attributeRanges: Array<IAttributeRange>,
  attributeType: AttributesEnum
) {
  if (attributes[attributeType] > attributeRanges[attributeType].maximum)
    attributes[attributeType] = attributeRanges[attributeType].maximum;

  for (
    let otherAttributeType = 0;
    otherAttributeType < AttributesEnum.AttributesEnumMax;
    otherAttributeType++
  ) {
    if (attributeType !== otherAttributeType) {
      if (
        attributes[otherAttributeType] ===
          attributeRanges[otherAttributeType].maximum &&
        attributes[attributeType] === attributeRanges[attributeType].maximum
      ) {
        attributes[attributeType]--;
        break;
      }
    }
  }
  return attributes;
}

interface IProps {
  priorityInfo: IPriorities;
  attributeInfo: IAttributes;
  setAttributeInfo: React.Dispatch<React.SetStateAction<IAttributes>>;
  maxAttributePoints: number;
}

const AttributesSelect = function (props: IProps) {
  const metatype = props.priorityInfo.MetatypeSubselection;
  const baseAttributes = metatypeBaseAttributes[metatype];
  const [attributePoints, setAttributePoints] = useState(
    props.maxAttributePoints
  );
  const [attributes, setAttributes] = useState<Array<number>>(() => {
    let attributeArray = [
      props.attributeInfo.body,
      props.attributeInfo.agility,
      props.attributeInfo.reaction,
      props.attributeInfo.strength,
      props.attributeInfo.willpower,
      props.attributeInfo.logic,
      props.attributeInfo.intuition,
      props.attributeInfo.charisma,
      props.attributeInfo.edge,
    ];
    let tempAttributePoints = attributePoints;
    for (
      let attribute = 0;
      attribute < AttributesEnum.AttributesEnumMax;
      attribute++
    ) {
      attributeArray = checkMinimums(attributeArray, baseAttributes, attribute);
      attributeArray = checkMaximums(attributeArray, baseAttributes, attribute);
      let difference =
        attributeArray[attribute] - baseAttributes[attribute].minimum;
      if (difference <= tempAttributePoints) {
        tempAttributePoints = tempAttributePoints - difference;
      } else {
        difference = tempAttributePoints;
        attributeArray[attribute] =
          baseAttributes[attribute].minimum + difference;
        tempAttributePoints = 0;
      }
    }
    setAttributePoints(tempAttributePoints);
    return attributeArray;
  });
  const [attributeOptions, setAttributeOptions] = useState<
    Array<Array<string>>
  >(() => {
    let totalArray: Array<Array<string>> = getAttributeOptions();
    return totalArray;
  });

  function getAttributeOptions() {
    let maxAttribute: Array<boolean> = [];
    let totalArray: Array<Array<string>> = [];
    for (
      let attribute = 0;
      attribute < AttributesEnum.AttributesEnumMax;
      attribute++
    ) {
      if (attributes[attribute] === baseAttributes[attribute].maximum)
        maxAttribute.push(true);
      else maxAttribute.push(false);
    }
    const anyMax = maxAttribute.reduce(
      (anyPreviousMax, currrentMax) => anyPreviousMax || currrentMax,
      false
    );
    for (
      let attribute = 0;
      attribute < AttributesEnum.AttributesEnumMax;
      attribute++
    ) {
      let attributeArray: Array<string> = [];
      for (
        let value = baseAttributes[attribute].minimum;
        value < baseAttributes[attribute].maximum;
        value++
      ) {
        const difference = value - attributes[attribute];
        if (attributePoints - difference >= 0) {
          attributeArray.push(value.toString());
        }
      }
      if (!anyMax || maxAttribute[attribute]) {
        const difference =
          baseAttributes[attribute].maximum - attributes[attribute];
        if (attributePoints - difference >= 0) {
          attributeArray.push(baseAttributes[attribute].maximum.toString());
        }
      }
      totalArray.push(attributeArray);
    }
    return totalArray;
  }

  function changeAttribute(
    attributeType: AttributesEnum,
    attributeStr: string
  ) {
    let attributeParsed = attributeStr.replace(/\D/g, "");
    if (attributeParsed.length === 0) attributeParsed = "0";
    const attributeValue = parseInt(attributeParsed);
    const newAttributes = [...attributes];
    newAttributes[attributeType] = attributeValue;
    changeIfValid(newAttributes, attributeType);
  }

  function changeIfValid(
    newAttributes: number[],
    attributeType: AttributesEnum
  ) {
    newAttributes = checkMinimums(newAttributes, baseAttributes, attributeType);
    newAttributes = checkMaximums(newAttributes, baseAttributes, attributeType);
    const newAttributePoints =
      attributePoints -
      (newAttributes[attributeType] - attributes[attributeType]);
    setAttributes(newAttributes);
    props.setAttributeInfo({
      body: newAttributes[AttributesEnum.Body],
      agility: newAttributes[AttributesEnum.Agility],
      reaction: newAttributes[AttributesEnum.Reaction],
      strength: newAttributes[AttributesEnum.Strength],
      willpower: newAttributes[AttributesEnum.Willpower],
      logic: newAttributes[AttributesEnum.Logic],
      intuition: newAttributes[AttributesEnum.Intuition],
      charisma: newAttributes[AttributesEnum.Charisma],
      edge: newAttributes[AttributesEnum.Edge],
    });
    setAttributePoints(newAttributePoints);
  }

  useEffect(() => {
    props.setAttributeInfo({
      body: attributes[AttributesEnum.Body],
      agility: attributes[AttributesEnum.Agility],
      reaction: attributes[AttributesEnum.Reaction],
      strength: attributes[AttributesEnum.Strength],
      willpower: attributes[AttributesEnum.Willpower],
      logic: attributes[AttributesEnum.Logic],
      intuition: attributes[AttributesEnum.Intuition],
      charisma: attributes[AttributesEnum.Charisma],
      edge: attributes[AttributesEnum.Edge],
    });
  }, []);

  useEffect(() => {
    setAttributeOptions(getAttributeOptions());
  }, [attributes]);

  return (
    <div>
      <div>
        <p>
          Race: <span id="race">{MetatypeEnum[metatype]}</span>
        </p>
        <p>
          Attribute Points Remaining:{" "}
          <span id="attribute_points">{attributePoints}</span>
        </p>
      </div>
      <div>
        <label htmlFor="body">Body - Resisting physical damage</label>
        <div>
          {"Min/Max: " +
            baseAttributes[AttributesEnum.Body].minimum +
            "/" +
            baseAttributes[AttributesEnum.Body].maximum}
        </div>
        <Dropdown
          options={attributeOptions[AttributesEnum.Body]}
          value={attributes[AttributesEnum.Body].toString()}
          onChange={(event) => {
            changeAttribute(AttributesEnum.Body, event.value);
          }}
          placeholder={"Select an option"}
          className="body"
        />
      </div>
      <div>
        <label htmlFor="agility">Agility - Attack accuracy</label>
        <div>
          {"Min/Max: " +
            baseAttributes[AttributesEnum.Agility].minimum +
            "/" +
            baseAttributes[AttributesEnum.Agility].maximum}
        </div>
        <Dropdown
          options={attributeOptions[AttributesEnum.Agility]}
          value={attributes[AttributesEnum.Agility].toString()}
          onChange={(event) => {
            changeAttribute(AttributesEnum.Agility, event.value);
          }}
          placeholder={"Select an option"}
          className="agility"
        />
      </div>
      <div>
        <label htmlFor="reaction">Reaction - Initiative, Dodging</label>
        <div>
          {"Min/Max: " +
            baseAttributes[AttributesEnum.Reaction].minimum +
            "/" +
            baseAttributes[AttributesEnum.Reaction].maximum}
        </div>
        <Dropdown
          options={attributeOptions[AttributesEnum.Reaction]}
          value={attributes[AttributesEnum.Reaction].toString()}
          onChange={(event) => {
            changeAttribute(AttributesEnum.Reaction, event.value);
          }}
          placeholder={"Select an option"}
          className="reaction"
        />
      </div>
      <div>
        <label htmlFor="strength">Strength - Melee damage</label>
        <div>
          {"Min/Max: " +
            baseAttributes[AttributesEnum.Strength].minimum +
            "/" +
            baseAttributes[AttributesEnum.Strength].maximum}
        </div>
        <Dropdown
          options={attributeOptions[AttributesEnum.Strength]}
          value={attributes[AttributesEnum.Strength].toString()}
          onChange={(event) => {
            changeAttribute(AttributesEnum.Strength, event.value);
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
            baseAttributes[AttributesEnum.Willpower].minimum +
            "/" +
            baseAttributes[AttributesEnum.Willpower].maximum}
        </div>
        <Dropdown
          options={attributeOptions[AttributesEnum.Willpower]}
          value={attributes[AttributesEnum.Willpower].toString()}
          onChange={(event) => {
            changeAttribute(AttributesEnum.Willpower, event.value);
          }}
          placeholder={"Select an option"}
          className="willpower"
        />
      </div>
      <div>
        <label htmlFor="logic">Logic - Hermetic spell drain</label>
        <div>
          {"Min/Max: " +
            baseAttributes[AttributesEnum.Logic].minimum +
            "/" +
            baseAttributes[AttributesEnum.Logic].maximum}
        </div>
        <Dropdown
          options={attributeOptions[AttributesEnum.Logic]}
          value={attributes[AttributesEnum.Logic].toString()}
          onChange={(event) => {
            changeAttribute(AttributesEnum.Logic, event.value);
          }}
          placeholder={"Select an option"}
          className="logic"
        />
      </div>
      <div>
        <label htmlFor="intuition">Intuition - Initiative, Dodging</label>
        <div>
          {"Min/Max: " +
            baseAttributes[AttributesEnum.Intuition].minimum +
            "/" +
            baseAttributes[AttributesEnum.Intuition].maximum}
        </div>
        <Dropdown
          options={attributeOptions[AttributesEnum.Intuition]}
          value={attributes[AttributesEnum.Intuition].toString()}
          onChange={(event) => {
            changeAttribute(AttributesEnum.Intuition, event.value);
          }}
          placeholder={"Select an option"}
          className="intuition"
        />
        <div></div>
        <label htmlFor="charisma">Charisma - Shaman spell drain</label>
        <div>
          {"Min/Max: " +
            baseAttributes[AttributesEnum.Charisma].minimum +
            "/" +
            baseAttributes[AttributesEnum.Charisma].maximum}
        </div>
        <Dropdown
          options={attributeOptions[AttributesEnum.Charisma]}
          value={attributes[AttributesEnum.Charisma].toString()}
          onChange={(event) => {
            changeAttribute(AttributesEnum.Charisma, event.value);
          }}
          placeholder={"Select an option"}
          className="charisma"
        />
      </div>
      <div>
        <label htmlFor="edge">Edge - Luck</label>
        <div>
          {"Min/Max: " +
            baseAttributes[AttributesEnum.Edge].minimum +
            "/" +
            baseAttributes[AttributesEnum.Edge].maximum}
        </div>
        <Dropdown
          options={attributeOptions[AttributesEnum.Edge]}
          value={attributes[AttributesEnum.Edge].toString()}
          onChange={(event) => {
            changeAttribute(AttributesEnum.Edge, event.value);
          }}
          placeholder={"Select an option"}
          className="edge"
        />
        <label htmlFor="initiative">Initiative - (Reaction + Intuition)</label>
        <p id="initiative">
          {attributes[AttributesEnum.Reaction] +
            attributes[AttributesEnum.Intuition]}
        </p>
      </div>
    </div>
  );
};
export default AttributesSelect;
