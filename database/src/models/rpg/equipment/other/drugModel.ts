import {
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
  Enum,
  Unique,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { gearCategoryEnum, sourceBookEnum } from "@neon-codex/common";
import type { DrugType, AvailabilityDrugType } from "@neon-codex/common";
import { DrugsBonuses } from "../../otherData/bonusModel.js";

@Entity()
export class Drugs {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum({ items: () => gearCategoryEnum })
  category!: gearCategoryEnum;

  @Property({ nullable: true })
  speed?: number;

  @OneToOne(() => DrugsBonuses, (bonus) => bonus.drug, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<DrugsBonuses>;

  @Property({ type: "json" })
  availability!: AvailabilityDrugType;

  @Property()
  cost!: number;

  @Enum({ items: () => sourceBookEnum })
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
    // bonus is linked in seeder via DrugsBonuses
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
  }
}
