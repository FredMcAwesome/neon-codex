import { RequiredEntityData } from "@mikro-orm/core";
import {
  mathOperatorEnum,
  matrixWareTypeEnum,
  restrictionEnum,
} from "@shadowrun/common";
import {
  Commlinks,
  CommunicationCountermeasures,
  Cyberdecks,
  RFIDTags,
  Skillsofts,
  Softwares,
} from "../../../../../src/models/gear/electronicsGear/matrixWareModel.js";

export const commlinksList: Array<RequiredEntityData<Commlinks>> = [
  {
    type: matrixWareTypeEnum.Commlink,
    name: "Meta Link",
    rating: {
      base: 1,
    },
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 100,
    },
  },
  {
    type: matrixWareTypeEnum.Commlink,
    name: "Sony Emperor",
    rating: {
      base: 2,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 700,
    },
  },
  {
    type: matrixWareTypeEnum.Commlink,
    name: "Renraku Sensei",
    rating: {
      base: 3,
    },
    availability: {
      rating: 6,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 1000,
    },
  },
  {
    type: matrixWareTypeEnum.Commlink,
    name: "Erika Elite",
    rating: {
      base: 4,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 2500,
    },
  },
  {
    type: matrixWareTypeEnum.Commlink,
    name: "Hermes Ikon",
    rating: {
      base: 5,
    },
    availability: {
      rating: 10,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 3000,
    },
  },
  {
    type: matrixWareTypeEnum.Commlink,
    name: "Transys Avalon",
    rating: {
      base: 6,
    },
    availability: {
      rating: 12,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 5000,
    },
  },
  {
    type: matrixWareTypeEnum.Commlink,
    name: "Fairlight Caliban",
    rating: {
      base: 7,
    },
    availability: {
      rating: 14,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 8000,
    },
  },
];

export const cyberdecksList: Array<RequiredEntityData<Cyberdecks>> = [
  {
    type: matrixWareTypeEnum.Cyberdeck,
    name: "Erika MCD-1",
    rating: {
      base: 1,
    },
    attributeArray: [4, 3, 2, 1],
    programs: 1,
    availability: {
      rating: 3,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 49500,
    },
  },
  {
    type: matrixWareTypeEnum.Cyberdeck,
    name: "Microdeck Summit",
    rating: {
      base: 1,
    },
    attributeArray: [4, 3, 3, 1],
    programs: 1,
    availability: {
      rating: 3,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 58000,
    },
  },
  {
    type: matrixWareTypeEnum.Cyberdeck,
    name: "Microtrónica Azteca 200",
    rating: {
      base: 2,
    },
    attributeArray: [5, 4, 3, 2],
    programs: 2,
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 110250,
    },
  },
  {
    type: matrixWareTypeEnum.Cyberdeck,
    name: "Hermes Chariot",
    rating: {
      base: 2,
    },
    attributeArray: [5, 4, 4, 2],
    programs: 2,
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 123000,
    },
  },
  {
    type: matrixWareTypeEnum.Cyberdeck,
    name: "Novatech Navigator",
    rating: {
      base: 3,
    },
    attributeArray: [6, 5, 4, 3],
    programs: 3,
    availability: {
      rating: 9,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 205750,
    },
  },
  {
    type: matrixWareTypeEnum.Cyberdeck,
    name: "Renraku Tsurugi",
    rating: {
      base: 3,
    },
    attributeArray: [6, 5, 5, 3],
    programs: 3,
    availability: {
      rating: 9,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 214125,
    },
  },
  {
    type: matrixWareTypeEnum.Cyberdeck,
    name: "Sony CIY-720",
    rating: {
      base: 4,
    },
    attributeArray: [7, 6, 5, 4],
    programs: 4,
    availability: {
      rating: 12,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 345000,
    },
  },
  {
    type: matrixWareTypeEnum.Cyberdeck,
    name: "Shiawase Cyber-5",
    rating: {
      base: 5,
    },
    attributeArray: [8, 7, 6, 5],
    programs: 5,
    availability: {
      rating: 15,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 549375,
    },
  },
  {
    type: matrixWareTypeEnum.Cyberdeck,
    name: "Fairlight Excalibur",
    rating: {
      base: 6,
    },
    attributeArray: [8, 7, 6, 5],
    programs: 6,
    availability: {
      rating: 18,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 823250,
    },
  },
];

