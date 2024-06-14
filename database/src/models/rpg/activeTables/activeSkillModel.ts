import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Skills } from "../abilities/skillModel.js";
import { Characters } from "../characters/characterModel.js";
import { Critters } from "../creatures/critterModel.js";
import type { CritterRatingType } from "@neon-codex/common/build/schemas/creatures/critterSchemas.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export class ActiveSkills {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Skills, ref: true })
  skill!: Ref<Skills>;

  @Property({ type: "string[]", nullable: true })
  specialisationsSelected?: Array<string>;

  constructor(
    skill: Ref<Skills>,
    specialisationsSelected: Array<string> | undefined
  ) {
    this.skill = skill;
    if (specialisationsSelected !== undefined) {
      this.specialisationsSelected = specialisationsSelected;
    }
  }
}

@Entity({ discriminatorValue: "included" })
export class CritterIncludedSkills extends ActiveSkills {
  @ManyToOne({ entity: () => Critters, ref: true })
  standardCritter!: Ref<Critters>;

  @Property({ type: "json" })
  critterSkillRating!: CritterRatingType;

  constructor(
    standardCritter: Ref<Critters>,
    skill: Ref<Skills>,
    critterSkillRating: CritterRatingType,
    specialisationsSelected: Array<string> | undefined
  ) {
    super(skill, specialisationsSelected);
    this.standardCritter = standardCritter;
    this.critterSkillRating = critterSkillRating;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedSkills extends ActiveSkills {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @Property()
  skillPoints: number = 0;

  @Property()
  karmaPoints: number = 0;

  constructor(
    character: Ref<Characters>,
    skill: Ref<Skills>,
    skillPoints: number,
    karmaPoints: number,
    specialisationsSelected: Array<string> | undefined
  ) {
    super(skill, specialisationsSelected);
    this.character = character;
    this.skillPoints = skillPoints;
    this.karmaPoints = karmaPoints;
  }
}
