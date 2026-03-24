import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
import { mentorCategoryEnum, sourceBookEnum } from "@neon-codex/common";
import type {
  MentorBaseType,
  MentorChoiceType,
  MentorType,
} from "@neon-codex/common";
import type { RequirementsType } from "@neon-codex/common";
import { MentorsBonuses } from "./bonusModel.js";

@Entity({
  abstract: true,
  discriminatorColumn: "category",
})
export abstract class Mentors {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum({ items: () => mentorCategoryEnum })
  category!: mentorCategoryEnum;

  @Property({ length: 5000 })
  advantage!: string;

  @Property({ length: 5000 })
  disadvantage!: string;

  @OneToOne(() => MentorsBonuses, (bonus) => bonus.mentor, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<MentorsBonuses>;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: MentorBaseType) {
    this.name = dto.name;
    this.advantage = dto.advantage;
    this.disadvantage = dto.disadvantage;
    // bonus is linked in seeder via MentorsBonuses
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}

type MentorSpiritType = MentorType & {
  category: mentorCategoryEnum.MentorSpirit;
};

@Entity({ discriminatorValue: mentorCategoryEnum.MentorSpirit })
export class MentorSpirits extends Mentors {
  @Property({ type: "json" })
  choices!: Array<MentorChoiceType>;

  @Property()
  choiceCount!: number;

  @Property({ type: "json", nullable: true })
  required?: RequirementsType;

  constructor(dto: MentorSpiritType) {
    super(dto);
    this.choices = dto.choices;
    this.choiceCount = dto.choiceCount;
    if (dto.required !== undefined) {
      this.required = dto.required;
    }
  }
}

type ParagonType = MentorType & {
  category: mentorCategoryEnum.Paragon;
};
@Entity({ discriminatorValue: mentorCategoryEnum.Paragon })
export class Paragons extends Mentors {
  constructor(dto: ParagonType) {
    super(dto);
  }
}
