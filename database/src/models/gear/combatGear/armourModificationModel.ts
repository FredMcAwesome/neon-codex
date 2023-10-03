import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import type {
  AvailabilityArmourModType,
  CostArmourModType,
} from "@shadowrun/common/build/schemas/armourModSchemas.js";

@Entity()
export class ArmourModifications {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json" })
  availability!: AvailabilityArmourModType;

  @Property()
  armourRating!: number;

  @Property({ type: "json" })
  cost!: CostArmourModType;

  @Property({ type: "json" })
  capacityCost!: CostArmourModType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}
