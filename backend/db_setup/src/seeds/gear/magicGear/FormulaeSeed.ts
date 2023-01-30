import { RequiredEntityData } from "@mikro-orm/core";
import { restrictionEnum } from "@shadowrun/common";
import {
  formulaTypeEnum,
  magicalGearTypeEnum,
} from "@shadowrun/common/src/enums.js";
import { Formulae } from "../../../../../src/models/gear/magicGear/magicalGearEquipment.js";

export const formulaeList: Array<RequiredEntityData<Formulae>> = [
  {
    type: magicalGearTypeEnum.Formula,
    subtype: formulaTypeEnum.Focus,
    name: "Focus Formula",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 0.25,
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Formula,
    subtype: formulaTypeEnum.Spell,
    name: "Combat",
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 2000,
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Formula,
    subtype: formulaTypeEnum.Spell,
    name: "Detection",
    availability: {
      rating: 4,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 500,
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Formula,
    subtype: formulaTypeEnum.Spell,
    name: "Health",
    availability: {
      rating: 4,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 500,
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Formula,
    subtype: formulaTypeEnum.Spell,
    name: "Illusion",
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 1000,
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Formula,
    subtype: formulaTypeEnum.Spell,
    name: "Manipulation",
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 1500,
    },
    description: "",
  },
];
