import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import {
  complexFormTargetEnum,
  durationEnum,
  sourceBookEnum,
} from "@neon-codex/common";
import type { ComplexFormType, fadingValueType } from "@neon-codex/common";
import type { BonusType } from "@neon-codex/common";
import type { RequirementsType } from "@neon-codex/common";

@Entity()
export class ComplexForms {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => complexFormTargetEnum)
  target!: complexFormTargetEnum;

  @Enum(() => durationEnum)
  duration!: durationEnum;

  @Property({ type: "json" })
  fadingValue!: fadingValueType;

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

  constructor(dto: ComplexFormType) {
    this.name = dto.name;
    this.target = dto.target;
    this.fadingValue = dto.fadingValue;
    this.duration = dto.duration;
    if (dto.bonus !== undefined) this.bonus = dto.bonus;
    if (dto.requirements !== undefined) this.requirements = dto.requirements;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
