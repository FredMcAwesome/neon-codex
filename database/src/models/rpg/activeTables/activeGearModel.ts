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
import { CustomisedAugmentations } from "./activeAugmentationModel.js";

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
  weaponAccessory: Ref<WeaponAccessories>;

  constructor(
    gear: Ref<Gears>,
    weaponAccessory: Ref<WeaponAccessories>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
    this.weaponAccessory = weaponAccessory;
  }
}

@Entity({ discriminatorValue: "activeWeaponAccessory" })
export class ActiveWeaponAccessoryGears extends ActiveGears {
  @ManyToOne({ entity: () => ActiveWeaponAccessories, ref: true })
  activeWeaponAccessory: Ref<ActiveWeaponAccessories>;

  constructor(
    gear: Ref<Gears>,
    weaponAccessory: Ref<ActiveWeaponAccessories>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
    this.activeWeaponAccessory = weaponAccessory;
  }
}

@Entity({ discriminatorValue: "armour" })
export class ArmourIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Armours, ref: true })
  armour: Ref<Armours>;

  constructor(
    gear: Ref<Gears>,
    armour: Ref<Armours>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
    this.armour = armour;
  }
}

@Entity({ discriminatorValue: "armourModification" })
export class ArmourModificationIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => ArmourModifications, ref: true })
  armourModification: Ref<ArmourModifications>;

  constructor(
    gear: Ref<Gears>,
    armourModification: Ref<ArmourModifications>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
    this.armourModification = armourModification;
  }
}

@Entity({ discriminatorValue: "augmentation" })
export class AugmentationIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Augmentations, ref: true })
  augmentation: Ref<Augmentations>;

  constructor(
    gear: Ref<Gears>,
    augmentation: Ref<Augmentations>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
    this.augmentation = augmentation;
  }
}

@Entity({ discriminatorValue: "activeAugmentation" })
export class ActiveAugmentationGears extends ActiveGears {
  @ManyToOne({ entity: () => CustomisedAugmentations, ref: true })
  activeAugmentation: Ref<CustomisedAugmentations>;

  constructor(
    gear: Ref<Gears>,
    activeAugmentation: Ref<CustomisedAugmentations>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
    this.activeAugmentation = activeAugmentation;
  }
}

@Entity({ discriminatorValue: "vehicle" })
export class VehicleIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Vehicles, ref: true })
  vehicle: Ref<Vehicles>;

  constructor(
    gear: Ref<Gears>,
    vehicle: Ref<Vehicles>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(gear, specificOption, rating, consumeCapacity, quantity);
    this.vehicle = vehicle;
  }
}

@Entity({ discriminatorValue: "gear" })
export class GearIncludedGears extends ActiveGears {
  @ManyToOne({ entity: () => Gears, ref: true })
  linkedGear: Ref<Gears>;

  constructor(
    includedGear: Ref<Gears>,
    linkedGear: Ref<Gears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(includedGear, specificOption, rating, consumeCapacity, quantity);
    this.linkedGear = linkedGear;
  }
}

@Entity({ discriminatorValue: "customisedGear" })
export class CustomisedGears extends ActiveGears {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @OneToMany(() => CustomisedGears, (gear) => gear.parentGear)
  childrenGear = new Collection<CustomisedGears>(this);

  @ManyToOne({ entity: () => CustomisedGears, ref: true, nullable: true })
  parentGear?: Ref<CustomisedGears>;

  constructor(
    includedGear: Ref<Gears>,
    parentGear?: Ref<CustomisedGears>,
    specificOption?: string,
    rating?: number,
    consumeCapacity?: boolean,
    quantity?: number
  ) {
    super(includedGear, specificOption, rating, consumeCapacity, quantity);
    if (parentGear !== undefined) {
      this.parentGear = parentGear;
    }
  }
}
