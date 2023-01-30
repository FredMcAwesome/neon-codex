import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import type { AvailabilityType, CostType, RatingType } from "@shadowrun/common";
import { otherWareTypeEnum } from "@shadowrun/common";

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
  availability!: AvailabilityType;

  @Property({ type: "json" })
  cost!: CostType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: otherWareTypeEnum.IndustrialChemicals })
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

@Entity({ discriminatorValue: otherWareTypeEnum.SlapPatches })
export class SlapPatches extends OtherWares {}
