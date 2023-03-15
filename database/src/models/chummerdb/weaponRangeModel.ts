import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import type { GenericCalculationType } from "@shadowrun/common/src/schemas/weaponSchemas.js";

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
  min!: GenericCalculationType;

  @Property({ type: "json" })
  short!: GenericCalculationType;

  @Property({ type: "json" })
  medium!: GenericCalculationType;

  @Property({ type: "json" })
  long!: GenericCalculationType;

  @Property({ type: "json" })
  extreme!: GenericCalculationType;
}