export const RFIDTagsList: Array<RequiredEntityData<RFIDTags>> = [
  {
    type: matrixWareTypeEnum.RFIDTag,
    name: "Standard Tags",
    rating: {
      base: 1,
    },
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 1,
    },
    description: "",
  },
  {
    type: matrixWareTypeEnum.RFIDTag,
    name: "Datachip",
    rating: {
      base: 1,
    },
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
    type: matrixWareTypeEnum.RFIDTag,
    name: "Security Tags",
    rating: {
      base: 3,
    },
    availability: {
      rating: 3,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 5,
    },
    description: "",
  },
  {
    type: matrixWareTypeEnum.RFIDTag,
    name: "Sensor Tags",
    rating: {
      base: 2,
    },
    availability: {
      rating: 5,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 40,
    },
    description: "",
    wireless: "",
  },
  {
    type: matrixWareTypeEnum.RFIDTag,
    name: "Stealth Tags",
    rating: {
      base: 3,
    },
    availability: {
      rating: 7,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 10,
    },
    description: "",
  },
];

export const communicationCountermeasuresList: Array<
  RequiredEntityData<CommunicationCountermeasures>
> = [
  {
    type: matrixWareTypeEnum.CommunicationCountermeasure,
    name: "Bug scanner",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating"],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 100],
    },
    description: "",
    wireless: "",
  },
  {
    type: matrixWareTypeEnum.CommunicationCountermeasure,
    name: "Data tap",
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 300,
    },
    description: "",
    wireless: "",
  },
  {
    type: matrixWareTypeEnum.CommunicationCountermeasure,
    name: "Headjammer",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating"],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 150],
    },
    description: "",
  },
  {
    type: matrixWareTypeEnum.CommunicationCountermeasure,
    name: "Jammer, area",
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
    wireless: "",
  },
  {
    type: matrixWareTypeEnum.CommunicationCountermeasure,
    name: "Jammer, directional",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2],
      restriction: restrictionEnum.Forbidden,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 200],
    },
    description: "",
    wireless: "",
  },
  {
    type: matrixWareTypeEnum.CommunicationCountermeasure,
    name: "Micro-transceiver",
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 100,
    },
    description: "",
    wireless: "",
  },
  {
    type: matrixWareTypeEnum.CommunicationCountermeasure,
    name: "Tag eraser",
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 450,
    },
    description: "",
    wireless: "",
  },
  {
    type: matrixWareTypeEnum.CommunicationCountermeasure,
    name: "White noise generator",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating"],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 50],
    },
    description: "",
    wireless: "",
  },
];

export const softwaresList: Array<RequiredEntityData<Softwares>> = [
  {
    type: matrixWareTypeEnum.Software,
    name: "Agent (Rating 1-3)",
    rating: {
      minimum: 1,
      maximum: 3,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 1000],
    },
  },
  {
    type: matrixWareTypeEnum.Software,
    name: "Agent (Rating 4-6)",
    rating: {
      minimum: 4,
      maximum: 6,
    },
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 3],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2000],
    },
  },
  {
    type: matrixWareTypeEnum.Software,
    name: "Autosoft",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2],
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 500],
    },
  },
  {
    type: matrixWareTypeEnum.Software,
    name: "Cyberprogram, common use",
    availability: {
      rating: 0,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 80,
    },
  },
  {
    type: matrixWareTypeEnum.Software,
    name: "Cyberprogram, hacking",
    availability: {
      rating: 6,
      restriction: restrictionEnum.Restricted,
    },
    cost: {
      base: 250,
    },
  },
  {
    type: matrixWareTypeEnum.Software,
    name: "Datasoft",
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 120,
    },
  },
  {
    type: matrixWareTypeEnum.Software,
    name: "Mapsoft",
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 100,
    },
  },
  {
    type: matrixWareTypeEnum.Software,
    name: "Shopsoft",
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: 150,
    },
  },
  {
    type: matrixWareTypeEnum.Software,
    name: "Tutorsoft (Rating 1-6)",
    availability: {
      rating: "Calculation",
      specialCalculation: ["Rating"],
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 400],
    },
  },
];

export const skillsoftList: Array<RequiredEntityData<Skillsofts>> = [
  {
    type: matrixWareTypeEnum.Skillsoft,
    name: "Activesofts (Rating 1-6)",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 8,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 5000],
    },
  },
  {
    type: matrixWareTypeEnum.Skillsoft,
    name: "Knowsofts (Rating 1-6)",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 4,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 2000],
    },
  },
  {
    type: matrixWareTypeEnum.Skillsoft,
    name: "Linguasofts (Rating 1-6)",
    rating: {
      minimum: 1,
      maximum: 6,
    },
    availability: {
      rating: 2,
      restriction: restrictionEnum.Legal,
    },
    cost: {
      base: "Calculation",
      specialCalculation: ["Rating", mathOperatorEnum.Multiply, 1000],
    },
  },
];
