import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import { priorityLetterEnum } from "@neon-codex/common/build/enums.js";
import type {
  PriorityRowType,
  AttributePriorityType,
  SkillPriorityType,
  ResourceOptionsPriorityType,
} from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import { HeritagePriorityDetails } from "./heritagePriorityDetailModel.js";
import { TalentPriorityDetails } from "./talentPriorityDetailModel.js";

@Entity()
export class Priorities {
  @PrimaryKey()
  id!: number;

  @Enum(() => priorityLetterEnum)
  @Unique()
  rowLetter!: priorityLetterEnum;

  @OneToMany(
    () => HeritagePriorityDetails,
    (heritagePriorityAttributes) => heritagePriorityAttributes.heritagePriority
  )
  heritageList = new Collection<HeritagePriorityDetails>(this);

  @Property()
  heritageLabel!: string;

  @OneToMany(
    () => TalentPriorityDetails,
    (talentPriorityAttributes) => talentPriorityAttributes.talentPriority
  )
  talentList = new Collection<TalentPriorityDetails>(this);

  @Property()
  talentLabel!: string;

  @Property({ type: "json" })
  attributes!: AttributePriorityType;

  @Property({ type: "json" })
  skills!: SkillPriorityType;

  @Property({ type: "json" })
  resources!: ResourceOptionsPriorityType;

  constructor(dto: PriorityRowType) {
    this.rowLetter = dto.priority;
    this.heritageLabel = dto.heritages.name;
    this.talentLabel = dto.talents.name;
    this.attributes = dto.attributes;
    this.skills = dto.skills;
    this.resources = dto.resources;
  }
}
