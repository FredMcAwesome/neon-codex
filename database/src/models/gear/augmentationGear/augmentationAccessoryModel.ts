import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import { augmentationAccessoryTypeEnum } from "@shadowrun/common";
import type { RatingType } from "@shadowrun/common";
import type {
  CostAugmentationType,
  AvailabilityAugmentationType,
  EssenceCostType,
} from "@shadowrun/common/src/schemas/augmentationSchemas.js";

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
  essence!: EssenceCostType;

  @Property({ type: "json" })
  capacityCost!: CostAugmentationType;

  @Property({ type: "json" })
  availability!: AvailabilityAugmentationType;

  @Property({ type: "json" })
  cost!: CostAugmentationType;

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
