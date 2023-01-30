import { RequiredEntityData } from "@mikro-orm/core";
import {
  mathOperatorEnum,
  otherWareTypeEnum,
  restrictionEnum,
} from "@shadowrun/common";
import {
  Biotech,
  DocWagonContract,
  GrappleGun,
  IndustrialChemicals,
  SlapPatches,
  SurvivalGear,
} from "../../../../../src/models/gear/otherGear/otherWareModel.js";

export const industrialChemicalsList: Array<
  RequiredEntityData<IndustrialChemicals>
> = [
  {
    type: otherWareTypeEnum.IndustrialChemicals,
    name: "Glue solvent",
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 90 },
    description: "",
  },
  {
    type: otherWareTypeEnum.IndustrialChemicals,
    name: "Glue sprayer",
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 150 },
    description: "",
  },
  {
    type: otherWareTypeEnum.IndustrialChemicals,
    name: "Thermite burning bar",
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 90 },
    description: "",
    wireless: "",
  },
];

export const survivalGearList: Array<RequiredEntityData<SurvivalGear>> = [
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Chemsuit",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 150],
    },
    description: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Climbing gear",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 200 },
    description: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Diving gear",
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 2000 },
    description: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Flashlight",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 25 },
    description: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Gas mask",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 200 },
    description: "",
    wireless: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Gecko tape gloves",
    availability: {
      rating: 12,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 250 },
    description: "",
    wireless: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Hazmat suit",
    availability: {
      rating: 8,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 3000 },
    description: "",
    wireless: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Light stick",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 25 },
    description: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Magnesium torch",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 5 },
    description: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Micro flare launcher",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 175 },
    description: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Micro flares",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 25 },
    description: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Rappelling gloves",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 50 },
    description: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Respirator",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 50],
    },
    description: "",
  },
  {
    type: otherWareTypeEnum.SurvivalGear,
    name: "Survival Kit",
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 200 },
    description: "",
  },
];

export const grappleGunList: Array<RequiredEntityData<GrappleGun>> = [
  {
    type: otherWareTypeEnum.GrappleGun,
    name: "Grapple gun",
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 500 },
    description: "",
    accessory: false,
  },
  {
    type: otherWareTypeEnum.GrappleGun,
    name: "Catalyst stick",
    availability: {
      rating: 8,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 120 },
    description: "",
    accessory: true,
  },
  {
    type: otherWareTypeEnum.GrappleGun,
    name: "Microwire",
    availability: {
      rating: 4,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 50 },
    lengthForCost: 100,
    description: "",
    accessory: true,
  },
  {
    type: otherWareTypeEnum.GrappleGun,
    name: "Myomeric rope",
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 500 },
    lengthForCost: 10,
    description: "",
    accessory: true,
  },
  {
    type: otherWareTypeEnum.GrappleGun,
    name: "Standard rope",
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 500 },
    lengthForCost: 100,
    description: "",
    accessory: true,
  },
  {
    type: otherWareTypeEnum.GrappleGun,
    name: "Stealth rope",
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 500 },
    lengthForCost: 100,
    description: "",
    accessory: true,
  },
];

export const biotechList: Array<RequiredEntityData<Biotech>> = [
  {
    type: otherWareTypeEnum.Biotech,
    name: "Biomonitor",
    availability: {
      rating: 3,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 300 },
    description: "",
    wireless: "",
  },
  {
    type: otherWareTypeEnum.Biotech,
    name: "Disposable syringe",
    availability: {
      rating: 3,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 10 },
    description: "",
  },
  {
    type: otherWareTypeEnum.Biotech,
    name: "Medkit",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating"],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 250],
    },
    description: "",
    wireless: "",
  },
  {
    type: otherWareTypeEnum.Biotech,
    name: "Medkit supplies",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 100 },
    description: "",
  },
];

export const docWagonContractList: Array<RequiredEntityData<DocWagonContract>> =
  [
    {
      type: otherWareTypeEnum.DocWagonContract,
      name: "Basic",
      availability: {
        rating: 0,
        restriction: restrictionEnum.Legal,
      },
      cost: { base: 5000 },
      description: "",
    },
    {
      type: otherWareTypeEnum.DocWagonContract,
      name: "Gold",
      availability: {
        rating: 0,
        restriction: restrictionEnum.Legal,
      },
      cost: { base: 25000 },
      description: "",
    },
    {
      type: otherWareTypeEnum.DocWagonContract,
      name: "Platnium",
      availability: {
        rating: 0,
        restriction: restrictionEnum.Legal,
      },
      cost: { base: 50000 },
      description: "",
    },
    {
      type: otherWareTypeEnum.DocWagonContract,
      name: "Super-platnium",
      availability: {
        rating: 0,
        restriction: restrictionEnum.Legal,
      },
      cost: { base: 100000 },
      description: "",
    },
  ];

export const slapPatchesList: Array<RequiredEntityData<SlapPatches>> = [
  {
    type: otherWareTypeEnum.SlapPatches,
    name: "Antidote patch",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating"],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 50],
    },
    description: "",
  },
  {
    type: otherWareTypeEnum.SlapPatches,
    name: "Chem patch",
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 200,
    },
    description: "",
  },
  {
    type: otherWareTypeEnum.SlapPatches,
    name: "Stim patch",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 25],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 25],
    },
    description: "",
  },
  {
    type: otherWareTypeEnum.SlapPatches,
    name: "Tranq patch",
    rating: {
      minimum: 1,
      maximum: 10,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 20],
    },
    description: "",
  },
  {
    type: otherWareTypeEnum.SlapPatches,
    name: "Trauma patch",
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 500,
    },
    description: "",
    wireless: "",
  },
];
