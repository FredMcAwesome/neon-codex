import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

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
  min!: number;
}
