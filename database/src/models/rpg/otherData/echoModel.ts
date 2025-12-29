import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/postgresql";

import type { BonusType } from "@neon-codex/common";
import type { EchoType } from "@neon-codex/common";

@Entity()
export class Echoes {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property()
  source!: string;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: EchoType) {
    this.name = dto.name;
    if (dto.bonus !== undefined) this.bonus = dto.bonus;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
