import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  ManyToOne,
  ManyToMany,
  Collection,
  OneToOne,
  Unique,
  OneToMany,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import type {
  CostAugmentationType,
  AvailabilityAugmentationType,
  AugmentationType,
  AugmentationLimitType,
  CapacityAugmentationType,
  AugmentationSubsystemListType,
  deviceRatingType,
} from "@neon-codex/common/build/schemas/augmentationSchemas.js";
import {
  augmentationGradeEnum,
  augmentationTypeEnum,
  biowareCategoryEnum,
  cyberwareCategoryEnum,
  gearCategoryEnum,
  limbSlotEnum,
  augmentationMountSlotEnum,
  ratingMeaningEnum,
  sourceBookEnum,
} from "@neon-codex/common/build/enums.js";
import { Weapons } from "../combat/weaponModel.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import { Gears } from "../other/gearModel.js";
import { Vehicles } from "../rigger/vehicleModel.js";
import { AugmentationIncludedGears } from "../../activeTables/activeGearModel.js";
import type {
  EssenceCostType,
  RatingType,
} from "@neon-codex/common/build/schemas/commonSchemas.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Augmentations {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => augmentationTypeEnum)
  type!: augmentationTypeEnum;

  @Property({ type: "json", nullable: true })
  augmentationLimit?: AugmentationLimitType;

  @Enum({ items: () => augmentationGradeEnum, array: true, nullable: true })
  unavailableGrades?: Array<augmentationGradeEnum>;

  @Property({ type: "json" })
  essenceCost!: EssenceCostType;

  @Property({ nullable: true })
  modification?: true;

  @Property({ type: "json" })
  rating: RatingType;

  @Enum({ items: () => ratingMeaningEnum, nullable: true })
  ratingMeaning?: ratingMeaningEnum;

  @ManyToOne({ entity: () => Weapons, ref: true, nullable: true })
  addWeapon?: Ref<Weapons>;

  @Enum({ items: () => augmentationMountSlotEnum, array: true, nullable: true })
  blockedMountList?: Array<augmentationMountSlotEnum>;

  @Property({ nullable: true })
  selectSide?: true;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  pairBonus?: BonusType;

  // join column needs to be manually set as Mikro orm
  // doesn't create a valid join column otherwise
  @ManyToMany({
    entity: () => Augmentations,
    owner: true,
    joinColumn: "join_id",
  })
  pairIncludeList = new Collection<Augmentations>(this);

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property({ type: "json", nullable: true })
  forbidden?: RequirementsType;

  @ManyToMany({ entity: () => Gears, owner: true })
  allowedGearList = new Collection<Gears>(this);

  @OneToMany(
    () => AugmentationIncludedGears,
    (augmentationIncludedGear) => augmentationIncludedGear.augmentation
  )
  includedGearList = new Collection<AugmentationIncludedGears>(this);

  @Enum({ items: () => gearCategoryEnum, nullable: true, array: true })
  allowedGearCategories?: Array<gearCategoryEnum>;

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({
    nullable: true,
  })
  allowCategoryList?: Array<cyberwareCategoryEnum | biowareCategoryEnum>;

  @Property({ type: "json" })
  availability!: AvailabilityAugmentationType;

  @Property({ type: "json" })
  cost!: CostAugmentationType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;

  constructor(dto: AugmentationType) {
    this.name = dto.name;
    if (dto.augmentationLimit !== undefined)
      this.augmentationLimit = dto.augmentationLimit;
    if (dto.unavailableGrades !== undefined)
      this.unavailableGrades = dto.unavailableGrades;

    if (dto.essenceCost !== undefined) this.essenceCost = dto.essenceCost;
    if (dto.modification !== undefined) this.modification = dto.modification;
    this.rating = dto.rating;
    if (dto.ratingMeaning !== undefined) this.ratingMeaning = dto.ratingMeaning;
    // if (dto.addWeapon !== undefined)
    // this.addWeapon = dto.addWeapon;
    if (dto.blockedMountList !== undefined)
      this.blockedMountList = dto.blockedMountList;
    if (dto.selectSide !== undefined) this.selectSide = dto.selectSide;
    if (dto.bonus !== undefined) this.bonus = dto.bonus;
    if (dto.pairBonus !== undefined) this.pairBonus = dto.pairBonus;
    // if (dto.pairIncludeList !== undefined)
    //   this.pairIncludeList = dto.pairIncludeList;
    if (dto.requirements !== undefined) this.requirements = dto.requirements;
    if (dto.forbidden !== undefined) this.forbidden = dto.forbidden;
    // if (dto.allowedGearList !== undefined) this.allowedGearList = dto.allowedGearList;
    // if (dto.gearList !== undefined) this.gearList = dto.gearList;
    if (dto.allowedGearCategories !== undefined)
      this.allowedGearCategories = dto.allowedGearCategories;
    if (dto.userSelectable !== undefined)
      this.userSelectable = dto.userSelectable;
    if (dto.allowCategoryList !== undefined)
      this.allowCategoryList = dto.allowCategoryList;
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}

