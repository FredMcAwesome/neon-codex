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
import { talentCategoryEnum } from "@neon-codex/common/build/enums.js";
import type { TalentPriorityType } from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import { Qualities } from "../traits/qualityModel.js";
import {
  SkillGroupPriorityDetails,
  SkillPriorityDetails,
  SkillSourcePriorityDetails,
} from "./skillPriorityDetailModel.js";
import { Priorities } from "./priorityModel.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
@Entity()
export abstract class TalentPriorityDetails {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum(() => talentCategoryEnum)
  type!: talentCategoryEnum;

  @Property()
  @Unique()
  label!: string;

  @ManyToOne({ entity: () => Qualities, ref: true, nullable: true })
  includedQuality?: Ref<Qualities>;

  @OneToOne({ entity: () => SkillPriorityDetails, nullable: true })
  includedSkills?: SkillPriorityDetails;

  @OneToOne({ entity: () => SkillSourcePriorityDetails, nullable: true })
  includedSkillSource?: SkillSourcePriorityDetails;

  @OneToOne({ entity: () => SkillGroupPriorityDetails, nullable: true })
  includedSkillGroups?: SkillGroupPriorityDetails;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property({ type: "json", nullable: true })
  forbidden?: RequirementsType;

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
