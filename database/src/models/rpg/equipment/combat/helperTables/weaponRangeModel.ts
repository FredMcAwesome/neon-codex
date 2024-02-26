import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/postgresql";
import type {
  RangeIncrementType,
  RangeType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";

@Entity()
export class WeaponRanges {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Property({ type: "json" })
  min!: RangeIncrementType;

  @Property({ type: "json" })
  short!: RangeIncrementType;

  @Property({ type: "json" })
  medium!: RangeIncrementType;

  @Property({ type: "json" })
  long!: RangeIncrementType;

  @Property({ type: "json" })
  extreme!: RangeIncrementType;

  constructor(dto: RangeType) {
    this.name = dto.name;
    this.min = dto.min;
    this.short = dto.short;
    this.medium = dto.medium;
    this.long = dto.long;
    this.extreme = dto.extreme;
  }
}
