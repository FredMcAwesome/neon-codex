import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import {
  priorityCategoryEnum,
  priorityLetterEnum,
  priorityTableRunnerLevelEnum,
} from "@neon-codex/common/build/enums.js";
import type { PriorityType } from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import { HeritagePriorityDetails } from "./heritagePriorityDetailModel.js";
import { TalentPriorityDetails } from "./talentPriorityDetailModel.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
@Entity()
export abstract class Priorities {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum(() => priorityCategoryEnum)
  type!: priorityCategoryEnum;

  @Enum(() => priorityLetterEnum)
  rowLetter!: priorityLetterEnum;

  constructor(dto: PriorityType) {
    this.name = dto.name;
    this.rowLetter = dto.rowLetter;
  }
}

type HeritageType = PriorityType & {
  category: priorityCategoryEnum.Heritage;
};
@Entity({ discriminatorValue: priorityCategoryEnum.Heritage })
export class HeritagePriorities extends Priorities {
  @OneToMany(
    () => HeritagePriorityDetails,
    (heritagePriorityAttributes) => heritagePriorityAttributes.heritagePriority
  )
  heritageList = new Collection<HeritagePriorityDetails>(this);

  constructor(dto: HeritageType) {
    super(dto);
  }
}

type TalentType = PriorityType & {
  category: priorityCategoryEnum.Talent;
};
@Entity({ discriminatorValue: priorityCategoryEnum.Talent })
export class TalentPriorities extends Priorities {
  @OneToMany(
    () => TalentPriorityDetails,
    (talentPriorityAttributes) => talentPriorityAttributes.talentPriority
  )
  talentList = new Collection<TalentPriorityDetails>(this);

  constructor(dto: TalentType) {
    super(dto);
  }
}

type AttributesType = PriorityType & {
  category: priorityCategoryEnum.Attributes;
};
@Entity({ discriminatorValue: priorityCategoryEnum.Attributes })
export class AttributePriorities extends Priorities {
  @Property()
  attributes!: number;

  constructor(dto: AttributesType) {
    super(dto);
    this.attributes = dto.attributes;
  }
}

type SkillsType = PriorityType & {
  category: priorityCategoryEnum.Skills;
};
@Entity({ discriminatorValue: priorityCategoryEnum.Skills })
export class SkillPriorities extends Priorities {
  @Property()
  skillPoints!: number;

  @Property()
  skillGroupPoints!: number;

  constructor(dto: SkillsType) {
    super(dto);
    this.skillPoints = dto.skillPoints;
    this.skillGroupPoints = dto.skillGroupPoints;
  }
}

type ResourcesType = PriorityType & {
  category: priorityCategoryEnum.Resources;
};
@Entity({ discriminatorValue: priorityCategoryEnum.Resources })
export class ResourcePriorities extends Priorities {
  @Enum(() => priorityTableRunnerLevelEnum)
  priorityTable!: priorityTableRunnerLevelEnum;

  @Property()
  resources!: number;

  constructor(dto: ResourcesType) {
    super(dto);
    this.priorityTable = dto.priorityTable;
    this.resources = dto.resources;
  }
}
