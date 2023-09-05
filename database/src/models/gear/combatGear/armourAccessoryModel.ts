import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { armourAccessoryTypeEnum } from "@shadowrun/common";
import type {
  AvailabilityArmourAccessoryType,
  CostArmourAccessoryType,
} from "@shadowrun/common/build/schemas/armourSchemas.js";

@Entity({
  discriminatorColumn: "type",
  discriminatorValue: armourAccessoryTypeEnum.Standard,
})
export class ArmourAccessories {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json" })
  availability!: AvailabilityArmourAccessoryType;

  @Property()
  armourRating!: number;

  @Property({ type: "json" })
  cost!: CostArmourAccessoryType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: armourAccessoryTypeEnum.Modification })
export class ArmourModifications extends ArmourAccessories {
  @Property({ type: "json" })
  capacityCost!: CostArmourAccessoryType;
}
