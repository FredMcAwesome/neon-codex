import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { ActiveWeaponAccessoryGears } from "./activeGearModel.js";
import { firearmAccessoryMountLocationEnum } from "@shadowrun/common/build/enums.js";
import type { AccessoryMountType } from "@shadowrun/common/build/schemas/weaponSchemas.js";
import { WeaponAccessories } from "../gear/combatGear/weaponAccessoryModel.js";
import { Weapons } from "../gear/combatGear/weaponModel.js";
import { CustomisedWeapons } from "./customisedWeaponModel.js";

// Links to either a custom weapon, or a weapon in the table.
// When we create a custom weapon that already has an accessory
// we will need to create a new accessory with the same base details.

// one link to customised weapon and one to weapon as we don't have polymorphic relationships yet
// https://github.com/mikro-orm/mikro-orm/issues/706
@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveWeaponAccessories {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => WeaponAccessories, ref: true })
  weaponAccessory: Ref<WeaponAccessories>;

  @OneToMany(
    () => ActiveWeaponAccessoryGears,
    (weaponAccessoryIncludedGear) =>
      weaponAccessoryIncludedGear.activeWeaponAccessory
  )
  includedGearList = new Collection<ActiveWeaponAccessoryGears>(this);

  @Enum({
    items: () => firearmAccessoryMountLocationEnum,
    array: true,
    nullable: true,
  })
  weaponMountsUsed?: Array<firearmAccessoryMountLocationEnum>;

  @Property({ nullable: true })
  rating?: number;

  constructor(
    weaponAccessory: Ref<WeaponAccessories>,
    rating?: number,
    weaponMountsUsed?: AccessoryMountType
  ) {
    this.weaponAccessory = weaponAccessory;
    if (rating) this.rating = rating;
    if (weaponMountsUsed) this.weaponMountsUsed = weaponMountsUsed;
  }
}

@Entity({ discriminatorValue: "included" })
export class IncludedWeaponAccessories extends ActiveWeaponAccessories {
  @ManyToOne({ entity: () => Weapons, ref: true })
  standardWeapon: Ref<Weapons>;

  constructor(
    weapon: Ref<Weapons>,
    weaponAccessory: Ref<WeaponAccessories>,
    rating?: number,
    weaponMountsUsed?: AccessoryMountType
  ) {
    super(weaponAccessory, rating, weaponMountsUsed);
    this.standardWeapon = weapon;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedWeaponAccessories extends ActiveWeaponAccessories {
  @ManyToOne({ entity: () => CustomisedWeapons, ref: true })
  customisedWeapon: Ref<CustomisedWeapons>;

  constructor(
    weapon: Ref<CustomisedWeapons>,
    weaponAccessory: Ref<WeaponAccessories>,
    rating?: number,
    weaponMountsUsed?: AccessoryMountType
  ) {
    super(weaponAccessory, rating, weaponMountsUsed);
    this.customisedWeapon = weapon;
  }
}
