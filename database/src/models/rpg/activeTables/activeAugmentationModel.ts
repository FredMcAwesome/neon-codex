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
import { Characters } from "../characters/characterModel.js";
import { Augmentations } from "../equipment/bodyModification/augmentationModel.js";
import { ActiveAugmentationGears } from "./activeGearModel.js";
import { Critters } from "../creatures/critterModel.js";
import { EquipmentPacks } from "../equipment/equipmentPackModel.js";
import { augmentationGradeEnum } from "@neon-codex/common/build/enums.js";

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

  constructor(
    parentAugmentation: Ref<ActiveAugmentations>,
    augmentation: Ref<Augmentations>,
    rating?: number
  ) {
    super(augmentation, rating);
    this.parentAugmentation = parentAugmentation;
  }
}

@Entity()
export abstract class BaseActiveAugmentations extends ActiveAugmentations {
  @Enum(() => augmentationGradeEnum)
  grade!: augmentationGradeEnum;

  constructor(
    augmentation: Ref<Augmentations>,
    grade: augmentationGradeEnum,
    rating?: number
  ) {
    super(augmentation, rating);
    this.grade = grade;
  }
}

@Entity({ discriminatorValue: "pack" })
export class PackAugmentations extends BaseActiveAugmentations {
  @ManyToOne({ entity: () => EquipmentPacks, ref: true })
  equipmentPack!: Ref<EquipmentPacks>;

  constructor(
    equipmentPack: Ref<EquipmentPacks>,
    augmentation: Ref<Augmentations>,
    grade: augmentationGradeEnum,
    rating?: number
  ) {
    super(augmentation, grade, rating);
    this.equipmentPack = equipmentPack;
  }
}

@Entity({ discriminatorValue: "critterIncluded" })
export class CritterIncludedAugmentations extends BaseActiveAugmentations {
  @ManyToOne({ entity: () => Critters, ref: true })
  standardCritter!: Ref<Critters>;

  constructor(
    standardCritter: Ref<Critters>,
    augmentation: Ref<Augmentations>,
    grade: augmentationGradeEnum,
    rating?: number
  ) {
    super(augmentation, grade, rating);
    this.standardCritter = standardCritter;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedAugmentations extends BaseActiveAugmentations {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(
    character: Ref<Characters>,
    augmentation: Ref<Augmentations>,
    grade: augmentationGradeEnum,
    rating?: number
  ) {
    super(augmentation, grade, rating);
    this.character = character;
  }
}
