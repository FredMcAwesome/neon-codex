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
import { weaponAccessoryMountLocationEnum } from "@neon-codex/common/build/enums.js";
import { WeaponAccessories } from "../equipment/combat/weaponAccessoryModel.js";
import { Weapons } from "../equipment/combat/weaponModel.js";
import { ActiveWeapons } from "./activeWeaponModel.js";
import type { AccessoryMountType } from "@neon-codex/common/build/schemas/shared/weaponSharedSchemas.js";

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
  weaponAccessory!: Ref<WeaponAccessories>;

  @OneToMany(
    () => ActiveWeaponAccessoryGears,
    (weaponAccessoryIncludedGear) =>
      weaponAccessoryIncludedGear.activeWeaponAccessory
  )
  includedGearList = new Collection<ActiveWeaponAccessoryGears>(this);

  @Enum({
    items: () => weaponAccessoryMountLocationEnum,
    array: true,
  })
  weaponMountsUsed!: Array<weaponAccessoryMountLocationEnum>;

  @Property({ nullable: true })
  rating?: number;

  constructor(
    weaponAccessory: Ref<WeaponAccessories>,
    weaponMountsUsed: AccessoryMountType,
    rating?: number
  ) {
    this.weaponAccessory = weaponAccessory;
    this.weaponMountsUsed = weaponMountsUsed;
    if (rating !== undefined) this.rating = rating;
  }
}

@Entity({ discriminatorValue: "included" })
export class IncludedWeaponAccessories extends ActiveWeaponAccessories {
  @ManyToOne({ entity: () => Weapons, ref: true })
  standardWeapon!: Ref<Weapons>;

  constructor(
    standardWeapon: Ref<Weapons>,
    weaponAccessory: Ref<WeaponAccessories>,
    weaponMountsUsed: AccessoryMountType,
    rating?: number
  ) {
    super(weaponAccessory, weaponMountsUsed, rating);
    this.standardWeapon = standardWeapon;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedWeaponAccessories extends ActiveWeaponAccessories {
  @ManyToOne({ entity: () => ActiveWeapons, ref: true })
  activeWeapon!: Ref<ActiveWeapons>;

  constructor(
    activeWeapon: Ref<ActiveWeapons>,
    weaponAccessory: Ref<WeaponAccessories>,
    weaponMountsUsed: AccessoryMountType,
    rating?: number
  ) {
    super(weaponAccessory, weaponMountsUsed, rating);
    this.activeWeapon = activeWeapon;
  }
}
