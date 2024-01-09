import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import {
  spellCategoryEnum,
  damageTypeEnum,
  spellDescriptorEnum,
  durationEnum,
  spellTypeEnum,
  sourceBookEnum,
} from "@shadowrun/common/build/enums.js";
import type { BonusType } from "@shadowrun/common/build/schemas/shared/bonusSchemas.js";
import type {
  spellRangeType,
  SpellType,
} from "@shadowrun/common/build/schemas/spellSchemas.js";
import type { RequirementsType } from "@shadowrun/common/src/schemas/shared/requiredSchemas.js";

@Entity()
export class Spells {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum(() => spellCategoryEnum)
  category!: spellCategoryEnum;

  @Enum(() => spellTypeEnum)
  type!: spellTypeEnum;

  @Enum(() => damageTypeEnum)
  damageType!: damageTypeEnum;

  @Enum({
    items: () => spellDescriptorEnum,
    array: true,
  })
  descriptorList!: Array<spellDescriptorEnum>;

  @Enum(() => durationEnum)
  duration!: durationEnum;

  @Property({ type: "json" })
  range!: spellRangeType;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: SpellType) {
    this.name = dto.name;
    this.category = dto.category;
    this.type = dto.type;
    this.damageType = dto.damageType;
    this.descriptorList = dto.descriptorList;
    this.duration = dto.duration;
    this.range = dto.range;
    if (dto.bonus !== undefined) this.bonus = dto.bonus;
    if (dto.requirements !== undefined) this.requirements = dto.requirements;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
