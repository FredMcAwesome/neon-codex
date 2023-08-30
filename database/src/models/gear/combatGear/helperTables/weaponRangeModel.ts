import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import type { RangeIncrementType } from "@shadowrun/common/build/schemas/weaponSchemas.js";

@Entity()
export class WeaponRanges {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
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

  constructor(dto: any) {
    this.name = dto.name;
    this.min = dto.min;
    this.short = dto.short;
    this.medium = dto.medium;
    this.long = dto.long;
    this.extreme = dto.extreme;
  }
}
