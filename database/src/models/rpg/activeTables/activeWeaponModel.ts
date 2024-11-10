import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { CustomisedWeaponAccessories } from "./activeWeaponAccessoryModel.js";
import { Weapons } from "../equipment/combat/weaponModel.js";
import { Characters } from "../characters/characterModel.js";
import { EquipmentPacks } from "../equipment/equipmentPackModel.js";
import { ActiveVehicles } from "./activeVehicleModel.js";

// Only custom weapons not included
// This assumes weapons included in weapon mounts have no accessories
@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveWeapons {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Weapons, ref: true })
  weapon!: Ref<Weapons>;

  @OneToMany(
    () => CustomisedWeaponAccessories,
    (weaponAccessories) => weaponAccessories.activeWeapon
  )
  accessories = new Collection<CustomisedWeaponAccessories>(this);

  // rating is only used in a few weapons
  @Property({ nullable: true })
  rating?: number;

  constructor(weapon: Ref<Weapons>) {
    this.weapon = weapon;
  }
}

@Entity({ discriminatorValue: "pack" })
export class PackWeapons extends ActiveWeapons {
  @ManyToOne({ entity: () => EquipmentPacks, ref: true })
  equipmentPack!: Ref<EquipmentPacks>;

  constructor(weapon: Ref<Weapons>) {
    super(weapon);
  }
}

@Entity({ discriminatorValue: "vehicle" })
export class VehicleWeapons extends ActiveWeapons {
  @ManyToOne({ entity: () => ActiveVehicles, ref: true })
  vehicle!: Ref<ActiveVehicles>;

  constructor(weapon: Ref<Weapons>) {
    super(weapon);
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedWeapons extends ActiveWeapons {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @Property({ nullable: true })
  customName?: string;

  constructor(character: Ref<Characters>, weapon: Ref<Weapons>) {
    super(weapon);
    this.character = character;
  }
}
