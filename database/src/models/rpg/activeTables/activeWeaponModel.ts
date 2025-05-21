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
import { PackVehicles } from "./activeVehicleModel.js";
import { ActiveWeaponMounts } from "./activeWeaponMountModel.js";

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
    (weaponAccessory) => weaponAccessory.activeWeapon
  )
  accessoryList = new Collection<CustomisedWeaponAccessories>(this);

  // rating is only used in a few weapons
  @Property({ nullable: true })
  rating?: number;

  @Property({ nullable: true })
  customName?: string;

  constructor(weapon: Ref<Weapons>) {
    this.weapon = weapon;
  }
}

@Entity({ discriminatorValue: "pack" })
export class PackWeapons extends ActiveWeapons {
  @ManyToOne({ entity: () => EquipmentPacks, ref: true })
  equipmentPack!: Ref<EquipmentPacks>;

  constructor(equipmentPack: Ref<EquipmentPacks>, weapon: Ref<Weapons>) {
    super(weapon);
    this.equipmentPack = equipmentPack;
  }
}

@Entity({ discriminatorValue: "weaponMountWeapon" })
export class WeaponMountWeapons extends ActiveWeapons {
  @ManyToOne({ entity: () => ActiveWeaponMounts, ref: true })
  weaponMount!: Ref<ActiveWeaponMounts>;

  constructor(weapon: Ref<Weapons>) {
    super(weapon);
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedWeapons extends ActiveWeapons {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(character: Ref<Characters>, weapon: Ref<Weapons>) {
    super(weapon);
    this.character = character;
  }
}
