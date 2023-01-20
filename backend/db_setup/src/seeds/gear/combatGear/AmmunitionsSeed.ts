import { RequiredEntityData } from "@mikro-orm/core";
import {
  ammunitionTypeEnum,
  damageAnnoationEnum,
  damageCalculationMethodEnum,
  damageTypeEnum,
  mathOperatorEnum,
  restrictionEnum,
  blastTypeEnum,
} from "@shadowrun/common";
import {
  Ammos,
  Grenades,
  ProjectilesAmmos,
  RocketsMissiles,
} from "../../../../../src/models/gear/combatGear/ammunitionModel.js";

export const ammosList: Array<RequiredEntityData<Ammos>> = [
  {
    name: "Armour Piercing Discarding Sabot",
    type: ammunitionTypeEnum.Ammo,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 0,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: -4 },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 120 },
    description: "",
  },
  {
    name: "Assault cannon rounds",
    type: ammunitionTypeEnum.Ammo,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 0,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: 0 },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 400 },
    description: "",
  },
  {
    name: "Explosive rounds",
    type: ammunitionTypeEnum.Ammo,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 1,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: -1 },
    availability: {
      rating: 9,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 80 },
    description: "",
  },
  {
    name: "Flechette rounds",
    type: ammunitionTypeEnum.Ammo,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 2,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: 5 },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 65 },
    description: "",
  },
  {
    name: "Gel rounds",
    type: ammunitionTypeEnum.Ammo,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 0,
      },
      type: damageTypeEnum.Stun,
    },
    armourPenetrationModifier: { base: 1 },
    availability: {
      rating: 2,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 25 },
    description: "",
  },
  {
    name: "Hollow point rounds",
    type: ammunitionTypeEnum.Ammo,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 1,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: 2 },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 70 },
    description: "",
  },
  {
    name: "Injection darts",
    type: ammunitionTypeEnum.Ammo,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 0,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: 0 },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 75 },
    description: "",
  },
  {
    name: "Regular ammo",
    type: ammunitionTypeEnum.Ammo,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 0,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: 0 },
    availability: {
      rating: 2,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 20 },
    description: "",
  },
  {
    name: "Stick-n-Shock",
    type: ammunitionTypeEnum.Ammo,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: -2,
      },
      type: damageTypeEnum.Stun,
      annotation: damageAnnoationEnum.Electrical,
    },
    armourPenetrationModifier: { base: -5 },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 80 },
    description: "",
  },
  {
    name: "Tracer rounds",
    type: ammunitionTypeEnum.Ammo,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 0,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: 0 },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 60 },
    description: "",
  },
  {
    name: "Taser dart",
    type: ammunitionTypeEnum.Ammo,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 0,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: 0 },
    availability: {
      rating: 3,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 50 },
    description: "",
  },
];

export const projectileAmmosList: Array<RequiredEntityData<ProjectilesAmmos>> =
  [
    {
      name: "Arrow",
      type: ammunitionTypeEnum.ProjectileAmmo,
      damageModifier: {
        damageAmount: {
          calculationType: damageCalculationMethodEnum.Normal,
          base: 0,
        },
        type: damageTypeEnum.Physical,
      },
      armourPenetrationModifier: { base: 0 },
      availability: {
        rating: "Calculation",
        specialCalculation: ["Rating"],
        restriction: restrictionEnum.Legal,
      },
      cost: {
        base: "Calculation",
        specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2],
      },
      description: "",
    },
    {
      name: "Injection Arrow",
      type: ammunitionTypeEnum.ProjectileAmmo,
      damageModifier: {
        damageAmount: {
          calculationType: damageCalculationMethodEnum.Normal,
          base: 0,
        },
        type: damageTypeEnum.Physical,
      },
      armourPenetrationModifier: { base: 0 },
      availability: {
        rating: "Calculation",
        specialCalculation: ["Rating", mathOperatorEnum.Add, 2],
        restriction: restrictionEnum.Restricted,
      },
      cost: {
        base: "Calculation",
        specialCalculation: ["Rating", mathOperatorEnum.Multiply, 20],
      },
      description: "",
    },
    {
      name: "Bolt",
      type: ammunitionTypeEnum.ProjectileAmmo,
      damageModifier: {
        damageAmount: {
          calculationType: damageCalculationMethodEnum.Normal,
          base: 0,
        },
        type: damageTypeEnum.Physical,
      },
      armourPenetrationModifier: { base: 0 },
      availability: {
        rating: 2,
        restriction: restrictionEnum.Legal,
      },
      cost: { base: 5 },
      description: "",
    },
    {
      name: "Injection bolt",
      type: ammunitionTypeEnum.ProjectileAmmo,
      damageModifier: {
        damageAmount: {
          calculationType: damageCalculationMethodEnum.Normal,
          base: 0,
        },
        type: damageTypeEnum.Physical,
      },
      armourPenetrationModifier: { base: 0 },
      availability: {
        rating: 8,
        restriction: restrictionEnum.Restricted,
      },
      cost: { base: 50 },
      description: "",
    },
  ];

