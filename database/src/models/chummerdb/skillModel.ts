import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import type { SkillType } from "@shadowrun/common";
import {
  attributeTypeEnum,
  skillCategoryEnum,
} from "@shadowrun/common/build/enums.js";

@Entity()
export class Skills {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum(() => attributeTypeEnum)
  attribute!: attributeTypeEnum;

  @Enum(() => skillCategoryEnum)
  category!: skillCategoryEnum;

  @Property()
  default!: boolean;

  @Property()
  exotic!: boolean;

  @Property({ nullable: true })
  skillGroup?: string;

  @Property({ type: "string[]", nullable: true })
  specialisations?: Array<string>;

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
    if (dto.skillGroup !== undefined) this.skillGroup = dto.skillGroup;
    if (dto.specialisations !== undefined)
      this.specialisations = dto.specialisations;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}