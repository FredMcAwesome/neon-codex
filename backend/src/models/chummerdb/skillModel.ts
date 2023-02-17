import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import {
  attributeTypeEnum,
  skillCategoryEnum,
} from "@shadowrun/common/src/enums.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class WeaponRanges {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum(() => attributeTypeEnum)
  attribute!: attributeTypeEnum;

  @Enum()
  category!: skillCategoryEnum;

  @Property()
  default!: boolean;

  @Property()
  exotic!: boolean;

  @Property()
  skillGroup!: string;

  @Property({ type: "number[]" })
  specialisations!: Array<number>;

  @Property()
  source!: string;

  @Property()
  page!: number;
}
