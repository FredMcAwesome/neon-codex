import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import {
  sourceBookEnum,
  programCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type {
  AvailabilityProgramType,
  CostProgramType,
  ProgramRatingType,
  ProgramType,
} from "@neon-codex/common/build/schemas/abilities/talent/programSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import { ActivePrograms } from "../activeTables/activeProgramModel.js";

@Entity()
export class Programs {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => programCategoryEnum)
  category!: programCategoryEnum;

  @Property({ type: "json", nullable: true })
  rating?: ProgramRatingType;

  @Property({ type: "json" })
  availability!: AvailabilityProgramType;

  @Property({ type: "json" })
  cost!: CostProgramType;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Enum(() => sourceBookEnum)
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
    if (dto.bonus !== undefined) this.bonus = dto.bonus;
    if (dto.requirements !== undefined) this.requirements = dto.requirements;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
