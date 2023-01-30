import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import type {
  AvailabilityType,
  CostType,
  CyberdeckAttributeArrayType,
  RatingType,
} from "@shadowrun/common";
import { matrixWareTypeEnum } from "@shadowrun/common";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class MatrixWares {
  @PrimaryKey()
  id!: number;

  @Enum(() => matrixWareTypeEnum)
  type!: matrixWareTypeEnum;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json", nullable: true })
  rating?: RatingType;

  @Property({ type: "json" })
  availability!: AvailabilityType;

  @Property({ type: "json" })
  cost!: CostType;
}

@Entity({ discriminatorValue: matrixWareTypeEnum.Commlink })
export class Commlinks extends MatrixWares {}

@Entity({ discriminatorValue: matrixWareTypeEnum.Cyberdeck })
export class Cyberdecks extends MatrixWares {
  @Property({ type: "number[]" })
  attributeArray!: CyberdeckAttributeArrayType;

  @Property()
  programs!: number;
}

@Entity({ discriminatorValue: matrixWareTypeEnum.RFIDTag })
export class RFIDTags extends MatrixWares {
  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: matrixWareTypeEnum.CommunicationCountermeasure })
export class CommunicationCountermeasures extends MatrixWares {
  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: matrixWareTypeEnum.Software })
export class Softwares extends MatrixWares {}

@Entity({ discriminatorValue: matrixWareTypeEnum.Skillsoft })
export class Skillsofts extends MatrixWares {}
