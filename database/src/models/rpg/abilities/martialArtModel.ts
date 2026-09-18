import { MartialArtRequirements } from "../otherData/requirementsModel.js";
import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
import { sourceBookEnum } from "@neon-codex/common";
import type { MartialArtType } from "@neon-codex/common";
import { MartialArtTechniques } from "./martialArtTechniqueModel.js";
import { MartialArtsBonuses } from "../otherData/bonusModel.js";

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

  @OneToOne(() => MartialArtsBonuses, (bonus) => bonus.martialArt, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<MartialArtsBonuses>;

  @OneToOne(() => MartialArtRequirements, (req) => req.requirementMartialArt, {
    owner: true,
    nullable: true,
    ref: true,
  })
  requirements?: Ref<MartialArtRequirements>;

  @Enum({ items: () => sourceBookEnum })
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
    // bonus is linked in seeder via MartialArtsBonuses
    // requirements is linked by seeder
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
