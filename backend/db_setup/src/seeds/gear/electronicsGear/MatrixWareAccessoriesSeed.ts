import { RequiredEntityData } from "@mikro-orm/core";
import {
  mathOperatorEnum,
  matrixWareAccessoryTypeEnum,
  restrictionEnum,
} from "@shadowrun/common";
import {
  AudioDevices,
  AudioEnhancements,
  BreakingAndEnteringDevices,
  CredSticks,
  Identifications,
  OpticalDevices,
  SecurityDevices,
  Sensors,
  Tools,
  VisionEnhancements,
} from "../../../../../src/models/gear/electronicsGear/matrixWareAccessoryModel.js";

export const credSticksList: Array<RequiredEntityData<CredSticks>> = [
  {
    type: matrixWareAccessoryTypeEnum.CredStick,
    name: "Standard",
    maxValue: 5000,
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 5,
    },
  },
  {
    type: matrixWareAccessoryTypeEnum.CredStick,
    name: "Silver",
    maxValue: 20000,
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 20,
    },
  },
  {
    type: matrixWareAccessoryTypeEnum.CredStick,
    name: "Gold",
    maxValue: 100000,
    availability: {
      rating: 5,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 100,
    },
  },
  {
    type: matrixWareAccessoryTypeEnum.CredStick,
    name: "Platinum",
    maxValue: 500000,
    availability: {
      rating: 10,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 500,
    },
  },
  {
    type: matrixWareAccessoryTypeEnum.CredStick,
    name: "Ebony",
    maxValue: 1000000,
    availability: {
      rating: 20,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 1000,
    },
  },
];

export const identiticationsList: Array<RequiredEntityData<Identifications>> = [
  {
    type: matrixWareAccessoryTypeEnum.Identification,
    name: "Fake SIN",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2500],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.Identification,
    name: "Fake License",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 200],
    },
    description: "",
  },
];

export const toolsList: Array<RequiredEntityData<Tools>> = [
  {
    type: matrixWareAccessoryTypeEnum.Tool,
    name: "Kit",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 500,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.Tool,
    name: "Shop",
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
    type: matrixWareAccessoryTypeEnum.Tool,
    name: "Facility",
    availability: {
      rating: 12,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 50000,
    },
    description: "",
  },
];

export const opticalDevicesList: Array<RequiredEntityData<OpticalDevices>> = [
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Binoculars, electronic",
    capacity: {
      minimum: 1,
      maximum: 3,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 50],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Binoculars, optical",
    capacity: {
      base: 0,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 50],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Camera",
    capacity: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 100],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Micro-Camera",
    capacity: {
      base: 1,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: [100],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Contacts",
    capacity: {
      minimum: 1,
      maximum: 3,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 200],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Glasses",
    capacity: {
      minimum: 1,
      maximum: 4,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 100],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Goggles",
    capacity: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 50],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Endoscope",
    capacity: {
      base: 0,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 250,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Imaging Scopes",
    capacity: {
      base: 3,
    },
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 300,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Periscope",
    capacity: {
      base: 0,
    },
    availability: {
      rating: 3,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 50,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Mage Sight Goggles",
    capacity: {
      base: 0,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 3000,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.OpticalDevice,
    name: "Monocle",
    capacity: {
      minimum: 1,
      maximum: 4,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 120],
    },
    description: "",
  },
];

export const visionEnhancementsList: Array<
  RequiredEntityData<VisionEnhancements>
> = [
  {
    type: matrixWareAccessoryTypeEnum.VisionEnhancement,
    name: "Low-light vision",
    capacity: {
      base: 1,
    },
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
    type: matrixWareAccessoryTypeEnum.VisionEnhancement,
    name: "Flare compensationn",
    capacity: {
      base: 1,
    },
    availability: {
      rating: 1,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 250,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.VisionEnhancement,
    name: "Image link",
    capacity: {
      base: 1,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 25,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.VisionEnhancement,
    name: "Smartlink",
    capacity: {
      base: 1,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 2000,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.VisionEnhancement,
    name: "Thermographic vision",
    capacity: {
      base: 1,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 500,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.VisionEnhancement,
    name: "Vision enhancement",
    capacity: {
      base: "Calculation",
      specialCalculation: ["Rating"],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 500],
    },
    description: "",
    wireless: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.VisionEnhancement,
    name: "Vision magnification",
    capacity: {
      base: 1,
    },
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 250,
    },
    description: "",
  },
];

export const audioDevicesList: Array<RequiredEntityData<AudioDevices>> = [
  {
    type: matrixWareAccessoryTypeEnum.AudioDevice,
    name: "Directional mic",
    capacity: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 50],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.AudioDevice,
    name: "Ear buds",
    capacity: {
      minimum: 1,
      maximum: 3,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 50],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.AudioDevice,
    name: "Headphones",
    capacity: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 50],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.AudioDevice,
    name: "Laser mic",
    capacity: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 100],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.AudioDevice,
    name: "Omni-directional mic",
    capacity: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 50],
    },
    description: "",
  },
];

