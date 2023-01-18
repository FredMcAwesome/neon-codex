import { RequiredEntityData } from "@mikro-orm/core";
import { mathOperatorEnum, restrictionEnum } from "@shadowrun/common";
import { Armours } from "../../../../src/models/gear/armourModel.js";

export const armoursList: Array<RequiredEntityData<Armours>> = [
  {
    name: "Clothing",
    armourRating: 0,
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: [20, mathOperatorEnum.RangeTo, 100000],
    },
    description: "",
  },
  {
    name: "Feedback clothing",
    armourRating: 0,
    availability: {
      rating: 8,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: [520, mathOperatorEnum.RangeTo, 100500],
    },
    description: "",
  },
  {
    name: "Leather jacket/duster",
    armourRating: 4,
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: [220, mathOperatorEnum.RangeTo, 100200],
    },
    description: "",
  },
  {
    name: "Actioneer Business Clothes",
    armourRating: 8,
    availability: {
      rating: 8,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 1500,
    },
    description: "",
  },
  {
    name: "Armour clothing",
    armourRating: 6,
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 450,
    },
    description: "",
  },
  {
    name: "Armour jacket",
    armourRating: 12,
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 1000,
    },
    description: "",
  },
  {
    name: "Armour vest",
    armourRating: 9,
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 500,
    },
    description: "",
  },
  {
    name: "Chameleon suit",
    armourRating: 9,
    availability: {
      rating: 10,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 1700,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Full body armor",
    armourRating: 15,
    availability: {
      rating: 14,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 2000,
    },
    description: "",
  },
  {
    name: "Lined coat",
    armourRating: 9,
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 900,
    },
    description: "",
  },
  {
    name: "Urban Explorer Jumpsuit",
    armourRating: 9,
    availability: {
      rating: 8,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 650,
    },
    description: "",
  },
];
