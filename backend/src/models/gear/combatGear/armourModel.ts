import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import type { AvailabilityType, CostType } from "@shadowrun/common";

@Entity()
export class Armours {
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
