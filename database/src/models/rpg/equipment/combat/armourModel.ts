import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import type {
  ArmourType,
  AvailabilityArmourType,
  CapacityArmourType,
  CostArmourType,
} from "@neon-codex/common/build/schemas/equipment/combat/armourSchemas.js";
import {
  armourCategoryEnum,
  armourModCategoryEnum,
  sourceBookEnum,
} from "@neon-codex/common/build/enums.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import { Weapons } from "./weaponModel.js";
import { IncludedArmourModifications } from "../../activeTables/activeArmourModificationModel.js";
import { ArmourIncludedGears } from "../../activeTables/activeGearModel.js";
import type { DamageReductionArmourType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";

@Entity()
export class Armours {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
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

  @OneToOne({ entity: () => Weapons, nullable: true, ref: true })
  linkedWeapon?: Ref<Weapons>;

  @OneToMany(
    () => ArmourIncludedGears,
    (armourIncludedGear) => armourIncludedGear.armour
  )
  includedGearList = new Collection<ArmourIncludedGears>(this);

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  wirelessBonus?: BonusType;

  @OneToMany(
    () => IncludedArmourModifications,
    (armourIncludedMod) => armourIncludedMod.standardArmour
  )
  includedModList = new Collection<IncludedArmourModifications>(this);

  @Enum({
    items: () => armourModCategoryEnum,
    nullable: true,
  })
  allowModsFromCategory?: armourModCategoryEnum;

  @Enum({
    items: () => armourModCategoryEnum,
    nullable: true,
  })
  addModFromCategory?: armourModCategoryEnum;

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
    // if (dto.isWeapon !== undefined) {
    //   this.isWeapon = dto.isWeapon;
    // }
    // if (dto.armourIncludedGear !== undefined) {
    //   this.armourIncludedGear = dto.armourIncludedGear;
    // }
    if (dto.bonus !== undefined) {
      this.bonus = dto.bonus;
    }
    if (dto.wirelessBonus !== undefined) {
      this.wirelessBonus = dto.wirelessBonus;
    }
    // if (dto.includedMods !== undefined) {
    //   this.includedMods = dto.includedMods;
    // }
    // if (dto.allowModCategory !== undefined) {
    //   this.allowModCategory = dto.allowModCategory;
    // }
    // if (dto.addModFromCategoryList !== undefined) {
    //   this.addModFromCategoryList = dto.addModFromCategoryList;
    // }
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
  }
}
