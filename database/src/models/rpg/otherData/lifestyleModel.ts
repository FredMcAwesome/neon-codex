import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
import { gridCategoryEnum, sourceBookEnum } from "@neon-codex/common";
import type {
  LifestyleCategoryIncreaseCostType,
  LifestyleCategoryType,
  LifestyleCostType,
  LifestyleType,
} from "@neon-codex/common";
import type { RequirementsType } from "@neon-codex/common";
import { LifestylesBonuses } from "./bonusModel.js";

@Entity()
export class Lifestyles {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json" })
  cost!: LifestyleCostType;

  @Property()
  lifestylePoints!: number;

  @Property({ type: "json", nullable: true })
  allowBonusLifestylePoints?: true;

  @Enum({ items: () => gridCategoryEnum, array: true })
  freegridList!: Array<gridCategoryEnum>;

  @Property()
  dice!: number;

  @Property()
  startingNuyenMultiplier!: number;

  @Property({ type: "json", nullable: true })
  costIncreasePerCategoryLevelIncrease?: LifestyleCategoryIncreaseCostType;

  @Property({ type: "json", nullable: true })
  lifestyleCategoryDefaults?: LifestyleCategoryType;

  @OneToOne(() => LifestylesBonuses, (bonus) => bonus.lifestyle, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<LifestylesBonuses>;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property({ type: "json", nullable: true })
  forbidden?: RequirementsType;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: LifestyleType) {
    this.name = dto.name;
    this.cost = dto.cost;
    this.lifestylePoints = dto.lifestylePoints;
    if (dto.allowBonusLifestylePoints !== undefined) {
      this.allowBonusLifestylePoints = dto.allowBonusLifestylePoints;
    }
    this.freegridList = dto.freegridList;
    this.dice = dto.dice;
    this.startingNuyenMultiplier = dto.startingNuyenMultiplier;
    if (dto.costIncreasePerCategoryLevelIncrease !== undefined) {
      this.costIncreasePerCategoryLevelIncrease =
        dto.costIncreasePerCategoryLevelIncrease;
    }
    if (dto.lifestyleCategoryDefaults !== undefined) {
      this.lifestyleCategoryDefaults = dto.lifestyleCategoryDefaults;
    }
    if (dto.requirements !== undefined) {
      this.requirements = dto.requirements;
    }
    if (dto.forbidden !== undefined) {
      this.forbidden = dto.forbidden;
    }
    // bonus is linked in seeder via LifestylesBonuses
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