type CyberwareAugmentationType = AugmentationType & {
  type: augmentationTypeEnum.Cyberware;
};

@Entity({ discriminatorValue: augmentationTypeEnum.Cyberware })
export class Cyberwares extends Augmentations {
  @Property()
  subtype!: cyberwareCategoryEnum;

  @Property({ nullable: true })
  programs?: "Rating";

  @Property({ type: "json", nullable: true })
  capacity?: CapacityAugmentationType;

  @Property({ type: "json", nullable: true })
  capacityCost?: CapacityAugmentationType;

  @Property({ nullable: true })
  addToParentCapacity?: true;

  @Property({ nullable: true })
  addParentWeaponAccessory?: true;

  @Property({ nullable: true })
  removalCost?: number;

  @Property({ nullable: true })
  inheritAttributes?: true;

  @Enum({ items: () => limbSlotEnum, nullable: true })
  limbSlot?: limbSlotEnum;

  @Property({ nullable: true })
  useBothLimbSlots?: true;

  @Enum({ items: () => augmentationMountSlotEnum, nullable: true })
  mountsLocation?: augmentationMountSlotEnum;

  @Property({ nullable: true })
  modularMount?: true;

  @Property({ type: "json", nullable: true })
  wirelessBonus?: BonusType;

  @Property({ type: "json", nullable: true })
  wirelessPairBonus?: BonusType;

  @OneToOne({ entity: () => Cyberwares, nullable: true })
  wirelessPairLinkedCyberware?: Cyberwares;

  @Property({ type: "json", nullable: true })
  subsystemList?: AugmentationSubsystemListType;

  @Enum({ items: () => augmentationGradeEnum, nullable: true })
  forceGrade?: augmentationGradeEnum;

  @Property({ type: "json", nullable: true })
  deviceRating?: deviceRatingType;

  @OneToOne({ entity: () => Vehicles, nullable: true, ref: true })
  linkedVehicle?: Ref<Vehicles>;

  constructor(dto: CyberwareAugmentationType) {
    super(dto);
    this.subtype = dto.subtype;
    if (dto.programs !== undefined) this.programs = dto.programs;
    if (dto.capacity !== undefined) this.capacity = dto.capacity;
    if (dto.capacityCost !== undefined) this.capacityCost = dto.capacityCost;
    if (dto.addToParentCapacity !== undefined)
      this.addToParentCapacity = dto.addToParentCapacity;
    if (dto.addParentWeaponAccessory !== undefined)
      this.addParentWeaponAccessory = dto.addParentWeaponAccessory;
    if (dto.removalCost !== undefined) this.removalCost = dto.removalCost;
    if (dto.inheritAttributes !== undefined)
      this.inheritAttributes = dto.inheritAttributes;
    if (dto.limbSlot !== undefined) this.limbSlot = dto.limbSlot;
    if (dto.useBothLimbSlots !== undefined)
      this.useBothLimbSlots = dto.useBothLimbSlots;
    if (dto.mountsLocation !== undefined)
      this.mountsLocation = dto.mountsLocation;
    if (dto.modularMount !== undefined) this.modularMount = dto.modularMount;
    if (dto.wirelessBonus !== undefined) this.wirelessBonus = dto.wirelessBonus;
    if (dto.wirelessPairBonus !== undefined)
      this.wirelessPairBonus = dto.wirelessPairBonus;
    // if (dto.wirelessPairInclude !== undefined)
    //   this.wirelessPairInclude = dto.wirelessPairInclude;
    if (dto.subsystemList !== undefined) this.subsystemList = dto.subsystemList;
    if (dto.forceGrade !== undefined) this.forceGrade = dto.forceGrade;
    if (dto.deviceRating !== undefined) this.deviceRating = dto.deviceRating;
    // if (dto.addVehicle !== undefined) this.addVehicle = dto.addVehicle;
  }
}

type BiowareAugmentationType = AugmentationType & {
  type: augmentationTypeEnum.Bioware;
};
@Entity({ discriminatorValue: augmentationTypeEnum.Bioware })
export class Biowares extends Augmentations {
  @Property()
  subtype!: biowareCategoryEnum;

  @Property({ nullable: true })
  isGeneware?: true;

  constructor(dto: BiowareAugmentationType) {
    super(dto);
    this.subtype = dto.subtype;
    if (dto.isGeneware !== undefined) this.isGeneware = dto.isGeneware;
  }
}
