import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/postgresql";
import {
  critterPowerEnum,
  sourceBookEnum,
} from "@neon-codex/common/build/enums.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import type {
  CritterActionType,
  CritterPowerDurationType,
  CritterPowerRangeType,
  CritterPowerRatingType,
  CritterPowerType,
  CritterPowerTypeType,
} from "@neon-codex/common/build/schemas/abilities/magic/critterPowerSchemas.js";

@Entity()
export class CritterPowers {
  @PrimaryKey()
  id!: number;

  // Not unique as there can be a normal/paranormal version
  // with the same name
  @Property({ length: 255 })
  name!: string;

  @Enum(() => critterPowerEnum)
  category!: critterPowerEnum;

  @Property({ nullable: true })
  karma?: number;

  @Property({ type: "json", nullable: true })
  rating?: CritterPowerRatingType;

  @Property({ type: "json", nullable: true })
  type?: CritterPowerTypeType;

  @Property({ type: "json", nullable: true })
  action?: CritterActionType;

  @Property({ type: "json", nullable: true })
  range?: CritterPowerRangeType;

  @Property({ type: "json", nullable: true })
  duration?: CritterPowerDurationType;

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property({ type: "json", nullable: true })
  forbidden?: RequirementsType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: CritterPowerType) {
    this.name = dto.name;
    this.category = dto.category;
    if (dto.karma !== undefined) {
      this.karma = dto.karma;
    }
    if (dto.rating !== undefined) {
      this.rating = dto.rating;
    }
    if (dto.type !== undefined) {
      this.type = dto.type;
    }
    if (dto.action !== undefined) {
      this.action = dto.action;
    }
    if (dto.range !== undefined) {
      this.range = dto.range;
    }
    if (dto.duration !== undefined) {
      this.duration = dto.duration;
    }
    if (dto.userSelectable !== undefined) {
      this.userSelectable = dto.userSelectable;
    }
    if (dto.bonus !== undefined) this.bonus = dto.bonus;
    if (dto.requirements !== undefined) this.requirements = dto.requirements;
    if (dto.forbidden !== undefined) this.forbidden = dto.forbidden;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
