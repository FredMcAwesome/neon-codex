import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { ActiveWeaponAccessories } from "./activeWeaponAccessoryModel.js";
import { Augmentations } from "../equipment/bodyModification/augmentationModel.js";
import { Armours } from "../equipment/combat/armourModel.js";
import { ArmourModifications } from "../equipment/combat/armourModificationModel.js";
import { WeaponAccessories } from "../equipment/combat/weaponAccessoryModel.js";
import { Gears } from "../equipment/other/gearModel.js";
import { Vehicles } from "../equipment/rigger/vehicleModel.js";
import { Characters } from "../characters/characterModel.js";
import { ActiveAugmentations } from "./activeAugmentationModel.js";
import { EquipmentPacks } from "../equipment/equipmentPackModel.js";
import { ActiveArmours } from "./activeArmourModel.js";
import { ActiveVehicles } from "./activeVehicleModel.js";
import { ActiveArmourModifications } from "./activeArmourModificationModel.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveGears {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Gears, ref: true })
  gear!: Ref<Gears>;

  @Property({ nullable: true })
  specificOption?: string;

  @Property({ nullable: true })
  rating?: number;

  @Property({ nullable: true })
  consumeCapacity?: true;

  @Property({ nullable: true })
  currentQuantity?: number;

  @OneToMany(() => ChildGears, (gear) => gear.parentActiveGear)
  childrenGear = new Collection<ChildGears>(this);

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    this.gear = gear;
    if (specificOption !== undefined) this.specificOption = specificOption;
    if (rating !== undefined) this.rating = rating;
    if (consumeCapacity !== undefined) this.consumeCapacity = consumeCapacity;
    if (currentQuantity !== undefined) this.currentQuantity = currentQuantity;
  }
}

@Entity({ discriminatorValue: "WeaponAccessory" })
export class WeaponAccessoryIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => WeaponAccessories, ref: true })
  weaponAccessory!: Ref<WeaponAccessories>;

  constructor(
    weaponAccessory: Ref<WeaponAccessories>,
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, currentQuantity);
    this.weaponAccessory = weaponAccessory;
  }
}

@Entity({ discriminatorValue: "activeWeaponAccessory" })
export class ActiveWeaponAccessoryGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveWeaponAccessories, ref: true })
  activeWeaponAccessory!: Ref<ActiveWeaponAccessories>;

  constructor(
    activeWeaponAccessory: Ref<ActiveWeaponAccessories>,
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, currentQuantity);
    this.activeWeaponAccessory = activeWeaponAccessory;
  }
}

@Entity({ discriminatorValue: "armour" })
export class ArmourIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Armours, ref: true })
  armour!: Ref<Armours>;

  constructor(
    armour: Ref<Armours>,
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, currentQuantity);
    this.armour = armour;
  }
}

@Entity({ discriminatorValue: "armourModification" })
export class ArmourModificationIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => ArmourModifications, ref: true })
  armourModification!: Ref<ArmourModifications>;

  constructor(
    armourModification: Ref<ArmourModifications>,
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, currentQuantity);
    this.armourModification = armourModification;
  }
}

@Entity({ discriminatorValue: "augmentation" })
export class AugmentationIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Augmentations, ref: true })
  augmentation!: Ref<Augmentations>;

  constructor(
    augmentation: Ref<Augmentations>,
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, currentQuantity);
    this.augmentation = augmentation;
  }
}

@Entity({ discriminatorValue: "activeAugmentation" })
export class ActiveAugmentationGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveAugmentations, ref: true })
  activeAugmentation!: Ref<ActiveAugmentations>;

  constructor(
    activeAugmentation: Ref<ActiveAugmentations>,
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, currentQuantity);
    this.activeAugmentation = activeAugmentation;
  }
}

@Entity({ discriminatorValue: "vehicle" })
export class VehicleIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Vehicles, ref: true })
  vehicle!: Ref<Vehicles>;

  constructor(
    vehicle: Ref<Vehicles>,
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, currentQuantity);
    this.vehicle = vehicle;
  }
}

@Entity({ discriminatorValue: "activeVehicle" })
export class ActiveVehicleGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveVehicles, ref: true })
  activeVehicle!: Ref<ActiveVehicles>;

  constructor(
    activeVehicle: Ref<ActiveVehicles>,
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, currentQuantity);
    this.activeVehicle = activeVehicle;
  }
}

@Entity({ discriminatorValue: "gear" })
export class GearIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Gears, ref: true })
  parentGear!: Ref<Gears>;

  constructor(
    parentGear: Ref<Gears>,
    includedGear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(
      includedGear,
      specificOption,
      rating,
      consumeCapacity,
      currentQuantity
    );
    this.parentGear = parentGear;
  }
}

@Entity({ discriminatorValue: "child" })
export class ChildGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveGears, ref: true })
  parentActiveGear!: Ref<ActiveGears>;

  constructor(
    parentActiveGear: Ref<ActiveGears>,
    includedGear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(
      includedGear,
      specificOption,
      rating,
      consumeCapacity,
      currentQuantity
    );
    this.parentActiveGear = parentActiveGear;
  }
}

@Entity({ discriminatorValue: "activeArmour" })
export class ActiveArmourIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveArmours, ref: true })
  activeArmour!: Ref<ActiveArmours>;

  constructor(
    activeArmour: Ref<ActiveArmours>,
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, currentQuantity);
    this.activeArmour = activeArmour;
  }
}

@Entity({ discriminatorValue: "activeArmourModification" })
export class ActiveArmourModificationIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveArmourModifications, ref: true })
  activeArmourModification!: Ref<ActiveArmourModifications>;

  constructor(
    activeArmourModification: Ref<ActiveArmourModifications>,
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, currentQuantity);
    this.activeArmourModification = activeArmourModification;
  }
}

@Entity({ discriminatorValue: "pack" })
export class PackGears extends ActiveGears {
  @ManyToOne({ entity: () => EquipmentPacks, ref: true })
  equipmentPack!: Ref<EquipmentPacks>;

  constructor(
    equipmentPack: Ref<EquipmentPacks>,
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, currentQuantity);
    this.equipmentPack = equipmentPack;
  }
}

@Entity({ discriminatorValue: "customisedGear" })
export class CustomisedGears extends ActiveGears {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(
    character: Ref<Characters>,
    includedGear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: true,
    currentQuantity?: number
  ) {
    super(
      includedGear,
      specificOption,
      rating,
      consumeCapacity,
      currentQuantity
    );
    this.character = character;
  }
}
