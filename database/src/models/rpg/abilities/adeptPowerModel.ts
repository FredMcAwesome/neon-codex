import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import { actionEnum, sourceBookEnum } from "@neon-codex/common/build/enums.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import type { AdeptPowerType } from "@neon-codex/common/build/schemas/abilities/talent/adeptPowerSchemas.js";

@Entity()
export class AdeptPowers {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Property()
  pointCost!: number;

  @Property({ nullable: true })
  extraFirstLevelPointCost?: number;

  @Property()
  levels!: boolean;

  @Property()
  limit!: number;

  @ManyToMany({ entity: () => AdeptPowers, owner: true })
  sharedLimitAdeptPowerList = new Collection<AdeptPowers>(this);

  @Enum({ items: () => actionEnum, nullable: true })
  action?: actionEnum;

  @Property({ nullable: true })
  adeptWayPointCost?: number;

  @Property({ type: "json", nullable: true })
  adeptWayRequirements?: RequirementsType;

  @Property({ nullable: true })
  doubleCost?: false;

  @Property({ nullable: true })
  maxLevels?: number;

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

  constructor(dto: AdeptPowerType) {
    this.name = dto.name;
    this.pointCost = dto.pointCost;
    if (dto.extraFirstLevelPointCost !== undefined) {
      this.extraFirstLevelPointCost = dto.extraFirstLevelPointCost;
    }
    this.levels = dto.levels;
    this.limit = dto.limit;
    if (dto.action !== undefined) this.action = dto.action;
    if (dto.adeptWay !== undefined) {
      this.adeptWayPointCost = dto.adeptWay.pointCost;
      if (dto.adeptWay.requirements !== undefined) {
        this.adeptWayRequirements = dto.adeptWay.requirements;
      }
    }
    if (dto.doubleCost !== undefined) {
      this.doubleCost = dto.doubleCost;
    }
    if (dto.maxLevels !== undefined) {
      this.maxLevels = dto.maxLevels;
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
