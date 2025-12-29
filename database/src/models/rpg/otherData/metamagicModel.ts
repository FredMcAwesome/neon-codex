import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/postgresql";

import type { BonusType } from "@neon-codex/common";
import type { RequirementsType } from "@neon-codex/common";
import type { MetamagicType } from "@neon-codex/common";

@Entity()
export class Metamagics {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property()
  source!: string;

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
