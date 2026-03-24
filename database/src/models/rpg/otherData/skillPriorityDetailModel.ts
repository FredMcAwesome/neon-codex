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
  IncludedSkillSourceType,
  IncludedSkillOptionsType,
} from "@neon-codex/common";
import { SkillGroups } from "../abilities/skillGroupModel.js";
import { skillTalentSourceEnum } from "@neon-codex/common";
import { TalentPriorityDetails } from "./talentPriorityDetailModel.js";

@Entity({
  abstract: true,
  discriminatorColumn: "discr",
})
export abstract class SkillBasePriorityDetails {
  @PrimaryKey()
  id!: number;

  @Property()
  points!: number;

  @Property()
  rating!: number;

  @OneToOne({
    entity: () => TalentPriorityDetails,
    ref: true,
  }) // polymorphic relationship - owner is TalentPriorityDetails
  abstract talentPriorityDetails: Ref<TalentPriorityDetails>;

  constructor(dto: SkillBaseType) {
    this.points = dto.skillCount;
    this.rating = dto.rating;
  }
}

@Entity({
  discriminatorValue: "SkillPriorityDetails",
})
export class SkillPriorityDetails extends SkillBasePriorityDetails {
  @ManyToMany({ entity: () => Skills, joinColumn: "join_id" })
  skillOptionList: Collection<Skills> = new Collection<Skills>(this);

  @OneToOne(() => TalentPriorityDetails, (talent) => talent.includedSkills, {
    owner: true,
    ref: true,
  })
  override talentPriorityDetails!: Ref<TalentPriorityDetails>;

  constructor(dto: IncludedSkillOptionsType) {
    super(dto);
  }
}

@Entity({
  discriminatorValue: "SkillSourcePriorityDetails",
})
export class SkillSourcePriorityDetails extends SkillBasePriorityDetails {
  @Enum({ items: () => skillTalentSourceEnum })
  source!: skillTalentSourceEnum;

  @OneToOne(
    () => TalentPriorityDetails,
    (talent) => talent.includedSkillSource,
    {
      owner: true,
      ref: true,
    }
  )
  override talentPriorityDetails!: Ref<TalentPriorityDetails>;

  constructor(dto: IncludedSkillSourceType) {
    super(dto);
    this.source = dto.source;
  }
}

@Entity({
  discriminatorValue: "SkillGroupPriorityDetails",
})
export class SkillGroupPriorityDetails extends SkillBasePriorityDetails {
  @ManyToMany({ entity: () => SkillGroups, joinColumn: "join_id" })
  skillGroupList: Collection<SkillGroups> = new Collection<SkillGroups>(this);

  @OneToOne(
    () => TalentPriorityDetails,
    (talent) => talent.includedSkillGroups,
    {
      owner: true,
      ref: true,
    }
  )
  override talentPriorityDetails!: Ref<TalentPriorityDetails>;

  constructor(dto: SkillGroupType) {
    super(dto);
  }
}
