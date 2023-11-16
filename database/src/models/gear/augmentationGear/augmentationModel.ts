import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import { augmentationTypeEnum } from "@shadowrun/common";
import type { CapacityType, RatingType } from "@shadowrun/common";
import type {
  CostAugmentationType,
  AvailabilityAugmentationType,
  EssenceCostType,
} from "@shadowrun/common/src/schemas/augmentationSchemas.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Augmentations {
  @PrimaryKey()
  id!: number;

  @Enum(() => augmentationTypeEnum)
  type!: augmentationTypeEnum;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json", nullable: true })
  rating?: RatingType;

  @Property({ type: "json" })
  essence!: EssenceCostType;

  @Property({ type: "json", nullable: true })
  capacity?: CapacityType;

  @Property({ type: "json", nullable: true })
  capacityCost?: CostAugmentationType;

  @Property({ type: "json" })
  availability!: AvailabilityAugmentationType;

  @Property({ type: "json" })
  cost!: CostAugmentationType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: augmentationTypeEnum.Headware })
export class Headwares extends Augmentations {}

@Entity({ discriminatorValue: augmentationTypeEnum.Eyeware })
export class Eyewares extends Augmentations {}

@Entity({ discriminatorValue: augmentationTypeEnum.Earware })
export class Earwares extends Augmentations {}

@Entity({ discriminatorValue: augmentationTypeEnum.Bodyware })
export class Bodywares extends Augmentations {}

@Entity({ discriminatorValue: augmentationTypeEnum.Cyberlimbs })
export class Cyberlimbs extends Augmentations {
  @Property()
  syntheticCapacity!: CapacityType;

  @Property()
  syntheticCost!: CostAugmentationType;
}

@Entity({ discriminatorValue: augmentationTypeEnum.Bioware })
export class Biowares extends Augmentations {}

@Entity({ discriminatorValue: augmentationTypeEnum.CulturedBioware })
export class CulturedBiowares extends Augmentations {}
