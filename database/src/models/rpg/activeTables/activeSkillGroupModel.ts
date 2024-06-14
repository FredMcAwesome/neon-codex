import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Characters } from "../characters/characterModel.js";
import { SkillGroups } from "../abilities/skillGroupModel.js";
import { Critters } from "../creatures/critterModel.js";
import type { CritterRatingType } from "@neon-codex/common/build/schemas/creatures/critterSchemas.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export class ActiveSkillGroups {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => SkillGroups, ref: true })
  skillGroup!: Ref<SkillGroups>;

  constructor(skillGroup: Ref<SkillGroups>) {
    this.skillGroup = skillGroup;
  }
}

@Entity({ discriminatorValue: "critterIncluded" })
export class CritterIncludedSkillGroups extends ActiveSkillGroups {
  @ManyToOne({ entity: () => Critters, ref: true })
  standardCritter!: Ref<Critters>;

  @Property({ type: "json" })
  critterSkillGroupRating!: CritterRatingType;

  constructor(
    standardCritter: Ref<Critters>,
    skillGroup: Ref<SkillGroups>,
    critterSkillGroupRating: CritterRatingType
  ) {
    super(skillGroup);
    this.standardCritter = standardCritter;
    this.critterSkillGroupRating = critterSkillGroupRating;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedSkillGroups extends ActiveSkillGroups {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @Property()
  skillGroupPoints: number = 0;

  @Property()
  karmaPoints: number = 0;

  constructor(
    character: Ref<Characters>,
    skillGroup: Ref<SkillGroups>,
    skillGroupPoints: number,
    karmaPoints: number
  ) {
    super(skillGroup);
    this.character = character;
    this.skillGroupPoints = skillGroupPoints;
    this.karmaPoints = karmaPoints;
  }
}
