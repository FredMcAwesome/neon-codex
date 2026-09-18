import { MartialArtTechniqueRequirements } from "../otherData/requirementsModel.js";
import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
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

  @OneToOne(
    () => MartialArtTechniqueRequirements,
    (req) => req.requirementMartialArtTechnique,
    { owner: true, nullable: true, ref: true }
  )
  requirements?: Ref<MartialArtTechniqueRequirements>;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: MartialArtTechniqueType) {
    this.name = dto.name;

    // bonus is linked in seeder via MartialArtTechniquesBonuses
    // requirements is linked by seeder
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
