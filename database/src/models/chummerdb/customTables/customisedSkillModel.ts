import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import type { Ref } from "@mikro-orm/core";
import { Skills } from "../skillModel.js";

@Entity()
export class CustomisedSkills {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Skills, ref: true })
  skill!: Ref<Skills>;

  @Property()
  skillGroupPoints = 0;

  @Property()
  skillPoints = 0;

  @Property()
  karmaPoints = 0;

  @Property({ type: "string[]", nullable: true })
  specialisationsSelected?: Array<string>;

  constructor(skill: Ref<Skills>) {
    this.skill = skill;
  }
}
