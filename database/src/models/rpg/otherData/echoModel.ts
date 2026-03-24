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
import type { EchoType } from "@neon-codex/common";
import { EchoesBonuses } from "./bonusModel.js";

@Entity()
export class Echoes {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 255 })
  name!: string;

  @OneToOne(() => EchoesBonuses, (bonus) => bonus.echo, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<EchoesBonuses>;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: EchoType) {
    this.name = dto.name;
    // bonus is linked in seeder via EchoesBonuses
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
