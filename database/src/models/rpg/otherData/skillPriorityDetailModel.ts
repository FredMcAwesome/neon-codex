import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  ManyToMany,
  Collection,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
import { Skills } from "../abilities/skillModel.js";
import type {
  SkillBaseType,
  SkillGroupType,
  SkillSourceType,
  SkillType,
} from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import { SkillGroups } from "../abilities/skillGroupModel.js";
import { skillTalentSourceEnum } from "@neon-codex/common/build/enums.js";
import { TalentPriorityDetails } from "./talentPriorityDetailModel.js";

@Entity({
  abstract: true,
  discriminatorColumn: "discr",
})
@Entity()
export abstract class SkillBasePriorityDetails {
  @PrimaryKey()
  id!: number;

  @Property()
  points!: number;

  @Property()
  rating!: number;

  @OneToOne({ entity: () => TalentPriorityDetails, ref: true })
  talentPriorityDetails!: Ref<TalentPriorityDetails>;

  constructor(dto: SkillBaseType) {
    this.points = dto.points;
    this.rating = dto.rating;
  }
}

@Entity({
  discriminatorValue: "SkillPriorityDetails",
})
export class SkillPriorityDetails extends SkillBasePriorityDetails {
  @ManyToMany({ entity: () => Skills, owner: true, joinColumn: "join_id" })
  skillList: Collection<Skills> = new Collection<Skills>(this);

  constructor(dto: SkillType) {
    super(dto);
  }
}

@Entity({
  discriminatorValue: "SkillSourcePriorityDetails",
})
export class SkillSourcePriorityDetails extends SkillBasePriorityDetails {
  @Enum(() => skillTalentSourceEnum)
  source!: skillTalentSourceEnum;

  constructor(dto: SkillSourceType) {
    super(dto);
    this.source = dto.source;
  }
}

@Entity({
  discriminatorValue: "SkillGroupPriorityDetails",
})
export class SkillGroupPriorityDetails extends SkillBasePriorityDetails {
  @ManyToMany({ entity: () => SkillGroups, owner: true, joinColumn: "join_id" })
  skillGroupList: Collection<SkillGroups> = new Collection<SkillGroups>(this);

  constructor(dto: SkillGroupType) {
    super(dto);
  }
}
