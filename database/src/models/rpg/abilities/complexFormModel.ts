import { ComplexFormRequirements } from "../otherData/requirementsModel.js";
import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
import {
  complexFormTargetEnum,
  durationEnum,
  sourceBookEnum,
} from "@neon-codex/common";
import type { ComplexFormType, fadingValueType } from "@neon-codex/common";
import { ComplexFormsBonuses } from "../otherData/bonusModel.js";

@Entity()
export class ComplexForms {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum({ items: () => complexFormTargetEnum })
  target!: complexFormTargetEnum;

  @Enum({ items: () => durationEnum })
  duration!: durationEnum;

  @Property({ type: "json" })
  fadingValue!: fadingValueType;

  @OneToOne(() => ComplexFormsBonuses, (bonus) => bonus.complexForm, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<ComplexFormsBonuses>;

  @OneToOne(
    () => ComplexFormRequirements,
    (req) => req.requirementComplexForm,
    {
      owner: true,
      nullable: true,
      ref: true,
    }
  )
  requirements?: Ref<ComplexFormRequirements>;

  @Enum({ items: () => sourceBookEnum })
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
    // bonus is linked in seeder via ComplexFormsBonuses
    // requirements is linked by seeder
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
