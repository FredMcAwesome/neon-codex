import { MetatypeEnum, priorityOptions } from "./PriorityImports.js";
import type { IPriorities } from "./PriorityImports.js";
import { useEffect, useState } from "react";

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

interface IProps {
  priorityInfo: IPriorities;
  attributeInfo: IAttributes;
  setAttributeInfo: React.Dispatch<React.SetStateAction<IAttributes>>;
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

const AttributesSelect = function (props: IProps) {
  const metatype = props.priorityInfo.MetatypeSubselection;
  const baseAttributes = metatypeBaseAttributes[metatype];
  const [attributePoints, setAttributePoints] = useState(
    priorityOptions[props.priorityInfo.AttributesPriority].attributes
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
    for (
      let attribute = 0;
      attribute < AttributesEnum.AttributesEnumMax;
      attribute++
    ) {
      attributeArray = checkMinimums(attributeArray, baseAttributes, attribute);
      attributeArray = checkMaximums(attributeArray, baseAttributes, attribute);
    }
    return attributeArray;
  });
  const [displayAttributes, setDisplayAttributes] =
    useState<Array<number>>(attributes);

  function changeAttribute(
    attributeType: AttributesEnum,
    attributeStr: string
  ) {
    let attributeParsed = attributeStr.replace(/\D/g, "");
    if (attributeParsed.length === 0) attributeParsed = "0";
    const attributeValue = parseInt(attributeParsed);
    const difference = attributeValue - attributes[attributeType];
    incrementAttribute(attributeType, difference);
  }

  function incrementAttribute(
    attributeType: AttributesEnum,
    incrementValue: number
  ) {
    const newAttributes = [...attributes];
    if (attributePoints - incrementValue >= 0) {
      newAttributes[attributeType] += incrementValue;
      changeIfValid(newAttributes, attributeType);
    }
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
    setDisplayAttributes(newAttributes);
    setAttributePoints(newAttributePoints);
  }

  useEffect(() => {
    console.log("sfd");
  }, [attributes]);

  return (
    <div>
      <div>
        <p>Race: {MetatypeEnum[metatype]}</p>
        <p>Attribute Points Remaining: {attributePoints}</p>
      </div>
      <div>
        <p>Body - Resisting physical damage</p>
        <AttributeComponent
          baseAttributes={baseAttributes[AttributesEnum.Body]}
          displayAttributes={displayAttributes}
          incrementAttribute={incrementAttribute}
          setDisplayAttributes={setDisplayAttributes}
          changeAttribute={changeAttribute}
          attributeType={AttributesEnum.Body}
        />
      </div>
      <div>
        <p>Agility - Attack accuracy</p>
        <AttributeComponent
          baseAttributes={baseAttributes[AttributesEnum.Agility]}
          displayAttributes={displayAttributes}
          incrementAttribute={incrementAttribute}
          setDisplayAttributes={setDisplayAttributes}
          changeAttribute={changeAttribute}
          attributeType={AttributesEnum.Agility}
        />
      </div>
      <div>
        <p>Reaction - Initiative, Dodging</p>
        <AttributeComponent
          baseAttributes={baseAttributes[AttributesEnum.Reaction]}
          displayAttributes={displayAttributes}
          incrementAttribute={incrementAttribute}
          setDisplayAttributes={setDisplayAttributes}
          changeAttribute={changeAttribute}
          attributeType={AttributesEnum.Reaction}
        />
      </div>
      <div>
        <p>Strength - Melee damage</p>
        <AttributeComponent
          baseAttributes={baseAttributes[AttributesEnum.Strength]}
          displayAttributes={displayAttributes}
          incrementAttribute={incrementAttribute}
          setDisplayAttributes={setDisplayAttributes}
          changeAttribute={changeAttribute}
          attributeType={AttributesEnum.Strength}
        />
      </div>
      <div>
        <p>Willpower - Spell drain, Avoiding stun</p>
        <AttributeComponent
          baseAttributes={baseAttributes[AttributesEnum.Willpower]}
          displayAttributes={displayAttributes}
          incrementAttribute={incrementAttribute}
          setDisplayAttributes={setDisplayAttributes}
          changeAttribute={changeAttribute}
          attributeType={AttributesEnum.Willpower}
        />
      </div>
      <div>
        <p>Logic - Hermetic spell drain</p>
        <AttributeComponent
          baseAttributes={baseAttributes[AttributesEnum.Logic]}
          displayAttributes={displayAttributes}
          incrementAttribute={incrementAttribute}
          setDisplayAttributes={setDisplayAttributes}
          changeAttribute={changeAttribute}
          attributeType={AttributesEnum.Logic}
        />
      </div>
      <div>
        <p>Intuition - Initiative, Dodging</p>
        <AttributeComponent
          baseAttributes={baseAttributes[AttributesEnum.Intuition]}
          displayAttributes={displayAttributes}
          incrementAttribute={incrementAttribute}
          setDisplayAttributes={setDisplayAttributes}
          changeAttribute={changeAttribute}
          attributeType={AttributesEnum.Intuition}
        />
        <div></div>
        <p>Charisma - Shaman spell drain</p>
        <AttributeComponent
          baseAttributes={baseAttributes[AttributesEnum.Charisma]}
          displayAttributes={displayAttributes}
          incrementAttribute={incrementAttribute}
          setDisplayAttributes={setDisplayAttributes}
          changeAttribute={changeAttribute}
          attributeType={AttributesEnum.Charisma}
        />
      </div>
      <div>
        <p>Edge - Luck</p>
        <AttributeComponent
          baseAttributes={baseAttributes[AttributesEnum.Edge]}
          displayAttributes={displayAttributes}
          incrementAttribute={incrementAttribute}
          setDisplayAttributes={setDisplayAttributes}
          changeAttribute={changeAttribute}
          attributeType={AttributesEnum.Edge}
        />
        <p>Initiative - (Reaction + Intuition)</p>
        <p>
          {attributes[AttributesEnum.Reaction] +
            attributes[AttributesEnum.Intuition]}
        </p>
      </div>
    </div>
  );
};
export default AttributesSelect;

interface IAttribute {
  baseAttributes: IAttributeRange;
  displayAttributes: Array<number>;
  incrementAttribute: (
    attributeType: AttributesEnum,
    incrementValue: number
  ) => void;
  setDisplayAttributes: React.Dispatch<React.SetStateAction<Array<number>>>;
  changeAttribute: (
    attributeType: AttributesEnum,
    attributeStr: string
  ) => void;
  attributeType: AttributesEnum;
}

const AttributeComponent = ({
  baseAttributes,
  displayAttributes,
  incrementAttribute,
  setDisplayAttributes,
  changeAttribute,
  attributeType,
}: IAttribute) => {
  return (
    <div>
      <p>
        {"Min/Max: " + baseAttributes.minimum + "/" + baseAttributes.maximum}
      </p>
      <button onClick={() => incrementAttribute(attributeType, -1)}>↓</button>
      <input
        type="text"
        value={
          isNaN(displayAttributes[attributeType])
            ? ""
            : displayAttributes[attributeType]
        }
        onChange={(event) => {
          const newAttributes = [...displayAttributes];
          newAttributes[attributeType] = parseInt(
            event.target.value.replace(/\D/g, "")
          );
          setDisplayAttributes(newAttributes);
        }}
        onBlur={(event) => {
          changeAttribute(attributeType, event.target.value);
        }}
      />
      <button onClick={() => incrementAttribute(attributeType, 1)}>↑</button>
    </div>
  );
};
