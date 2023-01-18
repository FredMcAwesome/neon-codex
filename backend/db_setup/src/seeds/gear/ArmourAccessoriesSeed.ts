import { RequiredEntityData } from "@mikro-orm/core";
import { mathOperatorEnum, restrictionEnum } from "@shadowrun/common";
import {
  ArmourAccessories,
  ArmourModifications,
} from "../../../../src/models/gear/armourAccessoryModel.js";

export const armourAccessoriesList: Array<
  RequiredEntityData<ArmourAccessories>
> = [
  {
    name: "Full helmet",
    armourRating: 3,
    availability: {
      rating: 14,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 500,
    },
    description: "",
  },
  {
    name: "Helmet",
    armourRating: 2,
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 100,
    },
    description: "",
  },
  {
    name: "Ballistic shield",
    armourRating: 6,
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 1200,
    },
    description: "",
  },
  {
    name: "Riot shield",
    armourRating: 6,
    availability: {
      rating: 10,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 1500,
    },
    description: "",
    wireless: "",
  },
];

export const armourModificationsList: Array<
  RequiredEntityData<ArmourModifications>
> = [
  {
    name: "Electrochromic modification",
    armourRating: 0,
    capacityCost: { base: 0 },
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 500,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Chemical seal",
    armourRating: 0,
    capacityCost: { base: 6 },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 3000,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Environment adaptation",
    armourRating: 0,
    capacityCost: { base: 0 },
    availability: {
      rating: 17,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 1000,
    },
    description: "",
  },
  {
    name: "Chemical Protection",
    armourRating: 0,
    capacityCost: { base: "Calculation", specialCalculation: ["Rating"] },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 250],
    },
    description: "",
  },
  {
    name: "Fire Resistance",
    armourRating: 0,
    capacityCost: { base: "Calculation", specialCalculation: ["Rating"] },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 250],
    },
    description: "",
  },
  {
    name: "Insulation",
    armourRating: 0,
    capacityCost: { base: "Calculation", specialCalculation: ["Rating"] },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 250],
    },
    description: "",
  },
  {
    name: "Nonconductivity",
    armourRating: 0,
    capacityCost: { base: "Calculation", specialCalculation: ["Rating"] },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 250],
    },
    description: "",
  },
  {
    name: "Shock Frills",
    armourRating: 0,
    capacityCost: { base: 2 },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 250,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Thermal Damping",
    armourRating: 0,
    capacityCost: { base: "Calculation", specialCalculation: ["Rating"] },
    availability: {
      rating: 10,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 500],
    },
    description: "",
    wireless: "",
  },
];
