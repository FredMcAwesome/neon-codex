import {
  AdeptPowerAdeptWayRequirements,
  AdeptPowerRequirements,
  AdeptPowerForbidden,
} from "../otherData/requirementsModel.js";
import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
import { actionEnum, sourceBookEnum } from "@neon-codex/common";
import type { AdeptPowerType } from "@neon-codex/common";
import { AdeptPowersBonuses } from "../otherData/bonusModel.js";

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

  @OneToOne(
    () => AdeptPowerAdeptWayRequirements,
    (req) => req.requirementAdeptPower,
    {
      owner: true,
      nullable: true,
      ref: true,
    }
  )
  adeptWayRequirements?: Ref<AdeptPowerAdeptWayRequirements>;

  @Property({ nullable: true })
  doubleCost?: false;

  @Property({ nullable: true })
  maxLevels?: number;

  @Property({ nullable: true })
  userSelectable?: false;

  @OneToOne(() => AdeptPowersBonuses, (bonus) => bonus.adeptPower, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<AdeptPowersBonuses>;

  @OneToOne(() => AdeptPowerRequirements, (req) => req.forbiddenAdeptPower, {
    owner: true,
    nullable: true,
    ref: true,
  })
  requirements?: Ref<AdeptPowerRequirements>;

  @OneToOne(() => AdeptPowerForbidden, (req) => req.forbiddenAdeptPower, {
    owner: true,
    nullable: true,
    ref: true,
  })
  forbidden?: Ref<AdeptPowerForbidden>;

  @Enum({ items: () => sourceBookEnum })
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
      // adeptWayRequirements is linked by seeder
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
    // bonus is linked in seeder via AdeptPowersBonuses
    // requirements is linked by seeder
    // forbidden is linked by seeder
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
