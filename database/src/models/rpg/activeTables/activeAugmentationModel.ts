import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Characters } from "../characters/characterModel.js";
import { Augmentations } from "../equipment/bodyModification/augmentationModel.js";
import { ActiveAugmentationGears } from "./activeGearModel.js";
import { Critters } from "../creatures/critterModel.js";
import { EquipmentPacks } from "../equipment/equipmentPackModel.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveAugmentations {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Augmentations, ref: true })
  augmentation!: Ref<Augmentations>;

  @OneToMany(
    () => ChildAugmentations,
    (augmentationIncludedAugmentation) =>
      augmentationIncludedAugmentation.parentAugmentation
  )
  subsystemList = new Collection<ChildAugmentations>(this);

  @OneToMany(
    () => ActiveAugmentationGears,
    (activeAugmentation) => activeAugmentation.activeAugmentation
  )
  gearList = new Collection<ActiveAugmentationGears>(this);

  @Property()
  rating: number = 0;

  constructor(augmentation: Ref<Augmentations>, rating?: number) {
    this.augmentation = augmentation;
    if (rating !== undefined) {
      this.rating = rating;
    }
  }
}

@Entity({ discriminatorValue: "child" })
export class ChildAugmentations extends ActiveAugmentations {
  @ManyToOne({ entity: () => ActiveAugmentations, ref: true })
  parentAugmentation!: Ref<ActiveAugmentations>;

  constructor(augmentation: Ref<Augmentations>, rating?: number) {
    super(augmentation, rating);
  }
}

@Entity({ discriminatorValue: "included" })
export class IncludedAugmentations extends ActiveAugmentations {
  constructor(augmentation: Ref<Augmentations>, rating?: number) {
    super(augmentation, rating);
  }
}

@Entity({ discriminatorValue: "pack" })
export class PackAugmentations extends ActiveAugmentations {
  @ManyToOne({ entity: () => EquipmentPacks, ref: true })
  equipmentPack!: Ref<EquipmentPacks>;

  constructor(augmentation: Ref<Augmentations>, rating?: number) {
    super(augmentation, rating);
  }
}

@Entity({ discriminatorValue: "critterIncluded" })
export class CritterIncludedAugmentations extends ActiveAugmentations {
  @ManyToOne({ entity: () => Critters, ref: true })
  standardCritter!: Ref<Critters>;

  constructor(augmentation: Ref<Augmentations>, rating?: number) {
    super(augmentation, rating);
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedAugmentations extends ActiveAugmentations {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(augmentation: Ref<Augmentations>, rating?: number) {
    super(augmentation, rating);
  }
}
