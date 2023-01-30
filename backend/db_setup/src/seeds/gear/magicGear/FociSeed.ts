import { RequiredEntityData } from "@mikro-orm/core";
import { restrictionEnum } from "@shadowrun/common";
import {
  focusTypeEnum,
  magicalGearTypeEnum,
  mathOperatorEnum,
} from "@shadowrun/common/src/enums.js";
import { Foci } from "../../../../../src/models/gear/magicGear/magicalGearEquipment.js";

export const fociList: Array<RequiredEntityData<Foci>> = [
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Enchanting,
    name: "Alchemical focus",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 5000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Enchanting,
    name: "Disenchanting focus",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 5000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Metamagic,
    name: "Centering focus",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 9000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Metamagic,
    name: "Flexible signature focus",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 9000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Metamagic,
    name: "Masking focus",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 9000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Metamagic,
    name: "Spell shaping focus",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 9000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Power,
    name: "Power foci",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 4],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 18000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Qi,
    name: "Qi foci",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Spell,
    name: "Counterspelling",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 4000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Spell,
    name: "Ritual Spellcasting",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 4000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Spell,
    name: "Spellcasting",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 4000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Spell,
    name: "Sustaining",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 4000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Spirit,
    name: "Summoning",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 4000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Spirit,
    name: "Banishing",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 4000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Spirit,
    name: "Binding",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 4000],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Focus,
    subtype: focusTypeEnum.Weapon,
    name: "Weapon Focus",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 4000],
    },
    description: "",
  },
];
