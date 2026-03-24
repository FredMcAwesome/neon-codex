import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
import {
  spellCategoryEnum,
  damageTypeEnum,
  spellDescriptorEnum,
  durationEnum,
  spellTypeEnum,
  sourceBookEnum,
} from "@neon-codex/common";
import type { spellDamageType, SpellType } from "@neon-codex/common";
import type { RequirementsType } from "@neon-codex/common";
import type { spellRangeType } from "@neon-codex/common";
import { SpellsBonuses } from "../otherData/bonusModel.js";

@Entity()
export class Spells {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum({ items: () => spellCategoryEnum })
  category!: spellCategoryEnum;

  @Enum({ items: () => spellTypeEnum })
  type!: spellTypeEnum;

  @Enum({ items: () => damageTypeEnum })
  damageType!: damageTypeEnum;

  @Enum({
    items: () => spellDescriptorEnum,
    array: true,
  })
  descriptorList!: Array<spellDescriptorEnum>;

  @Enum({ items: () => durationEnum })
  duration!: durationEnum;

  @Property()
  damage!: spellDamageType;

  @Property({ type: "json" })
  range!: spellRangeType;

  @OneToOne(() => SpellsBonuses, (bonus) => bonus.spell, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<SpellsBonuses>;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Enum({ items: () => sourceBookEnum })
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
    this.damage = dto.damage;
    this.range = dto.range;
    // bonus is linked in seeder via SpellsBonuses
    if (dto.requirements !== undefined) this.requirements = dto.requirements;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
