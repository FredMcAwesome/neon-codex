import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  Unique,
} from "@mikro-orm/postgresql";
import {
  gearCategoryEnum,
  sourceBookEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  DrugType,
  AvailabilityDrugType,
} from "@neon-codex/common/build/schemas/drugSchemas.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";

@Entity()
export class Drugs {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => gearCategoryEnum)
  category!: gearCategoryEnum;

  @Property({ nullable: true })
  speed?: number;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

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

  constructor(dto: DrugType) {
    this.name = dto.name;
    this.description = dto.description;
    this.category = dto.category;
    if (dto.speed !== undefined) {
      this.speed = dto.speed;
    }
    if (dto.bonus !== undefined) {
      this.bonus = dto.bonus;
    }
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
  }
}
