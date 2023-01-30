import { RequiredEntityData } from "@mikro-orm/core";
import {
  augmentationAccessoryTypeEnum,
  mathOperatorEnum,
  restrictionEnum,
} from "@shadowrun/common";
import {
  AugmentationAccessories,
  ImplantWeapons,
} from "../../../../../src/models/gear/augmentationGear/augmentationAccessoryModel.js";

export const cyberlimbAccessoriesList: Array<
  RequiredEntityData<AugmentationAccessories>
> = [
  {
    type: augmentationAccessoryTypeEnum.CyberlimbAccessories,
    name: "Cyberarm gyromount",
    essence: { base: 0 },
    capacityCost: {
      base: 8,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 6000 },
    description: "",
    wireless: "",
  },
  {
    type: augmentationAccessoryTypeEnum.CyberlimbAccessories,
    name: "Cyberarm slide",
    essence: { base: 0 },
    capacityCost: {
      base: 3,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 3000 },
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.CyberlimbAccessories,
    name: "Cyber holster",
    essence: { base: 0 },
    capacityCost: {
      base: 5,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 2000 },
    description: "",
    wireless: "",
  },
  {
    type: augmentationAccessoryTypeEnum.CyberlimbAccessories,
    name: "Hydraulic jacks",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    essence: { base: 0 },
    capacityCost: {
      base: "Calculation",
      specialCalculation: ["Rating"],
    },
    availability: {
      rating: 9,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2500],
    },
    description: "",
    wireless: "",
  },
  {
    type: augmentationAccessoryTypeEnum.CyberlimbAccessories,
    name: "Large smuggling compartment",
    essence: { base: 0 },
    capacityCost: {
      base: 5,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 8000 },
    description: "",
    wireless: "",
  },
];

export const implantWeaponsList: Array<RequiredEntityData<ImplantWeapons>> = [
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Cyber Hold-out pistol",
    essence: { base: 0.1 },
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 2000 },
    weaponAttachment: false,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Cyber light pistol",
    essence: { base: 0.25 },
    capacityCost: {
      base: 4,
    },
    availability: {
      rating: 10,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 3900 },
    weaponAttachment: false,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Cyber machine pistol",
    essence: { base: 0.5 },
    capacityCost: {
      base: 6,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 3500 },
    weaponAttachment: false,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Cyber heavy pistol",
    essence: { base: 0.5 },
    capacityCost: {
      base: 6,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 4300 },
    weaponAttachment: false,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Cyber submachine gun",
    essence: { base: 1 },
    capacityCost: {
      base: 8,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 4800 },
    weaponAttachment: false,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Cyber shotgun",
    essence: { base: 1.25 },
    capacityCost: {
      base: 10,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 8500 },
    weaponAttachment: false,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Cyber microgrenade launcher",
    essence: { base: 1.5 },
    capacityCost: {
      base: 15,
    },
    availability: {
      rating: 20,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 30000 },
    weaponAttachment: false,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "External clip port",
    essence: { base: 0.1 },
    capacityCost: {
      base: 1,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 1000 },
    weaponAttachment: true,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Laser sight",
    essence: { base: 0 },
    capacityCost: {
      base: 1,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 1000 },
    weaponAttachment: true,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Silencer/suppresor",
    essence: { base: 0 },
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 1000 },
    weaponAttachment: true,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Hand blade (retractable)",
    essence: { base: 0.25 },
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 10,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 2500 },
    weaponAttachment: false,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Hand razors (retractable)",
    essence: { base: 0.2 },
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 1250 },
    weaponAttachment: false,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Spurs (retractable)",
    essence: { base: 0.3 },
    capacityCost: {
      base: 3,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 5000 },
    weaponAttachment: false,
    description: "",
  },
  {
    type: augmentationAccessoryTypeEnum.ImplantWeapons,
    name: "Shock hand",
    essence: { base: 0.25 },
    capacityCost: {
      base: 4,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 5000 },
    weaponAttachment: false,
    description: "",
  },
];
