import {
  MetatypeEnum,
  IPriorities,
  priorityOptions,
} from "./PrioritySelect.js";

interface IAttributeRange {
  minimum: number;
  maximum: number;
}

interface IMetatypeAttributes {
  race: MetatypeEnum;
  body: IAttributeRange;
  agility: IAttributeRange;
  reaction: IAttributeRange;
  strength: IAttributeRange;
  willpower: IAttributeRange;
  logic: IAttributeRange;
  intuition: IAttributeRange;
  charisma: IAttributeRange;
  edge: IAttributeRange;
}

const metatypeBaseAttributes: IMetatypeAttributes[] = [
  {
    race: MetatypeEnum.Human,
    body: {
      minimum: 1,
      maximum: 6,
    },
    agility: {
      minimum: 1,
      maximum: 6,
    },
    reaction: {
      minimum: 1,
      maximum: 6,
    },
    strength: {
      minimum: 1,
      maximum: 6,
    },
    willpower: {
      minimum: 1,
      maximum: 6,
    },
    logic: {
      minimum: 1,
      maximum: 6,
    },
    intuition: {
      minimum: 1,
      maximum: 6,
    },
    charisma: {
      minimum: 1,
      maximum: 6,
    },
    edge: {
      minimum: 2,
      maximum: 7,
    },
  },
  {
    race: MetatypeEnum.Elf,
    body: {
      minimum: 1,
      maximum: 6,
    },
    agility: {
      minimum: 2,
      maximum: 7,
    },
    reaction: {
      minimum: 1,
      maximum: 6,
    },
    strength: {
      minimum: 1,
      maximum: 6,
    },
    willpower: {
      minimum: 1,
      maximum: 6,
    },
    logic: {
      minimum: 1,
      maximum: 6,
    },
    intuition: {
      minimum: 1,
      maximum: 6,
    },
    charisma: {
      minimum: 3,
      maximum: 8,
    },
    edge: {
      minimum: 1,
      maximum: 6,
    },
  },
  {
    race: MetatypeEnum.Dwarf,
    body: {
      minimum: 3,
      maximum: 8,
    },
    agility: {
      minimum: 1,
      maximum: 6,
    },
    reaction: {
      minimum: 1,
      maximum: 5,
    },
    strength: {
      minimum: 3,
      maximum: 8,
    },
    willpower: {
      minimum: 2,
      maximum: 7,
    },
    logic: {
      minimum: 1,
      maximum: 6,
    },
    intuition: {
      minimum: 1,
      maximum: 6,
    },
    charisma: {
      minimum: 1,
      maximum: 6,
    },
    edge: {
      minimum: 1,
      maximum: 6,
    },
  },
  {
    race: MetatypeEnum.Ork,
    body: {
      minimum: 4,
      maximum: 9,
    },
    agility: {
      minimum: 1,
      maximum: 6,
    },
    reaction: {
      minimum: 1,
      maximum: 6,
    },
    strength: {
      minimum: 3,
      maximum: 8,
    },
    willpower: {
      minimum: 1,
      maximum: 6,
    },
    logic: {
      minimum: 1,
      maximum: 5,
    },
    intuition: {
      minimum: 1,
      maximum: 6,
    },
    charisma: {
      minimum: 1,
      maximum: 5,
    },
    edge: {
      minimum: 1,
      maximum: 6,
    },
  },
  {
    race: MetatypeEnum.Troll,
    body: {
      minimum: 5,
      maximum: 10,
    },
    agility: {
      minimum: 1,
      maximum: 5,
    },
    reaction: {
      minimum: 1,
      maximum: 6,
    },
    strength: {
      minimum: 5,
      maximum: 10,
    },
    willpower: {
      minimum: 1,
      maximum: 6,
    },
    logic: {
      minimum: 1,
      maximum: 5,
    },
    intuition: {
      minimum: 1,
      maximum: 5,
    },
    charisma: {
      minimum: 1,
      maximum: 4,
    },
    edge: {
      minimum: 1,
      maximum: 6,
    },
  },
];

interface IProps {
  priorityInfo: IPriorities;
}

const Attributes = function (props: IProps) {
  const baseAttributes =
    metatypeBaseAttributes[props.priorityInfo.MetatypeSubselection];
  const attributePoints =
    priorityOptions[props.priorityInfo.AttributesPriority].attributes;

  return (
    <div>
      <p>Race: {MetatypeEnum[baseAttributes.race]}</p>
      <p>Attribute Points Remaining: {attributePoints}</p>
      <p>Body - Resisting physical damage</p>
      <p>{baseAttributes.body.minimum + "/" + baseAttributes.body.maximum}</p>
      <p>Agility - Attack accuracy</p>
      <p>
        {baseAttributes.agility.minimum + "/" + baseAttributes.agility.maximum}
      </p>
      <p>Reaction - Initiative, Dodging</p>
      <p>
        {baseAttributes.reaction.minimum +
          "/" +
          baseAttributes.reaction.maximum}
      </p>
      <p>Strength - Melee damage</p>
      <p>
        {baseAttributes.strength.minimum +
          "/" +
          baseAttributes.strength.maximum}
      </p>
      <p>Willpower - Spell drain, Avoiding stun</p>
      <p>
        {baseAttributes.willpower.minimum +
          "/" +
          baseAttributes.willpower.maximum}
      </p>
      <p>Logic - Hermetic spell drain</p>
      <p>{baseAttributes.logic.minimum + "/" + baseAttributes.logic.maximum}</p>
      <p>Intuition - Initiative, Dodging</p>
      <p>
        {baseAttributes.intuition.minimum +
          "/" +
          baseAttributes.intuition.maximum}
      </p>
      <p>Charisma - Shaman spell drain</p>
      <p>
        {baseAttributes.charisma.minimum +
          "/" +
          baseAttributes.charisma.maximum}
      </p>
      <p>Edge - Luck</p>
      <p>{baseAttributes.edge.minimum + "/" + baseAttributes.edge.maximum}</p>
    </div>
  );
};
export default Attributes;