export const audioEnhancementsList: Array<
  RequiredEntityData<AudioEnhancements>
> = [
  {
    type: matrixWareAccessoryTypeEnum.AudioEnhancement,
    name: "Audio enhancement",
    rating: {
      minimum: 1,
      maximum: 3,
    },
    capacityCost: {
      base: "Calculation",
      specialCalculation: ["Rating"],
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 550],
    },
    description: "",
    wireless: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.AudioEnhancement,
    name: "Select sound filter",
    rating: {
      minimum: 1,
      maximum: 3,
    },
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
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 250],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.AudioEnhancement,
    name: "Spatial recognizer",
    capacityCost: {
      base: 2,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 1000,
    },
    description: "",
    wireless: "",
  },
];

export const sensorsList: Array<RequiredEntityData<Sensors>> = [
  {
    type: matrixWareAccessoryTypeEnum.Sensor,
    name: "Handheld Housing",
    capacity: {
      minimum: 1,
      maximum: 3,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 100],
    },
  },
  {
    type: matrixWareAccessoryTypeEnum.Sensor,
    name: "Wall-Mounted Housing",
    capacity: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 250],
    },
  },
  {
    type: matrixWareAccessoryTypeEnum.Sensor,
    name: "Sensor Array",
    rating: {
      minimum: 2,
      maximum: 8,
    },
    capacity: {
      base: 6,
    },
    availability: {
      rating: 7,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 1000],
    },
  },
  {
    type: matrixWareAccessoryTypeEnum.Sensor,
    name: "Single Sensor",
    rating: {
      minimum: 2,
      maximum: 8,
    },
    capacity: {
      base: 1,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Capacity", mathOperatorEnum.Multiply, 100],
    },
  },
];

export const securityDevicesList: Array<RequiredEntityData<SecurityDevices>> = [
  {
    type: matrixWareAccessoryTypeEnum.SecurityDevice,
    name: "Key/combination lock",
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
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 10],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.SecurityDevice,
    name: "Maglock",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating"],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 100],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.SecurityDevice,
    name: "Keypad or card reader",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 50,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.SecurityDevice,
    name: "Anti-tamper circuits",
    rating: {
      minimum: 1,
      maximum: 4,
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
  },
  {
    type: matrixWareAccessoryTypeEnum.SecurityDevice,
    name: "Biometric reader",
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 200,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.SecurityDevice,
    name: "Metal Restraint",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 20,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.SecurityDevice,
    name: "Plasteel Restraint",
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 20,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.SecurityDevice,
    name: "Plastic Restraint (per 10)",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 5,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.SecurityDevice,
    name: "Containment manacles",
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 250,
    },
    description: "",
  },
];

export const breakingAndEnteringDevicesList: Array<
  RequiredEntityData<BreakingAndEnteringDevices>
> = [
  {
    type: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
    name: "Autopicker",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 500],
    },
    description: "",
    wireless: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
    name: "Cellular glove molder",
    rating: {
      minimum: 1,
      maximum: 4,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 500],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
    name: "Chisel/crowbar",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 20,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
    name: "Keycard copier",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 600],
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
    name: "Lockpick set",
    availability: {
      rating: 4,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 250,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
    name: "Maglock passkey",
    rating: {
      minimum: 1,
      maximum: 4,
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
    wireless: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
    name: "Miniwelder",
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 250,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
    name: "Miniwelder fuel canister",
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 80,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
    name: "Monofilament chainsaw",
    availability: {
      rating: 8,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 500,
    },
    description: "",
  },
  {
    type: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
    name: "Sequencer",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 250],
    },
    description: "",
    wireless: "",
  },
];