export const grenadesList: Array<RequiredEntityData<Grenades>> = [
  {
    name: "Flash-bang",
    type: ammunitionTypeEnum.Grenades,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 10,
      },
      type: damageTypeEnum.Stun,
    },
    armourPenetrationModifier: { base: -4 },
    blast: {
      type: blastTypeEnum.Radius,
      value: 10,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 100 },
    description: "",
  },
  {
    name: "Flash-pak",
    type: ammunitionTypeEnum.Grenades,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Special,
        base: 0,
      },
      type: damageTypeEnum.Special,
    },
    armourPenetrationModifier: { base: 0 },
    blast: {
      type: blastTypeEnum.Special,
      value: 0,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 125 },
    description: "",
    wireless: "",
  },
  {
    name: "Fragmentation grenade",
    type: ammunitionTypeEnum.Grenades,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 18,
      },
      type: damageTypeEnum.Physical,
      annotation: damageAnnoationEnum.Flechette,
    },
    armourPenetrationModifier: { base: 5 },
    blast: {
      type: blastTypeEnum.Reducing,
      value: -1,
    },
    availability: {
      rating: 11,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 100 },
    description: "",
  },
  {
    name: "High-explosive grenade",
    type: ammunitionTypeEnum.Grenades,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 16,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: -2 },
    blast: {
      type: blastTypeEnum.Reducing,
      value: -2,
    },
    availability: {
      rating: 11,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 100 },
    description: "",
  },
  {
    name: "Gas",
    type: ammunitionTypeEnum.Grenades,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Chemical,
        base: 0,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: 0 },
    blast: {
      type: blastTypeEnum.Radius,
      value: 10,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: [2, mathOperatorEnum.Add, "Chemical"],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: [40, mathOperatorEnum.Add, "Chemical"],
    },
    description: "",
  },
  {
    name: "Smoke",
    type: ammunitionTypeEnum.Grenades,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 0,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: 0 },
    blast: {
      type: blastTypeEnum.Radius,
      value: 10,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 40 },
    description: "",
  },
  {
    name: "Thermal smoke",
    type: ammunitionTypeEnum.Grenades,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 0,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: 0 },
    blast: {
      type: blastTypeEnum.Radius,
      value: 10,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 60 },
    description: "",
  },
];

export const rocketsMissilesList: Array<RequiredEntityData<RocketsMissiles>> = [
  {
    name: "Anti-vehicle rocket",
    type: ammunitionTypeEnum.RocketsMissiles,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 24,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: -10 },
    blast: {
      type: blastTypeEnum.Reducing,
      value: -4,
    },
    availability: {
      rating: 18,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 2800 },
    description: "",
  },
  {
    name: "Fragmentation rocket",
    type: ammunitionTypeEnum.RocketsMissiles,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 23,
      },
      type: damageTypeEnum.Physical,
      annotation: damageAnnoationEnum.Flechette,
    },
    armourPenetrationModifier: { base: 5 },
    blast: {
      type: blastTypeEnum.Reducing,
      value: -1,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 2000 },
    description: "",
  },
  {
    name: "High-explosive rocket",
    type: ammunitionTypeEnum.RocketsMissiles,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 21,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: -2 },
    blast: {
      type: blastTypeEnum.Reducing,
      value: -2,
    },
    availability: {
      rating: 18,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 2100 },
    description: "",
  },
  {
    name: "Anti-vehicle missile",
    type: ammunitionTypeEnum.RocketsMissiles,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 24,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: -10 },
    blast: {
      type: blastTypeEnum.Reducing,
      value: -4,
    },
    availability: {
      rating: 22,
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: [
        2800,
        mathOperatorEnum.Add,
        "Sensor",
        mathOperatorEnum.Multiply,
        500,
      ],
    },
    description: "",
  },
  {
    name: "Fragmentation missile",
    type: ammunitionTypeEnum.RocketsMissiles,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 23,
      },
      type: damageTypeEnum.Physical,
      annotation: damageAnnoationEnum.Flechette,
    },
    armourPenetrationModifier: { base: 5 },
    blast: {
      type: blastTypeEnum.Reducing,
      value: -1,
    },
    availability: {
      rating: 16,
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: [
        2000,
        mathOperatorEnum.Add,
        "Sensor",
        mathOperatorEnum.Multiply,
        500,
      ],
    },
    description: "",
  },
  {
    name: "High-explosive missile",
    type: ammunitionTypeEnum.RocketsMissiles,
    damageModifier: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 21,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetrationModifier: { base: -2 },
    blast: {
      type: blastTypeEnum.Reducing,
      value: -2,
    },
    availability: {
      rating: 22,
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: [
        2100,
        mathOperatorEnum.Add,
        "Sensor",
        mathOperatorEnum.Multiply,
        500,
      ],
    },
    description: "",
  },
];
