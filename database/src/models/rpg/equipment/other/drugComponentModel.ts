import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  Unique,
} from "@mikro-orm/postgresql";
import {
  drugComponentCategoryEnum,
  sourceBookEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  DrugComponentType,
  AvailabilityDrugType,
} from "@neon-codex/common/build/schemas/equipment/other/drugSchemas.js";

@Entity()
export class DrugComponents {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => drugComponentCategoryEnum)
  category!: drugComponentCategoryEnum;

  @Property({ nullable: true })
  appliedLimit?: number;

  @Property({ nullable: true })
  addictionRating?: number;

  @Property({ nullable: true })
  addictionThreshold?: number;

  @Property({ type: "json" })
  availability!: AvailabilityDrugType;

  @Property()
  cost!: number;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: DrugComponentType) {
    this.name = dto.name;
    this.description = dto.description;
    this.category = dto.category;
    if (dto.appliedLimit !== undefined) {
      this.appliedLimit = dto.appliedLimit;
    }
    if (dto.addictionRating !== undefined) {
      this.addictionRating = dto.addictionRating;
    }
    if (dto.addictionThreshold !== undefined) {
      this.addictionThreshold = dto.addictionThreshold;
    }
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
  }
}
