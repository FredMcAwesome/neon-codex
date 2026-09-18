import { ProgramRequirements } from "../otherData/requirementsModel.js";
import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
import { sourceBookEnum, programCategoryEnum } from "@neon-codex/common";
import type {
  AvailabilityProgramType,
  CostProgramType,
  ProgramRatingType,
  ProgramType,
} from "@neon-codex/common";
import { ActivePrograms } from "../activeTables/activeProgramModel.js";
import { ProgramsBonuses } from "../otherData/bonusModel.js";

@Entity()
export class Programs {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum({ items: () => programCategoryEnum })
  category!: programCategoryEnum;

  @Property({ type: "json", nullable: true })
  rating?: ProgramRatingType;

  @Property({ type: "json" })
  availability!: AvailabilityProgramType;

  @Property({ type: "json" })
  cost!: CostProgramType;

  @OneToOne(() => ProgramsBonuses, (bonus) => bonus.program, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<ProgramsBonuses>;

  @OneToOne(() => ProgramRequirements, (req) => req.requirementProgram, {
    owner: true,
    nullable: true,
    ref: true,
  })
  requirements?: Ref<ProgramRequirements>;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  @OneToMany(() => ActivePrograms, (activeProgram) => activeProgram.program)
  activeProgramList = new Collection<ActivePrograms>(this);

  constructor(dto: ProgramType) {
    this.name = dto.name;
    this.category = dto.category;
    if (dto.rating !== undefined) this.rating = dto.rating;
    this.availability = dto.availability;
    this.cost = dto.cost;
    // bonus is linked in seeder via ProgramsBonuses
    // requirements is linked by seeder
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
