import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import type { RatingType } from "@shadowrun/common";
import { otherWareTypeEnum } from "@shadowrun/common";
import { sourceBookEnum } from "@shadowrun/common/build/enums.js";
import type {
  AvailabilityGearType,
  CostGearType,
} from "@shadowrun/common/build/schemas/otherGearSchemas.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class OtherWares {
  @PrimaryKey()
  id!: number;

  @Enum(() => otherWareTypeEnum)
  type!: otherWareTypeEnum;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json", nullable: true })
  rating?: RatingType;

  @Property({ type: "json" })
  availability!: AvailabilityGearType;

  @Property({ type: "json" })
  cost!: CostGearType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: otherWareTypeEnum.IndustrialChemical })
export class IndustrialChemicals extends OtherWares {}

@Entity({ discriminatorValue: otherWareTypeEnum.SurvivalGear })
export class SurvivalGear extends OtherWares {}

@Entity({ discriminatorValue: otherWareTypeEnum.GrappleGun })
export class GrappleGun extends OtherWares {
  @Property()
  accessory!: boolean;

  @Property({ nullable: true })
  lengthForCost?: number;
}

@Entity({ discriminatorValue: otherWareTypeEnum.Biotech })
export class Biotech extends OtherWares {}

@Entity({ discriminatorValue: otherWareTypeEnum.DocWagonContract })
export class DocWagonContract extends OtherWares {}

@Entity({ discriminatorValue: otherWareTypeEnum.SlapPatch })
export class SlapPatches extends OtherWares {}
