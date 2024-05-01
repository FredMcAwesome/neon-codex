import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Characters } from "../characters/characterModel.js";
import { Augmentations } from "../equipment/bodyModification/augmentationModel.js";
import { ActiveAugmentationGears } from "./activeGearModel.js";

@Entity()
export class CustomisedAugmentations {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @ManyToOne({ entity: () => Augmentations, ref: true })
  augmentation!: Ref<Augmentations>;

  @OneToMany(
    () => ActiveAugmentationGears,
    (activeAugmentation) => activeAugmentation.activeAugmentation
  )
  includedGearList = new Collection<ActiveAugmentationGears>(this);

  constructor(augmentation: Ref<Augmentations>) {
    this.augmentation = augmentation;
  }
}
