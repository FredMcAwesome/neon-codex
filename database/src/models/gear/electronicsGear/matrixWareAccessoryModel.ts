import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import type {
  AvailabilityType,
  CapacityType,
  CostType,
  RatingType,
} from "@shadowrun/common";
import { matrixWareAccessoryTypeEnum } from "@shadowrun/common";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class MatrixWareAccessories {
  @PrimaryKey()
  id!: number;

  @Enum(() => matrixWareAccessoryTypeEnum)
  type!: matrixWareAccessoryTypeEnum;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json", nullable: true })
  rating?: RatingType;

  @Property({ type: "json" })
  availability!: AvailabilityType;

  @Property({ type: "json" })
  cost!: CostType;
}

@Entity({ discriminatorValue: matrixWareAccessoryTypeEnum.CredStick })
export class CredSticks extends MatrixWareAccessories {
  @Property()
  maxValue!: number;
}

@Entity({ discriminatorValue: matrixWareAccessoryTypeEnum.Identification })
export class Identifications extends MatrixWareAccessories {
  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: matrixWareAccessoryTypeEnum.Tool })
export class Tools extends MatrixWareAccessories {
  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: matrixWareAccessoryTypeEnum.OpticalDevice })
export class OpticalDevices extends MatrixWareAccessories {
  @Property({ type: "json" })
  capacity!: CapacityType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: matrixWareAccessoryTypeEnum.VisionEnhancement })
export class VisionEnhancements extends MatrixWareAccessories {
  @Property({ type: "json" })
  capacity!: CapacityType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: matrixWareAccessoryTypeEnum.AudioDevice })
export class AudioDevices extends MatrixWareAccessories {
  @Property({ type: "json" })
  capacity!: CapacityType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: matrixWareAccessoryTypeEnum.AudioEnhancement })
export class AudioEnhancements extends MatrixWareAccessories {
  @Property({ type: "json" })
  capacityCost!: CostType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: matrixWareAccessoryTypeEnum.Sensor })
export class Sensors extends MatrixWareAccessories {
  @Property({ type: "json" })
  capacity!: CapacityType;
}

@Entity({ discriminatorValue: matrixWareAccessoryTypeEnum.SecurityDevice })
export class SecurityDevices extends MatrixWareAccessories {
  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({
  discriminatorValue: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
})
export class BreakingAndEnteringDevices extends MatrixWareAccessories {
  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}
