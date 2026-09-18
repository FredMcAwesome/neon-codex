import {
  Entity,
  PrimaryKey,
  Property,
  Unique,
  OneToOne,
  type Ref,
  Enum,
} from "@mikro-orm/postgresql";

import { sourceBookEnum } from "@neon-codex/common";
import type { MetamagicType } from "@neon-codex/common";
import { MetamagicsBonuses } from "./bonusModel.js";
import { MetamagicRequirements } from "./requirementsModel.js";

@Entity()
export class Metamagics {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 255 })
  name!: string;

  @OneToOne(() => MetamagicsBonuses, (bonus) => bonus.metamagic, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<MetamagicsBonuses>;

  @OneToOne(() => MetamagicRequirements, (req) => req.requirementMetamagic, {
    owner: true,
    nullable: true,
    ref: true,
  })
  requirements?: Ref<MetamagicRequirements>;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: MetamagicType) {
    this.name = dto.name;
    // requirements is linked by seeder
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
