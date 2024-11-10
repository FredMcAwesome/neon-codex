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
  consumeCapacity?: boolean;

  @Property({ nullable: true })
  quantity?: number;

  @OneToMany(() => ChildGears, (gear) => gear.parentGear)
  childrenGear = new Collection<ChildGears>(this);

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    this.gear = gear;
    if (specificOption !== undefined) this.specificOption = specificOption;
    if (rating !== undefined) this.rating = rating;
    if (consumeCapacity !== undefined) this.consumeCapacity = consumeCapacity;
    if (quantity !== undefined) this.quantity = quantity;
  }
}

@Entity({ discriminatorValue: "WeaponAccessory" })
export class WeaponAccessoryIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => WeaponAccessories, ref: true })
  weaponAccessory!: Ref<WeaponAccessories>;

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
  }
}

@Entity({ discriminatorValue: "activeWeaponAccessory" })
export class ActiveWeaponAccessoryGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveWeaponAccessories, ref: true })
  activeWeaponAccessory!: Ref<ActiveWeaponAccessories>;

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
  }
}

@Entity({ discriminatorValue: "armour" })
export class ArmourIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Armours, ref: true })
  armour!: Ref<Armours>;

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
  }
}

@Entity({ discriminatorValue: "armourModification" })
export class ArmourModificationIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => ArmourModifications, ref: true })
  armourModification!: Ref<ArmourModifications>;

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
  }
}

@Entity({ discriminatorValue: "augmentation" })
export class AugmentationIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Augmentations, ref: true })
  augmentation!: Ref<Augmentations>;

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
  }
}

@Entity({ discriminatorValue: "activeAugmentation" })
export class ActiveAugmentationGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveAugmentations, ref: true })
  activeAugmentation!: Ref<ActiveAugmentations>;

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
  }
}

@Entity({ discriminatorValue: "vehicle" })
export class VehicleIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Vehicles, ref: true })
  vehicle!: Ref<Vehicles>;

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
  }
}

@Entity({ discriminatorValue: "activeVehicle" })
export class ActiveVehicleGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveVehicles, ref: true })
  activeVehicle!: Ref<ActiveVehicles>;

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
  }
}

@Entity({ discriminatorValue: "gear" })
export class GearIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Gears, ref: true })
  linkedGear!: Ref<Gears>;

  constructor(
    includedGear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(includedGear, specificOption, rating, consumeCapacity, quantity);
  }
}

@Entity({ discriminatorValue: "child" })
export class ChildGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveGears, ref: true })
  parentGear!: Ref<ActiveGears>;

  constructor(
    includedGear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(includedGear, specificOption, rating, consumeCapacity, quantity);
  }
}

@Entity({ discriminatorValue: "activeArmour" })
export class ActiveArmourIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveArmours, ref: true })
  activeArmour!: Ref<ActiveArmours>;

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
  }
}
@Entity({ discriminatorValue: "pack" })
export class PackGears extends ActiveGears {
  @ManyToOne({ entity: () => EquipmentPacks, ref: true })
  equipmentPack!: Ref<EquipmentPacks>;

  constructor(
    gear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
  }
}

@Entity({ discriminatorValue: "customisedGear" })
export class CustomisedGears extends ActiveGears {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(
    includedGear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(includedGear, specificOption, rating, consumeCapacity, quantity);
  }
}
