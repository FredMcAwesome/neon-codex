import assert from "assert";
import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  ManyToOne,
  ManyToMany,
  Collection,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { augmentationTypeEnum } from "@shadowrun/common";
import type { RatingType } from "@shadowrun/common";
import type {
  CostAugmentationType,
  AvailabilityAugmentationType,
  EssenceCostType,
  AugmentationType,
  AugmentationLimitType,
  CapacityAugmentationType,
  AugmentationSubsystemListType,
  deviceRatingType,
} from "@shadowrun/common/build/schemas/augmentationSchemas.js";
import {
  augmentationGradeEnum,
  biowareCategoryEnum,
  cyberwareCategoryEnum,
  limbSlotEnum,
  mountSlotEnum,
  ratingMeaningEnum,
  sourceBookEnum,
} from "@shadowrun/common/build/enums.js";
import { Weapons } from "../combatGear/weaponModel.js";
import type { BonusType } from "@shadowrun/common/build/schemas/shared/bonusSchemas.js";
import type { RequirementsType } from "@shadowrun/common/build/schemas/shared/requiredSchemas.js";
import type {
  AllowedGearType,
  UseGearListType,
} from "@shadowrun/common/build/schemas/commonSchemas.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Augmentations {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
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

  @Property({ type: "json", nullable: true })
  rating?: RatingType;

  @Enum({ items: () => ratingMeaningEnum, nullable: true })
  ratingLabel?: ratingMeaningEnum;

  @ManyToOne({ entity: () => Weapons, ref: true, nullable: true })
  addWeapon?: Ref<Weapons>;

  @Enum({ items: () => mountSlotEnum, array: true, nullable: true })
  blockedMountList?: Array<mountSlotEnum>;

  @Property({ nullable: true })
  selectSide?: true;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  pairBonus?: BonusType;

  @ManyToMany(() => Augmentations)
  pairIncludeList: Collection<Augmentations> = new Collection<Augmentations>(
    this
  );

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property({ type: "json", nullable: true })
  restrictions?: RequirementsType;

  @Property({ type: "json", nullable: true })
  allowedGear?: AllowedGearType;

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
    if (dto.ratingLabel !== undefined) this.ratingLabel = dto.ratingLabel;
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
    if (dto.forbidden !== undefined) this.restrictions = dto.forbidden;
    if (dto.allowedGear !== undefined) this.allowedGear = dto.allowedGear;
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

@Entity({ discriminatorValue: augmentationTypeEnum.Cyberware })
export class Cyberwares extends Augmentations {
  @Property()
  subtype!: cyberwareCategoryEnum;

  @Property({ nullable: true })
  programs?: "Rating";

  @Property({ type: "json", nullable: true })
  capacity?: CapacityAugmentationType;

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

  @Enum({ items: () => mountSlotEnum, nullable: true })
  mountsLocation?: mountSlotEnum;

  @Property({ nullable: true })
  modularMount?: true;

  @Property({ type: "json", nullable: true })
  wirelessBonus?: BonusType;

  @Property({ type: "json", nullable: true })
  wirelessPairBonus?: BonusType;

  @Property({ type: "string[]", nullable: true })
  wirelessPairIncludeList?: Array<String>;

  @Property({ type: "json", nullable: true })
  gearList?: UseGearListType;

  @Property({ type: "json", nullable: true })
  subsystemList?: AugmentationSubsystemListType;

  @Enum({ items: () => augmentationGradeEnum, nullable: true })
  forceGrade?: augmentationGradeEnum;

  @Property({ type: "json", nullable: true })
  deviceRating?: deviceRatingType;

  @Property({ nullable: true })
  addVehicle?: string;

  constructor(dto: AugmentationType) {
    super(dto);
    assert(dto.typeInformation.type === augmentationTypeEnum.Cyberware);
    this.subtype = dto.typeInformation.subtype;
    if (dto.typeInformation.programs !== undefined)
      this.programs = dto.typeInformation.programs;
    if (dto.typeInformation.capacity !== undefined)
      this.capacity = dto.typeInformation.capacity;
    if (dto.typeInformation.addToParentCapacity !== undefined)
      this.addToParentCapacity = dto.typeInformation.addToParentCapacity;
    if (dto.typeInformation.addParentWeaponAccessory !== undefined)
      this.addParentWeaponAccessory =
        dto.typeInformation.addParentWeaponAccessory;
    if (dto.typeInformation.removalCost !== undefined)
      this.removalCost = dto.typeInformation.removalCost;
    if (dto.typeInformation.inheritAttributes !== undefined)
      this.inheritAttributes = dto.typeInformation.inheritAttributes;
    if (dto.typeInformation.limbSlot !== undefined)
      this.limbSlot = dto.typeInformation.limbSlot;
    if (dto.typeInformation.useBothLimbSlots !== undefined)
      this.useBothLimbSlots = dto.typeInformation.useBothLimbSlots;
    if (dto.typeInformation.mountsLocation !== undefined)
      this.mountsLocation = dto.typeInformation.mountsLocation;
    if (dto.typeInformation.modularMount !== undefined)
      this.modularMount = dto.typeInformation.modularMount;
    if (dto.typeInformation.wirelessBonus !== undefined)
      this.wirelessBonus = dto.typeInformation.wirelessBonus;
    if (dto.typeInformation.wirelessPairBonus !== undefined)
      this.wirelessPairBonus = dto.typeInformation.wirelessPairBonus;
    if (dto.typeInformation.wirelessPairIncludeList !== undefined)
      this.wirelessPairIncludeList =
        dto.typeInformation.wirelessPairIncludeList;
    if (dto.typeInformation.gearList !== undefined)
      this.gearList = dto.typeInformation.gearList;
    if (dto.typeInformation.subsystemList !== undefined)
      this.subsystemList = dto.typeInformation.subsystemList;
    if (dto.typeInformation.forceGrade !== undefined)
      this.forceGrade = dto.typeInformation.forceGrade;
    if (dto.typeInformation.deviceRating !== undefined)
      this.deviceRating = dto.typeInformation.deviceRating;
    if (dto.typeInformation.addVehicle !== undefined)
      this.addVehicle = dto.typeInformation.addVehicle;
  }
}

@Entity({ discriminatorValue: augmentationTypeEnum.Bioware })
export class Biowares extends Augmentations {
  @Property()
  subtype!: biowareCategoryEnum;

  @Property({ nullable: true })
  isGeneware?: true;

  constructor(dto: AugmentationType) {
    super(dto);
    assert(dto.typeInformation.type === augmentationTypeEnum.Bioware);
    this.subtype = dto.typeInformation.subtype;
    if (dto.typeInformation.isGeneware !== undefined)
      this.isGeneware = dto.typeInformation.isGeneware;
  }
}
