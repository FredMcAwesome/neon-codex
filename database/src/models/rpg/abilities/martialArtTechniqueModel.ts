import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import type { BonusType } from "@neon-codex/common";
import type { RequirementsType } from "@neon-codex/common";
import { sourceBookEnum } from "@neon-codex/common";
import type { MartialArtTechniqueType } from "@neon-codex/common";

@Entity()
export class MartialArtTechniques {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

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

  constructor(dto: MartialArtTechniqueType) {
    this.name = dto.name;

    if (dto.bonus !== undefined) {
      this.bonus = dto.bonus;
    }
    if (dto.requirements !== undefined) {
      this.requirements = dto.requirements;
    }
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
