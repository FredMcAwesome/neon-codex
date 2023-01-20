import { RequiredEntityData } from "@mikro-orm/core";
import {
  FirearmAccessories,
  WeaponAccessories,
} from "../../../../../src/models/gear/combatGear/weaponAccessoryModel.js";
import {
  firearmAccessoryMountLocationEnum,
  mathOperatorEnum,
  restrictionEnum,
} from "@shadowrun/common";

export const firearmAccessoriesList: Array<
  RequiredEntityData<FirearmAccessories>
> = [
  {
    name: "Airburst link",
    mountLocation: [firearmAccessoryMountLocationEnum.None],
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 600,
    },
    description: "",
  },
  {
    name: "Bipod",
    mountLocation: [firearmAccessoryMountLocationEnum.Underbarrel],
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 200,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Concealable holster",
    mountLocation: [firearmAccessoryMountLocationEnum.None],
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 150,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Gas-vent system",
    mountLocation: [firearmAccessoryMountLocationEnum.Barrel],
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    rating: {
      minimum: 1,
      maximum: 3,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 200],
    },
    description: "",
  },
  {
    name: "Gyro mount",
    mountLocation: [firearmAccessoryMountLocationEnum.Underbarrel],
    availability: {
      rating: 7,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 1400,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Hidden arm slide",
    mountLocation: [firearmAccessoryMountLocationEnum.None],
    availability: {
      rating: 4,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 350,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Imaging scope",
    mountLocation: [firearmAccessoryMountLocationEnum.Top],
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 300,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Laser sight",
    mountLocation: [
      firearmAccessoryMountLocationEnum.Top,
      firearmAccessoryMountLocationEnum.Underbarrel,
    ],
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 125,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Periscope",
    mountLocation: [firearmAccessoryMountLocationEnum.Top],
    availability: {
      rating: 3,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 70,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Quick-draw holster",
    mountLocation: [firearmAccessoryMountLocationEnum.None],
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 175,
    },
    description: "",
  },
  {
    name: "Shock pad",
    mountLocation: [firearmAccessoryMountLocationEnum.None],
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 50,
    },
    description: "",
  },
  {
    name: "Silencer/suppressor",
    mountLocation: [firearmAccessoryMountLocationEnum.Barrel],
    availability: {
      rating: 9,
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: 500,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Smart firing platform",
    mountLocation: [firearmAccessoryMountLocationEnum.Underbarrel],
    availability: {
      rating: 12,
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: 2500,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Smartgun system (internal)",
    mountLocation: [firearmAccessoryMountLocationEnum.None],
    availability: {
      rating: "Calculation",
      specialCalculation: ["Weapon", mathOperatorEnum.Add, 2],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Weapon", mathOperatorEnum.Multiply, 2],
    },
    description: "",
    wireless: "",
  },
  {
    name: "Smartgun system (external)",
    mountLocation: [
      firearmAccessoryMountLocationEnum.Top,
      firearmAccessoryMountLocationEnum.Underbarrel,
    ],
    availability: {
      rating: 4,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 200,
    },
    description: "",
    wireless: "",
  },
  {
    name: "Spare clip",
    mountLocation: [firearmAccessoryMountLocationEnum.None],
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 5,
    },
    description: "",
  },
  {
    name: "Speed loader",
    mountLocation: [firearmAccessoryMountLocationEnum.None],
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 25,
    },
    description: "",
  },
  {
    name: "Tripod",
    mountLocation: [firearmAccessoryMountLocationEnum.Underbarrel],
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 500,
    },
    description: "",
    wireless: "",
  },
];

export const weaponAccessoriesList: Array<
  RequiredEntityData<WeaponAccessories>
> = [
  {
    name: "Detonator cap",
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 75,
    },
    description: "",
    wireless: "",
  },
];
