import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/postgresql";
import {
  mentorCategoryEnum,
  sourceBookEnum,
} from "@neon-codex/common/build/enums.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type {
  MentorBaseType,
  MentorChoiceType,
  MentorType,
} from "@neon-codex/common/build/schemas/abilities/talent/mentorSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";

@Entity({
  abstract: true,
  discriminatorColumn: "type",
})
export abstract class Mentors {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum(() => mentorCategoryEnum)
  type!: mentorCategoryEnum;

  @Property({ length: 5000 })
  advantage!: string;

  @Property({ length: 5000 })
  disadvantage!: string;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: MentorBaseType) {
    this.name = dto.name;
    this.advantage = dto.advantage;
    this.disadvantage = dto.disadvantage;
    if (dto.bonus !== undefined) {
      this.bonus = dto.bonus;
    }
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
