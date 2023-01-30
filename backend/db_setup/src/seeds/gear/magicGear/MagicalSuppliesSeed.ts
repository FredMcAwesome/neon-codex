import { RequiredEntityData } from "@mikro-orm/core";
import {
  magicalGearTypeEnum,
  mathOperatorEnum,
  restrictionEnum,
} from "@shadowrun/common";
import { MagicalSupplies } from "../../../../../src/models/gear/magicGear/magicalGearEquipment.js";

export const magicalSuppliesList: Array<RequiredEntityData<MagicalSupplies>> = [
  {
    type: magicalGearTypeEnum.Supply,
    name: "Magical Lodge Materials",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 2],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Force", mathOperatorEnum.Multiply, 500],
    },
    description: "",
  },
  {
    type: magicalGearTypeEnum.Supply,
    name: "Reagents, per dram",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 20,
    },
    description: "",
  },
];
