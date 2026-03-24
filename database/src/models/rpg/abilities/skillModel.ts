import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
  type Ref,
} from "@mikro-orm/postgresql";
import type { SkillType } from "@neon-codex/common";
import {
  attributeTypeEnum,
  skillCategoryEnum,
  sourceBookEnum,
} from "@neon-codex/common";
import { SkillGroups } from "./skillGroupModel.js";

@Entity()
@Unique({
  properties: ["name", "isKnowledgeSkill"],
  name: "All active skills are unique, and all knowledge skills are unique",
})
export class Skills {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Property()
  isKnowledgeSkill!: boolean;

  @Enum({ items: () => attributeTypeEnum })
  attribute!: attributeTypeEnum;

  @Enum({ items: () => skillCategoryEnum })
  category!: skillCategoryEnum;

  @Property()
  default!: boolean;

  @Property()
  exotic!: boolean;

  @ManyToOne({ entity: () => SkillGroups, ref: true, nullable: true })
  skillGroup?: Ref<SkillGroups>;

  @Property({ type: "string[]", nullable: true })
  defaultSpecialisations?: Array<string>;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: SkillType) {
    this.name = dto.name;
    this.isKnowledgeSkill = dto.isKnowledgeSkill;
    this.attribute = dto.attribute;
    this.category = dto.category;
    this.default = dto.default;
    this.exotic = dto.exotic;
    // if (dto.skillGroup !== undefined) this.skillGroup = dto.skillGroup;
    if (dto.specialisations !== undefined)
      this.defaultSpecialisations = dto.specialisations;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
