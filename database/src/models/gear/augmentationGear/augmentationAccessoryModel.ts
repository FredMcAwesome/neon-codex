import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import type {
  AvailabilityType,
  CostType,
  RatingType,
  EssenceType,
} from "@shadowrun/common";
import { augmentationAccessoryTypeEnum } from "@shadowrun/common";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class AugmentationAccessories {
  @PrimaryKey()
  id!: number;

  @Enum(() => augmentationAccessoryTypeEnum)
  type!: augmentationAccessoryTypeEnum;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json", nullable: true })
  rating?: RatingType;

  @Property({ type: "json" })
  essence!: EssenceType;

  @Property({ type: "json" })
  capacityCost!: CostType;

  @Property({ type: "json" })
  availability!: AvailabilityType;

  @Property({ type: "json" })
  cost!: CostType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({
  discriminatorValue: augmentationAccessoryTypeEnum.CyberlimbAccessories,
})
export class CyberlimbAccessories extends AugmentationAccessories {}

@Entity({
  discriminatorValue: augmentationAccessoryTypeEnum.ImplantWeapons,
})
export class ImplantWeapons extends AugmentationAccessories {
  @Property()
  weaponAttachment!: boolean;
}
