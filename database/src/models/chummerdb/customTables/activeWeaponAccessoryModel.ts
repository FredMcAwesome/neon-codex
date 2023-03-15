import { Entity, ManyToOne, PrimaryKey, Property, ref } from "@mikro-orm/core";
import type { Ref } from "@mikro-orm/core";
import { WeaponAccessories } from "../../gear/combatGear/weaponAccessoryModel.js";
import { Weapons } from "../../models.js";
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

  @Property({ nullable: true })
  rating?: number;

  constructor(weaponAccessory: WeaponAccessories, rating: number | undefined) {
    this.weaponAccessory = ref(WeaponAccessories, weaponAccessory);
    if (rating) this.rating = rating;
  }
}

@Entity({ discriminatorValue: "included" })
export class IncludedWeaponAccessories extends ActiveWeaponAccessories {
  @ManyToOne({ entity: () => Weapons, ref: true })
  standardWeapon: Ref<Weapons>;

  constructor(
    weapon: Weapons,
    weaponAccessory: WeaponAccessories,
    rating: number | undefined
  ) {
    super(weaponAccessory, rating);
    this.standardWeapon = ref(Weapons, weapon);
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedWeaponAccessories extends ActiveWeaponAccessories {
  @ManyToOne({ entity: () => CustomisedWeapons, ref: true })
  customisedWeapon: Ref<CustomisedWeapons>;

  constructor(
    weapon: CustomisedWeapons,
    weaponAccessory: WeaponAccessories,
    rating: number | undefined
  ) {
    super(weaponAccessory, rating);
    this.customisedWeapon = ref(CustomisedWeapons, weapon);
  }
}
