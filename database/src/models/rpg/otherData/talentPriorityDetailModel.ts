import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
  type Ref,
  OneToOne,
} from "@mikro-orm/postgresql";
import { talentCategoryEnum } from "@neon-codex/common";
import type { TalentPriorityType } from "@neon-codex/common";
import { Qualities } from "../traits/qualityModel.js";
import {
  SkillGroupPriorityDetails,
  SkillPriorityDetails,
  SkillSourcePriorityDetails,
} from "./skillPriorityDetailModel.js";
import { Priorities } from "./priorityModel.js";
import {
  TalentPriorityDetailRequirements,
  TalentPriorityDetailForbidden,
} from "./requirementsModel.js";

@Entity({
  discriminatorColumn: "category",
  abstract: true,
})
export abstract class TalentPriorityDetails {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum({ items: () => talentCategoryEnum })
  category!: talentCategoryEnum;

  @Property()
  @Unique()
  label!: string;

  @ManyToOne({ entity: () => Qualities, ref: true, nullable: true })
  includedQuality?: Ref<Qualities>;

  @OneToOne({
    entity: () => SkillPriorityDetails,
    mappedBy: (skill) => skill.talentPriorityDetails,
    nullable: true,
  })
  includedSkills?: SkillPriorityDetails;

  @OneToOne({
    entity: () => SkillSourcePriorityDetails,
    mappedBy: (skill) => skill.talentPriorityDetails,
    nullable: true,
  })
  includedSkillSource?: SkillSourcePriorityDetails;

  @OneToOne({
    entity: () => SkillGroupPriorityDetails,
    mappedBy: (skillGroups) => skillGroups.talentPriorityDetails,
    nullable: true,
  })
  includedSkillGroups?: SkillGroupPriorityDetails;

  @OneToOne(
    () => TalentPriorityDetailRequirements,
    (req) => req.requirementTalentPriorityDetail,
    { owner: true, nullable: true, ref: true }
  )
  requirements?: Ref<TalentPriorityDetailRequirements>;

  @OneToOne(
    () => TalentPriorityDetailForbidden,
    (req) => req.forbiddenTalentPriorityDetail,
    { owner: true, nullable: true, ref: true }
  )
  forbidden?: Ref<TalentPriorityDetailForbidden>;

  @ManyToOne({ entity: () => Priorities, ref: true })
  talentPriority!: Ref<Priorities>;

  constructor(dto: TalentPriorityType) {
    this.name = dto.name;
    this.label = dto.label;
  }
}

type MagicTalentPriorityType = TalentPriorityType & {
  category: talentCategoryEnum.Magic;
};
@Entity({ discriminatorValue: talentCategoryEnum.Magic })
export class MagicTalentPriorityDetails extends TalentPriorityDetails {
  @Property()
  magic!: number;

  @Property({ nullable: true })
  formulae?: number;

  constructor(dto: MagicTalentPriorityType) {
    super(dto);
    this.magic = dto.magic;
    if (dto.formulae !== undefined) {
      this.formulae = dto.formulae;
    }
  }
}

type ResonanceTalentPriorityType = TalentPriorityType & {
  category: talentCategoryEnum.Resonance;
};
@Entity({ discriminatorValue: talentCategoryEnum.Resonance })
export class ResonanceTalentPriorityDetails extends TalentPriorityDetails {
  @Property()
  resonance!: number;

  @Property()
  complexForms!: number;

  constructor(dto: ResonanceTalentPriorityType) {
    super(dto);
    this.resonance = dto.resonance;
    this.complexForms = dto.complexForms;
  }
}

type DepthTalentPriorityType = TalentPriorityType & {
  category: talentCategoryEnum.Depth;
};
@Entity({ discriminatorValue: talentCategoryEnum.Depth })
export class DepthTalentPriorityDetails extends TalentPriorityDetails {
  @Property()
  depth!: number;

  constructor(dto: DepthTalentPriorityType) {
    super(dto);
    this.depth = dto.depth;
  }
}

type MundaneTalentPriorityType = TalentPriorityType & {
  category: talentCategoryEnum.Mundane;
};
@Entity({ discriminatorValue: talentCategoryEnum.Mundane })
export class MundaneTalentPriorityDetails extends TalentPriorityDetails {
  constructor(dto: MundaneTalentPriorityType) {
    super(dto);
  }
}
