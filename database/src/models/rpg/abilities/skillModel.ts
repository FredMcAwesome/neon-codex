import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
  type Ref,
} from "@mikro-orm/postgresql";
import type { SkillType } from "@neon-codex/common/build/schemas/abilities/skillSchemas.js";
import {
  attributeTypeEnum,
  skillCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import { SkillGroups } from "./skillGroupModel.js";

@Entity()
export class Skills {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => attributeTypeEnum)
  attribute!: attributeTypeEnum;

  @Enum(() => skillCategoryEnum)
  category!: skillCategoryEnum;

  @Property()
  default!: boolean;

  @Property()
  exotic!: boolean;

  @ManyToOne({ entity: () => SkillGroups, ref: true, nullable: true })
  skillGroup?: Ref<SkillGroups>;

  @Property({ type: "string[]", nullable: true })
  defaultSpecialisations?: Array<string>;

  @Property()
  source!: string;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: SkillType) {
    this.name = dto.name;
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
