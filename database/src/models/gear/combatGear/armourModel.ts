import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import type {
  ArmourType,
  AvailabilityArmourType,
  CapacityArmourType,
  CostArmourType,
  DamageReductionArmourType,
} from "@shadowrun/common/build/schemas/armourSchemas.js";
import {
  armourCategoryEnum,
  armourModCategoryEnum,
  sourceBookEnum,
} from "@shadowrun/common/build/enums.js";
import type { UseGearListType } from "@shadowrun/common/build/schemas/commonSchemas.js";
import type { BonusType } from "@shadowrun/common/build/schemas/shared/bonusSchemas.js";
import type { ModListType } from "@shadowrun/common/build/schemas/shared/modSchemas.js";

@Entity()
export class Armours {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum(() => armourCategoryEnum)
  category!: armourCategoryEnum;

  @Property({ nullable: true })
  maxRating?: number;

  @Property({ type: "json" })
  damageReduction!: DamageReductionArmourType;

  @Property({ nullable: true })
  customFitStackDamageReduction?: number;

  @Property({ type: "json" })
  capacity!: CapacityArmourType;

  @Property({ nullable: true })
  isWeapon?: true;

  @Property({ type: "json", nullable: true })
  includedGear?: UseGearListType;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  wirelessBonus?: BonusType;

  @Property({ type: "json", nullable: true })
  mods?: ModListType;

  @Enum({
    items: () => armourModCategoryEnum,
    nullable: true,
  })
  allowModCategory?: armourModCategoryEnum;

  @Enum({
    items: () => armourModCategoryEnum,
    array: true,
    nullable: true,
  })
  addModCategoryList?: Array<armourModCategoryEnum>;

  @Property({ type: "json" })
  availability!: AvailabilityArmourType;

  @Property({ type: "json" })
  cost!: CostArmourType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;

  constructor(dto: ArmourType) {
    this.name = dto.name;
    this.description = dto.description;
    this.category = dto.category;
    if (dto.maxRating !== undefined) {
      this.maxRating = dto.maxRating;
    }
    this.damageReduction = dto.damageReduction;
    if (dto.customFitStackDamageReduction !== undefined) {
      this.customFitStackDamageReduction = dto.customFitStackDamageReduction;
    }
    this.capacity = dto.capacity;
    if (dto.isWeapon !== undefined) {
      this.isWeapon = dto.isWeapon;
    }
    if (dto.includedGear !== undefined) {
      this.includedGear = dto.includedGear;
    }
    if (dto.bonus !== undefined) {
      this.bonus = dto.bonus;
    }
    if (dto.wirelessBonus !== undefined) {
      this.wirelessBonus = dto.wirelessBonus;
    }
    if (dto.mods !== undefined) {
      this.mods = dto.mods;
    }
    if (dto.allowModCategory !== undefined) {
      this.allowModCategory = dto.allowModCategory;
    }
    if (dto.addModCategoryList !== undefined) {
      this.addModCategoryList = dto.addModCategoryList;
    }
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
  }
}
