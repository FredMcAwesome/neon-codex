import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  type Ref,
} from "@mikro-orm/postgresql";
import { Paragons } from "../otherData/mentorModel.js";
import { ActiveResonanceTalents } from "./activeTalentModel.js";

@Entity()
export class ActiveParagons {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Paragons, ref: true })
  paragon!: Ref<Paragons>;

  @OneToOne(() => ActiveResonanceTalents, (talent) => talent.paragon, {
    ref: true,
  })
  activeTalent!: Ref<ActiveResonanceTalents>;
}
