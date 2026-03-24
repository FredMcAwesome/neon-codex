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
import type { RequirementsType } from "@neon-codex/common";
import type { MetamagicType } from "@neon-codex/common";
import { MetamagicsBonuses } from "./bonusModel.js";

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

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: MetamagicType) {
    this.name = dto.name;
    if ("requirements" in dto) {
      this.requirements = dto.requirements;
    }
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
