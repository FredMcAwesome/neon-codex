import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import type { AvailabilityType, RatingType, CostType } from "@shadowrun/common";
import {
  weaponAccessoryTypeEnum,
  firearmAccessoryMountLocationEnum,
} from "@shadowrun/common";

@Entity({
  discriminatorColumn: "type",
  discriminatorValue: weaponAccessoryTypeEnum.Standard,
})
export class WeaponAccessories {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Property()
  availability!: AvailabilityType;

  @Property({ nullable: true })
  rating?: RatingType;

  @Property()
  cost!: CostType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: weaponAccessoryTypeEnum.Firearm })
export class FirearmAccessories extends WeaponAccessories {
  @Enum({ items: () => firearmAccessoryMountLocationEnum, array: true })
  mountLocation!: firearmAccessoryMountLocationEnum[];
}
