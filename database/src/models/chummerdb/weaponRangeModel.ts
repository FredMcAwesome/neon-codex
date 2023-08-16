import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import type { RangeIncrementType } from "@shadowrun/common/src/schemas/weaponSchemas.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class WeaponRanges {
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
}
