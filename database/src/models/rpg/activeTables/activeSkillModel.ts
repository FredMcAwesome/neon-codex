import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Skills } from "../abilities/skillModel.js";
import { Characters } from "../characters/characterModel.js";

@Entity()
export class ActiveSkills {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Skills, ref: true })
  skill!: Ref<Skills>;

  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @Property()
  skillGroupPoints = 0;

  @Property()
  skillPoints = 0;

  @Property()
  karmaPoints = 0;

  @Property({ type: "string[]", nullable: true })
  specialisationsSelected?: Array<string>;

  constructor(
    skill: Ref<Skills>,
    skillGroupPoints: number,
    skillPoints: number,
    karmaPoints: number,
    specialisationsSelected: Array<string> | undefined
  ) {
    this.skill = skill;
    this.skillGroupPoints = skillGroupPoints;
    this.skillPoints = skillPoints;
    this.karmaPoints = karmaPoints;
    if (specialisationsSelected !== undefined) {
      this.specialisationsSelected = specialisationsSelected;
    }
  }
}
