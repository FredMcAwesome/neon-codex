import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import {
  LifestyleQualityCategoryEnum,
  sourceBookEnum,
} from "@neon-codex/common/build/enums.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import type { LifestyleQualityType } from "@neon-codex/common/build/schemas/otherData/lifestyleSchemas.js";
import { Lifestyles } from "./lifestyleModel.js";

@Entity()
export class LifestyleQualities {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum(() => LifestyleQualityCategoryEnum)
  category!: LifestyleQualityCategoryEnum;

  @Property()
  monthlyCost!: number;

  @Property()
  lifestylePointCost!: number;

  @Property({ nullable: true })
  lifestyleCostMultiplier?: number;

  @ManyToMany({
    entity: () => Lifestyles,
    owner: true,
    joinColumn: "join_id",
  })
  requiredLifestyleList = new Collection<Lifestyles>(this);

  @Property({ nullable: true })
  multipleAllowed!: true;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property({ type: "json", nullable: true })
  forbidden?: RequirementsType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: LifestyleQualityType) {
    this.name = dto.name;
    this.category = dto.category;
    if (dto.monthlyCost !== undefined) {
      this.monthlyCost = dto.monthlyCost;
    }
    this.lifestylePointCost = dto.lifestylePointCost;
    if (dto.lifestyleCostMultiplier !== undefined) {
      this.lifestyleCostMultiplier = dto.lifestyleCostMultiplier;
    }
    if (dto.multipleAllowed !== undefined) {
      this.multipleAllowed = dto.multipleAllowed;
    }
    if (dto.bonus !== undefined) {
      this.bonus = dto.bonus;
    }
    if (dto.requirements !== undefined) {
      this.requirements = dto.requirements;
    }
    if (dto.forbidden !== undefined) {
      this.forbidden = dto.forbidden;
    }
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
