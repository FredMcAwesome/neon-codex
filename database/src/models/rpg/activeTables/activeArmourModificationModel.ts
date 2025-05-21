import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { CustomisedArmours, PackArmours } from "./activeArmourModel.js";
import { Armours } from "../equipment/combat/armourModel.js";
import { ArmourModifications } from "../equipment/combat/armourModificationModel.js";
import {
  ActiveArmourModificationIncludedGears,
  ArmourModificationIncludedGears,
} from "./activeGearModel.js";

// Links to either a custom armour, or a armour in the table.
// When we create a custom armour that already has a modification
// we will need to create a new accessory with the same base details.

// one link to customised armour and one to armour as we don't have polymorphic relationships yet
// https://github.com/mikro-orm/mikro-orm/issues/706
@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveArmourModifications {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => ArmourModifications, ref: true })
  armourModification!: Ref<ArmourModifications>;

  @OneToMany(
    () => ActiveArmourModificationIncludedGears,
    (activeArmourModIncludedGear) =>
      activeArmourModIncludedGear.activeArmourModification
  )
  includedGearList = new Collection<ActiveArmourModificationIncludedGears>(
    this
  );

  @Property({ nullable: true })
  rating?: number;

  constructor(armourModification: Ref<ArmourModifications>, rating?: number) {
    this.armourModification = armourModification;
    if (rating) this.rating = rating;
  }
}

@Entity({ discriminatorValue: "included" })
export class IncludedArmourModifications extends ActiveArmourModifications {
  @ManyToOne({ entity: () => Armours, ref: true })
  standardArmour!: Ref<Armours>;

  constructor(
    standardArmour: Ref<Armours>,
    armourModification: Ref<ArmourModifications>,
    rating?: number
  ) {
    super(armourModification, rating);
    this.standardArmour = standardArmour;
  }
}

@Entity({ discriminatorValue: "pack" })
export class PackArmourModifications extends ActiveArmourModifications {
  @ManyToOne({ entity: () => PackArmours, ref: true })
  packArmour!: Ref<PackArmours>;

  constructor(
    packArmour: Ref<PackArmours>,
    armourModification: Ref<ArmourModifications>,
    rating?: number
  ) {
    super(armourModification, rating);
    this.packArmour = packArmour;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedArmourModifications extends ActiveArmourModifications {
  @ManyToOne({ entity: () => CustomisedArmours, ref: true })
  customisedArmour!: Ref<CustomisedArmours>;

  constructor(
    customisedArmour: Ref<CustomisedArmours>,
    armourModification: Ref<ArmourModifications>,
    rating?: number
  ) {
    super(armourModification, rating);
    this.customisedArmour = customisedArmour;
  }
}
