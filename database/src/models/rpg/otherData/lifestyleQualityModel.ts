import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
import {
  lifestyleQualityCategoryEnum,
  sourceBookEnum,
} from "@neon-codex/common";
import type { LifestyleQualityType } from "@neon-codex/common";
import { Lifestyles } from "./lifestyleModel.js";
import { LifestyleQualitiesBonuses } from "./bonusModel.js";
import {
  LifestyleQualityRequirements,
  LifestyleQualityForbidden,
} from "./requirementsModel.js";

@Entity()
export class LifestyleQualities {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum({ items: () => lifestyleQualityCategoryEnum })
  category!: lifestyleQualityCategoryEnum;

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
  multipleAllowed?: true;

  @OneToOne(
    () => LifestyleQualitiesBonuses,
    (bonus) => bonus.lifestyleQuality,
    {
      owner: true,
      nullable: true,
      ref: true,
    }
  )
  bonus?: Ref<LifestyleQualitiesBonuses>;

  @OneToOne(
    () => LifestyleQualityRequirements,
    (req) => req.requirementLifestyleQuality,
    {
      owner: true,
      nullable: true,
      ref: true,
    }
  )
  requirements?: Ref<LifestyleQualityRequirements>;

  @OneToOne(
    () => LifestyleQualityForbidden,
    (req) => req.forbiddenLifestyleQuality,
    {
      owner: true,
      nullable: true,
      ref: true,
    }
  )
  forbidden?: Ref<LifestyleQualityForbidden>;

  @Enum({ items: () => sourceBookEnum })
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
    // requirements, forbidden, and bonus are linked by the seeder
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
