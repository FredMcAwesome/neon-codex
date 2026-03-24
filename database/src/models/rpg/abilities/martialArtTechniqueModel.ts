import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
import type { RequirementsType } from "@neon-codex/common";
import { sourceBookEnum } from "@neon-codex/common";
import type { MartialArtTechniqueType } from "@neon-codex/common";
import { MartialArtTechniquesBonuses } from "../otherData/bonusModel.js";

@Entity()
export class MartialArtTechniques {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @OneToOne(
    () => MartialArtTechniquesBonuses,
    (bonus) => bonus.martialArtTechnique,
    {
      owner: true,
      nullable: true,
      ref: true,
    }
  )
  bonus?: Ref<MartialArtTechniquesBonuses>;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: MartialArtTechniqueType) {
    this.name = dto.name;

    // bonus is linked in seeder via MartialArtTechniquesBonuses
    if (dto.requirements !== undefined) {
      this.requirements = dto.requirements;
    }
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
