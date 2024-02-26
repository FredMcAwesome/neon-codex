import {
  Entity,
  PrimaryKey,
  Property,
  Unique,
  Collection,
  OneToMany,
} from "@mikro-orm/postgresql";
import { Skills } from "./skillModel.js";

@Entity()
export class SkillGroups {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @OneToMany(() => Skills, (skill) => skill.skillGroup)
  skillList = new Collection<Skills>(this);

  constructor(name: string) {
    this.name = name;
  }
}
