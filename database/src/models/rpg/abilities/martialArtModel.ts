import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import { sourceBookEnum } from "@neon-codex/common/build/enums.js";
import type { MartialArtType } from "@neon-codex/common/src/schemas/abilities/martialArtSchemas.js";
import { MartialArtTechniques } from "./martialArtTechniqueModel.js";

@Entity()
export class MartialArts {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Property({ nullable: true })
  karmaCost?: number;

  @ManyToMany({
    entity: () => MartialArtTechniques,
    owner: true,
    joinColumn: "join_id",
  })
  techniqueList = new Collection<MartialArtTechniques>(this);

  @Property({ nullable: true })
  allTechniques?: true;

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

  constructor(dto: MartialArtType) {
    this.name = dto.name;

    if (typeof dto.techniqueList === "object") {
      this.allTechniques = true;
    }
    if (dto.karmaCost !== undefined) {
      this.karmaCost = dto.karmaCost;
    }
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
