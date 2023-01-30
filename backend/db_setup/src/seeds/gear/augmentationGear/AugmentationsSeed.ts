import { RequiredEntityData } from "@mikro-orm/core";
import {
  augmentationTypeEnum,
  mathOperatorEnum,
  restrictionEnum,
} from "@shadowrun/common";
import {
  Biowares,
  Bodywares,
  Cyberlimbs,
  Earwares,
  Eyewares,
  Headwares,
} from "../../../../../src/models/gear/augmentationGear/augmentationModel.js";

export const headwaresList: Array<RequiredEntityData<Headwares>> = [
  {
    type: augmentationTypeEnum.Headware,
    name: "Commlink",
    essence: { base: 0.2 },
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 2000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Control Rig (rating 1)",
    essence: { base: 1 },
    availability: {
      rating: 5,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 43000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Control Rig (rating 2)",
    essence: { base: 2 },
    availability: {
      rating: 10,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 97000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Control Rig (rating 3)",
    essence: { base: 3 },
    availability: {
      rating: 15,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 208000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Cortex Bomb (Kink)",
    essence: { base: 0 },
    capacityCost: {
      base: 1,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 10000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Cortex Bomb (Microbomb)",
    essence: { base: 0 },
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 16,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 25000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Cortex Bomb (Area Bomb)",
    essence: { base: 0 },
    capacityCost: {
      base: 3,
    },
    availability: {
      rating: 20,
      restriction: restrictionEnum.Forbidden,
    },
    cost: { base: 40000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Cyberdeck",
    essence: { base: 0.4 },
    capacityCost: {
      base: 4,
    },
    availability: {
      rating: 5,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 5000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Datajack",
    essence: { base: 0.1 },
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 1000 },
    description: "",
    wireless: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Data Lock",
    rating: {
      minimum: 1,
      maximum: 12,
    },
    essence: { base: 0.1 },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 1000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Olfactory Booster",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    essence: { base: 0.2 },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Simrig",
    essence: { base: 0.2 },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 4000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Skilljack",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.1],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 20000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Taste Booster",
    essence: { base: 0.2 },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Tooth Compartment",
    essence: { base: 0 },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 800,
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Ultrasound Sensor",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    essence: { base: 0.25 },
    capacity: {
      base: 2,
    },
    availability: {
      rating: 10,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 12000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Headware,
    name: "Voice Modulator",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    essence: { base: 0.2 },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 5000],
    },
    description: "",
  },
];

export const eyewaresList: Array<RequiredEntityData<Eyewares>> = [
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Cybereyes (rating 1)",
    essence: { base: 0.2 },
    capacity: {
      base: 4,
    },
    availability: {
      rating: 3,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 4000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Cybereyes (rating 2)",
    essence: { base: 0.3 },
    capacity: {
      base: 8,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 6000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Cybereyes (rating 3)",
    essence: { base: 0.4 },
    capacity: {
      base: 12,
    },
    availability: {
      rating: 9,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 10000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Cybereyes (rating 4)",
    essence: { base: 0.5 },
    capacity: {
      base: 15,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 14000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Flare compensation",
    essence: { base: 0.1 },
    capacityCost: {
      base: 1,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 1000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Image link",
    essence: { base: 0.1 },
    capacityCost: {
      base: 0,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 1000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Low-light vision",
    essence: { base: 0.1 },
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 1500 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Ocular drone",
    essence: { base: 0 },
    capacityCost: {
      base: 6,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 6000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Retinal duplication",
    rating: { minimum: 1, maximum: 6 },
    essence: { base: 0.1 },
    capacityCost: {
      base: 1,
    },
    availability: {
      rating: 16,
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 20000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Smartlink",
    essence: { base: 0.2 },
    capacityCost: {
      base: 3,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 4000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Thermographic vision",
    essence: { base: 0.1 },
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 1500 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Vision enhancement",
    rating: { minimum: 1, maximum: 3 },
    essence: { base: 0.1 },
    capacityCost: {
      base: "Calculation",
      specialCalculation: ["Rating"],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Eyeware,
    name: "Vision magnification",
    essence: { base: 0.1 },
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 2000 },
    description: "",
  },
];

export const earwaresList: Array<RequiredEntityData<Earwares>> = [
  {
    type: augmentationTypeEnum.Earware,
    name: "Cyberears (rating 1)",
    essence: { base: 0.2 },
    capacity: {
      base: 4,
    },
    availability: {
      rating: 3,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 3000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Earware,
    name: "Cyberears (rating 2)",
    essence: { base: 0.3 },
    capacity: {
      base: 8,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 4500 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Earware,
    name: "Cyberears (rating 3)",
    essence: { base: 0.4 },
    capacity: {
      base: 12,
    },
    availability: {
      rating: 9,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 7500 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Earware,
    name: "Cyberears (rating 4)",
    essence: { base: 0.5 },
    capacity: {
      base: 16,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 11000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Earware,
    name: "Audio Enhancement",
    rating: { minimum: 1, maximum: 3 },
    essence: { base: 0.1 },
    capacityCost: {
      base: "Calculation",
      specialCalculation: ["Rating"],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Earware,
    name: "Balance Augmenter",
    essence: { base: 0.1 },
    capacityCost: {
      base: 4,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 8000,
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Earware,
    name: "Damper",
    essence: { base: 0.1 },
    capacityCost: {
      base: 1,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 2250,
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Earware,
    name: "Select Sound Filter",
    rating: { minimum: 1, maximum: 6 },
    essence: { base: 0.1 },
    capacityCost: {
      base: "Calculation",
      specialCalculation: ["Rating"],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3500],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Earware,
    name: "Sound Link",
    essence: { base: 0.1 },
    capacityCost: {
      base: 0,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 1000,
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Earware,
    name: "Spatial recognizer",
    rating: { minimum: 1, maximum: 3 },
    essence: { base: 0.1 },
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 4000,
    },
    description: "",
  },
];

export const bodywareList: Array<RequiredEntityData<Bodywares>> = [
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Bone Lacing (rating 1 - Plastic)",
    essence: { base: 0.5 },
    capacityCost: {
      base: 0,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 8000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Bone Lacing (rating 2 - Aluminium)",
    essence: { base: 1 },
    capacityCost: {
      base: 0,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 18000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Bone Lacing (rating 3 - Titanium)",
    essence: { base: 1.5 },
    capacityCost: {
      base: 0,
    },
    availability: {
      rating: 16,
      restriction: restrictionEnum.Restricted,
    },
    cost: { base: 30000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Dermal Plating",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.5],
    },
    capacityCost: {
      base: 0,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Fingertip Compartment",
    essence: {
      base: 0.1,
    },
    capacityCost: {
      base: 1,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 3000,
    },
    description: "",
    wireless: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Grapple Gun",
    essence: {
      base: 0.5,
    },
    capacityCost: {
      base: 4,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 5000,
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Internal Air Tank",
    rating: {
      minimum: 1,
      maximum: 3,
    },
    essence: {
      base: 0.25,
    },
    capacityCost: {
      base: 3,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating"],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4500],
    },
    description: "",
    wireless: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Muscle replacement",
    rating: {
      minimum: 1,
      maximum: 4,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating"],
    },
    capacityCost: {
      base: 0,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 5],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 25000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Reaction enhancers",
    rating: {
      minimum: 1,
      maximum: 3,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.3],
    },
    capacityCost: {
      base: 0,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 5],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 13000],
    },
    description: "",
    wireless: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Skillwires",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.1],
    },
    capacityCost: {
      base: 1,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 20000],
    },
    description: "",
    wireless: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Smuggling compartment",
    essence: {
      base: 0.2,
    },
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 7500,
    },
    description: "",
    wireless: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Wired reflexes (rating 1)",
    essence: {
      base: 2,
    },
    capacityCost: {
      base: 0,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 39000,
    },
    description: "",
    wireless: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Wired reflexes (rating 2)",
    essence: {
      base: 3,
    },
    capacityCost: {
      base: 0,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 149000,
    },
    description: "",
    wireless: "",
  },
  {
    type: augmentationTypeEnum.Bodyware,
    name: "Wired reflexes (rating 3)",
    essence: {
      base: 5,
    },
    capacityCost: {
      base: 0,
    },
    availability: {
      rating: 20,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 217000,
    },
    description: "",
    wireless: "",
  },
];

export const cyberlimbsList: Array<RequiredEntityData<Cyberlimbs>> = [
  {
    type: augmentationTypeEnum.Cyberlimbs,
    name: "Full arm",
    essence: { base: 1 },
    capacity: {
      base: 15,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 15000 },
    syntheticCapacity: { base: 8 },
    syntheticCost: { base: 20000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Cyberlimbs,
    name: "Full leg",
    essence: { base: 1 },
    capacity: {
      base: 20,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 15000 },
    syntheticCapacity: { base: 10 },
    syntheticCost: { base: 20000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Cyberlimbs,
    name: "Hand/foot",
    essence: { base: 0.25 },
    capacity: {
      base: 4,
    },
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 5000 },
    syntheticCapacity: { base: 2 },
    syntheticCost: { base: 6000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Cyberlimbs,
    name: "Lower arm",
    essence: { base: 0.45 },
    capacity: {
      base: 10,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 10000 },
    syntheticCapacity: { base: 5 },
    syntheticCost: { base: 12000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Cyberlimbs,
    name: "Lower leg",
    essence: { base: 0.45 },
    capacity: {
      base: 12,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 10000 },
    syntheticCapacity: { base: 6 },
    syntheticCost: { base: 12000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Cyberlimbs,
    name: "Torso",
    essence: { base: 1.5 },
    capacity: {
      base: 10,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 20000 },
    syntheticCapacity: { base: 12 },
    syntheticCost: { base: 25000 },
    description: "",
  },
  {
    type: augmentationTypeEnum.Cyberlimbs,
    name: "Skull",
    essence: { base: 0.75 },
    capacity: {
      base: 4,
    },
    availability: {
      rating: 16,
      restriction: restrictionEnum.Legal,
    },
    cost: { base: 10000 },
    syntheticCapacity: { base: 2 },
    syntheticCost: { base: 15000 },
    description: "",
  },
];

export const biowaresList: Array<RequiredEntityData<Biowares>> = [
  {
    type: augmentationTypeEnum.Bioware,
    name: "Adrenaline pump",
    rating: {
      minimum: 1,
      maximum: 3,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.75],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 6],
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 55000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Bone density augmentation",
    rating: {
      minimum: 1,
      maximum: 4,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.3],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4],
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 5000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Cat's eye",
    essence: {
      base: 0.1,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 4000,
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Enhanced articulation",
    essence: {
      base: 0.3,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 24000,
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Muscle augmentation",
    rating: {
      minimum: 1,
      maximum: 4,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.2],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 5],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 31000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Muscle toner",
    rating: {
      minimum: 1,
      maximum: 4,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.2],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 5],
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 32000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Orthoskin",
    rating: {
      minimum: 1,
      maximum: 4,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.25],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4],
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 6000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Pathogenic Defense",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.1],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2],
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4500],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Platelet factories",
    essence: {
      base: 0.2,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 17000,
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Skin pocket",
    essence: {
      base: 0.1,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 12000,
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Suprathyroid gland",
    essence: {
      base: 0.7,
    },
    availability: {
      rating: 20,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 140000,
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Symbiotes",
    rating: {
      minimum: 1,
      maximum: 4,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.2],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 5],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3500],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Synthacardium",
    rating: {
      minimum: 1,
      maximum: 3,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.1],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 30000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Tailored pheromones",
    rating: {
      minimum: 1,
      maximum: 3,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.2],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 31000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Toxin extractor",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.2],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4800],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.Bioware,
    name: "Tracheal filter",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.1],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 4500],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.CulturedBioware,
    name: "Cerebral booster",
    rating: {
      minimum: 1,
      maximum: 3,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.2],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 6],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 31500],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.CulturedBioware,
    name: "Damage compensators",
    rating: {
      minimum: 1,
      maximum: 12,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.1],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.CulturedBioware,
    name: "Mnemonic enhancer",
    rating: {
      minimum: 1,
      maximum: 3,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.1],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 5],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 9000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.CulturedBioware,
    name: "Pain editor",
    essence: {
      base: 0.3,
    },
    availability: {
      rating: 18,
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 48000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.CulturedBioware,
    name: "Reflex recorder",
    essence: {
      base: 0.1,
    },
    availability: {
      rating: 10,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 14000],
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.CulturedBioware,
    name: "Sleep regulator",
    essence: {
      base: 0.1,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 12000,
    },
    description: "",
  },
  {
    type: augmentationTypeEnum.CulturedBioware,
    name: "Synaptic booster",
    rating: {
      minimum: 1,
      maximum: 3,
    },
    essence: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 0.5],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 6],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 95000],
    },
    description: "",
  },
];
