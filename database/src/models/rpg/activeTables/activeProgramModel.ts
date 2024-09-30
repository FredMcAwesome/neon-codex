import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/postgresql";
import { Programs } from "../abilities/programModel.js";
import { ActiveTalents } from "./activeTalentModel.js";

@Entity()
export class ActivePrograms {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Programs, ref: true })
  program!: Ref<Programs>;

  @ManyToOne({ entity: () => ActiveTalents, ref: true })
  talent!: Ref<ActiveTalents>;

  @Property({ nullable: true })
  rating?: number;

  constructor(
    program: Ref<Programs>,
    talent: Ref<ActiveTalents>,
    rating?: number
  ) {
    this.program = program;
    this.talent = talent;
    if (rating !== undefined) {
      this.rating = rating;
    }
  }
}
