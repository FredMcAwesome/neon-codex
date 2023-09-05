import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import type {
  AvailabilityArmourType,
  CostArmourType,
} from "@shadowrun/common/build/schemas/armourSchemas.js";

@Entity()
export class Armours {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json" })
  availability!: AvailabilityArmourType;

  @Property()
  armourRating!: number;

  @Property({ type: "json" })
  cost!: CostArmourType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}
