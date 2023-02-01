import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import type { AvailabilityType, CostType } from "@shadowrun/common";
import {
  focusTypeEnum,
  formulaTypeEnum,
  magicalGearTypeEnum,
} from "@shadowrun/common";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class MagicalEquipment {
  @PrimaryKey()
  id!: number;

  @Enum(() => magicalGearTypeEnum)
  type!: magicalGearTypeEnum;

  @Enum({
    items: [...Object.values(focusTypeEnum), ...Object.values(formulaTypeEnum)],
    nullable: true,
  })
  subtype?: focusTypeEnum | formulaTypeEnum;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json" })
  availability!: AvailabilityType;

  @Property({ type: "json" })
  cost!: CostType;

  @Property({ length: 5000 })
  description!: string;
}

@Entity({ discriminatorValue: magicalGearTypeEnum.Focus })
export class Foci extends MagicalEquipment {}

@Entity({ discriminatorValue: magicalGearTypeEnum.Formula })
export class Formulae extends MagicalEquipment {}

@Entity({ discriminatorValue: magicalGearTypeEnum.Supply })
export class MagicalSupplies extends MagicalEquipment {}
