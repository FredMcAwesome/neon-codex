import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/postgresql";
import { MentorSpirits } from "../otherData/mentorModel.js";
import { ActiveMagicTalents } from "./activeTalentModel.js";
import type { MentorChoiceType } from "@neon-codex/common/build/schemas/abilities/talent/mentorSchemas.js";

@Entity()
export class ActiveMentorSpirits {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => MentorSpirits, ref: true })
  mentorSpirit!: Ref<MentorSpirits>;

  @OneToOne(() => ActiveMagicTalents, (talent) => talent.mentorSpirit, {
    ref: true,
  })
  activeTalent!: Ref<ActiveMagicTalents>;

  @Property({ type: "json" })
  choices!: Array<MentorChoiceType>;

  constructor(choices: Array<MentorChoiceType>) {
    this.choices = choices;
  }
}
