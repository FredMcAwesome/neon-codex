import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import type { AvailabilityType, CostType } from "@shadowrun/common";
import { armourAccessoryTypeEnum } from "@shadowrun/common";

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
  availability!: AvailabilityType;

  @Property()
  armourRating!: number;

  @Property({ type: "json" })
  cost!: CostType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: armourAccessoryTypeEnum.Modification })
export class ArmourModifications extends ArmourAccessories {
  @Property({ type: "json" })
  capacityCost!: CostType;
}
