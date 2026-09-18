import {
  CritterPowerRequirements,
  CritterPowerForbidden,
} from "../otherData/requirementsModel.js";
import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  OneToOne,
  type Ref,
  Unique,
} from "@mikro-orm/postgresql";
import { critterPowerCategoryEnum, sourceBookEnum } from "@neon-codex/common";
import { CritterPowersBonuses } from "../otherData/bonusModel.js";
import type {
  CritterActionType,
  CritterPowerDurationType,
  CritterPowerRangeType,
  CritterPowerRatingType,
  CritterPowerType,
  CritterPowerTypeType,
} from "@neon-codex/common";

@Entity()
@Unique({
  properties: ["name", "category"],
  name: "All critter powers with the same category are unique",
})
export class CritterPowers {
  @PrimaryKey()
  id!: number;

  // Not unique as there can be a normal/paranormal version
  // with the same name
  @Property({ length: 255 })
  name!: string;

  @Enum({ items: () => critterPowerCategoryEnum })
  category!: critterPowerCategoryEnum;

  @Property({ nullable: true })
  karmaCost?: number;

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

  @OneToOne(() => CritterPowersBonuses, (bonus) => bonus.critterPower, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<CritterPowersBonuses>;

  @OneToOne(
    () => CritterPowerRequirements,
    (req) => req.requirementCritterPower,
    {
      owner: true,
      nullable: true,
      ref: true,
    }
  )
  requirements?: Ref<CritterPowerRequirements>;

  @OneToOne(() => CritterPowerForbidden, (req) => req.forbiddenCritterPower, {
    owner: true,
    nullable: true,
    ref: true,
  })
  forbidden?: Ref<CritterPowerForbidden>;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: CritterPowerType) {
    this.name = dto.name;
    this.category = dto.category;
    if (dto.karmaCost !== undefined) {
      this.karmaCost = dto.karmaCost;
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
    // bonus is linked in seeder via CritterPowersBonuses
    // requirements is linked by seeder
    // forbidden is linked by seeder
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
